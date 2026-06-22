import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET() {
  let connection;
  try {
    // 1. Establish database connection to read user profiles
    connection = await mysql.createConnection(process.env.DATABASE_URL!);

    const [rows]: [any[], any] = await connection.execute(
      "SELECT client_id, surname, last_name, address, country, email, phone FROM register"
    );
    await connection.end();

    if (!rows || rows.length === 0) {
      return NextResponse.json([]);
    }

    // 2. Loop through every client and securely fetch their active balance from your PHP backend
    const clientPromises = rows.map(async (row: any) => {
      const fullName = `${row.surname || ""} ${row.last_name || ""}`.trim();
      const homeAddress = row.address && row.country ? `${row.address}, ${row.country}` : row.address || "N/A";
      const targetId = row.client_id;

      let liveBalanceDisplay = "$0.00";

      if (targetId) {
        try {
          // Hit the exact dashboard API script your BalanceDisplay maps to
          const phpRes = await fetch(
            `http://localhost/figtop-api/get_client_dashboard.php?client_id=${targetId}`,
            { cache: "no-store" } // Ensure freshly updated balances stream live
          );
          
          if (phpRes.ok) {
            const phpData = await phpRes.json();
            // Pull the nested balance string variable from dbData.profile.balance
            const rawBalance = phpData?.profile?.balance || "0.00";
            
            // Format to clean financial typography USD format
            liveBalanceDisplay = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD"
            }).format(Number(rawBalance));
          }
        } catch (apiErr) {
          console.error(`Could not reach PHP balance gateway for user ${targetId}:`, apiErr);
          liveBalanceDisplay = "API Offline";
        }
      }

      return {
        id: targetId || "N/A",
        name: fullName || "Unnamed Client", 
        email: row.email || "No Email",
        phone: row.phone || "No Phone Contact",
        address: homeAddress,
        balance: liveBalanceDisplay, // 🌟 REAL DYNAMIC LIVE BALANCE SYNCED HERE!
        joined: "Live Record"
      };
    });

    // Resolve all background multi-threading tasks completely
    const liveClients = await Promise.all(clientPromises);
    return NextResponse.json(liveClients);

  } catch (error: any) {
    if (connection) await connection.end();
    console.error("❌ Admin Sync Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}