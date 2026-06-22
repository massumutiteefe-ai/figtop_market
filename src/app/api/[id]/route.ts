import { NextResponse } from 'next/server';
// Import your database connection or ORM (Prisma, Mongoose, Supabase, etc.) here

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const clientId = params.id; // This captures 'USR-001' from the URL

  try {
    // Replace this with your actual database query, e.g., prisma.user.findUnique(...)
    const clientData = await db.client.findUnique({ where: { id: clientId } }); 
    
    if (!clientData) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json(clientData);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}