import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const expectedUser = process.env.ADMIN_ROOT_USER;
    const expectedPass = process.env.ADMIN_ROOT_PASS;

    // Strict value gate matching the single system root account
    if (username !== expectedUser || password !== expectedPass) {
      return NextResponse.json({ error: "Access Denied: Terminal mismatch credentials." }, { status: 401 });
    }

    // Generate a secure confirmation string for the panel dashboard session guard
    const syntheticAdminToken = Buffer.from(`${expectedUser}:${Date.now()}`).toString("base64");

    return NextResponse.json({ success: true, token: syntheticAdminToken });
  } catch (error) {
    return NextResponse.json({ error: "System authentication error." }, { status: 500 });
  }
}