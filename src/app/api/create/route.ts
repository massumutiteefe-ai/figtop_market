import { NextResponse } from "next/server";

if (!(global as any).sharedGlobalExpertsList) {
  (global as any).sharedGlobalExpertsList = [];
}
const globalExpertsDb = (global as any).sharedGlobalExpertsList;

export async function GET() {
  return NextResponse.json({ experts: globalExpertsDb }, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, specialty } = body; // Notice we left out the heavy avatar string here

    if (!name || !specialty) {
      return NextResponse.json({ error: "Missing name or specialty fields" }, { status: 400 });
    }

    const newLiveExpert = {
      id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: name,
      avatar: "", // We will attach the avatar in the browser using localStorage later
      roi: "0.0%",
      winRate: "0.0%",
      copiers: 0,
      riskScore: "Medium",
      specialty: `${specialty} Specialist`,
      isVerified: false,
    };

    globalExpertsDb.unshift(newLiveExpert);

    return NextResponse.json({ success: true, profile: newLiveExpert }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}