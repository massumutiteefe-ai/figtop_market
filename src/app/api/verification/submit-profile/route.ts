import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const dataPackage = await request.formData();

    // Route the entire package directly down to your running XAMPP Apache execution thread
    const phpPipelineResponse = await fetch("https://onrender.comsubmit_verification.php", {
      method: "POST",
      body: dataPackage, // Forwards fields and files instantly down to PHP
    });

    const phpResult = await phpPipelineResponse.json();

    if (phpResult.success) {
      return NextResponse.json({ success: true });
    } else {
      console.error("[PHP ENGINE FAILURE]", phpResult.error);
      return NextResponse.json({ error: phpResult.error || "PHP pipeline failed" }, { status: 400 });
    }

  } catch (error: any) {
    console.error("[CRITICAL PIPELINE EXCEPTION ERROR]", error);
    return NextResponse.json({ error: "Internal node network route failure" }, { status: 500 });
  }
}