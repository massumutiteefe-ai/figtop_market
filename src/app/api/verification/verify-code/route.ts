import { NextResponse } from "next/server";
import { verificationCodesCache } from "../send-code/route";

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();
    
    if (!email || !code) {
      return NextResponse.json({ error: "Missing verification criteria fields" }, { status: 400 });
    }

    const lowerCaseEmail = email.toLowerCase().trim();
    const storedCode = verificationCodesCache.get(lowerCaseEmail);

    if (storedCode && storedCode === code.trim()) {
      verificationCodesCache.delete(lowerCaseEmail); // Wipe key token to keep cache fresh
      return NextResponse.json({ verified: true });
    }

    return NextResponse.json({ error: "Invalid verification code combination parameter matching failed." }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}