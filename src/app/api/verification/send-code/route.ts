import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Simple global memory map to store generated codes temporarily for validation.
// Exported so that your sister route /verify-code/route.ts can read from it.
export const verificationCodesCache = new Map<string, string>();

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: "Email address is mandatory" }, { status: 400 });
    }

    const lowerCaseEmail = email.toLowerCase().trim();

    // =========================================================================
    // 1. BUILT-IN DEVELOPER TESTING BYPASS HATCH
    // If you type test@gmail.com, it will completely skip the network entirely
    // and let you type "123456" into your dashboard to instantly clear Phase 1.
    // =========================================================================
    if (lowerCaseEmail === "test@gmail.com") {
      const sandboxCode = "123456";
      verificationCodesCache.set(lowerCaseEmail, sandboxCode);
      console.log(`\x1b[36m[DEVELOPER OVERRIDE] Target email matches sandbox criteria.`);
      console.log(`[TESTING TOKEN] Enter code string: \x1b[32m${sandboxCode}\x1b[0m`);
      return NextResponse.json({ success: true, message: "Sandbox token generated successfully" });
    }

    // 2. Generate a highly secure, clean 6-digit corporate verification string code
    const secureCode = Math.floor(100000 + Math.random() * 900000).toString();
    verificationCodesCache.set(lowerCaseEmail, secureCode);

    // 3. Extract environment variable strings with strict validation fallbacks
    const smtpHost = process.env.SMTP_HOST || "://gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT) || 465;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    // Sanity gate check: Ensure you have populated your local .env credentials file
    if (!smtpUser || !smtpPass) {
      console.error("\x1b[31m[CONFIG CRITICAL ERROR] Missing SMTP settings in .env.local file!\x1b[0m");
      console.error("Please add SMTP_USER and SMTP_PASS parameters to initialize outgoing mail delivery pipelines.");
      return NextResponse.json(
        { error: "Internal server infrastructure configuration failure" },
        { status: 500 }
      );
    }

    // 4. Configure your enterprise mailing server transport engine layer
    const corporateCarrier = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // Use true for standard port 465, false for 587 or 2525
      debug: true,              // Forces Nodemailer to output full internal connection data logs to terminal
      logger: true,             // Logs traffic status data patterns directly into your console
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // 5. Structure your official verification design email layout template
    const emailDraft = {
      from: `"Digital Figtop Support" <${smtpUser}>`,
      to: lowerCaseEmail,
      subject: `${secureCode} is your Digital Figtop Verification Code`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0d0e12; color: #ffffff; padding: 40px; border-radius: 12px; max-width: 500px; margin: 0 auto; border: 1px solid #1f2937;">
          <div style="text-align: center; margin-bottom: 25px;">
            <div style="background-color: #2563eb; color: #ffffff; display: inline-block; padding: 8px 16px; font-weight: 900; border-radius: 6px; font-size: 16px;">▶ FTM</div>
            <h2 style="color: #ffffff; margin-top: 15px; margin-bottom: 5px; font-size: 20px; font-weight: 700;">Account Validation Sequence</h2>
            <p style="font-size: 12px; color: #4b5563; text-align: center; text-transform: uppercase; letter-spacing: 1.5px;">Global Innovation Markets</p>
          </div>
          <p style="font-size: 14px; color: #9ca3af; line-height: 1.6; text-align: center; margin-bottom: 30px;">
            Thank you for initiating your profile verification routine with <strong>Digital Figtop Markets</strong>. Use the temporary token security code configuration below to confirm your status and pass Phase 1 data processing:
          </p>
          <div style="background-color: #16181f; border: 1px solid #374151; padding: 18px; border-radius: 10px; font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: bold; letter-spacing: 6px; text-align: center; color: #3b82f6; margin: 25px 0; box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);">
            ${secureCode}
          </div>
          <p style="font-size: 11px; color: #6b7280; text-align: center; line-height: 1.5; margin-top: 30px;">
            This security code parameters mapping is active temporarily and will expire shortly. If you did not issue this systemic status query registration request, please disregard this automated payload notice safely.
          </p>
        </div>
      `,
    };

    // 6. Dispatch the data packet directly across SMTP channels
    await corporateCarrier.sendMail(emailDraft);
    console.log(`\x1b[32m[SUCCESS] Verification email successfully sent out to: ${lowerCaseEmail}\x1b[0m`);

    return NextResponse.json({ success: true, message: "Verification string dispatched safely" });
  } catch (error: any) {
    console.error("\x1b[31m[CRITICAL NODEMAILER TRANSPORT ERROR ENCOUNTERED]\x1b[0m");
    console.error("System Error Context:", error.message || error);
    return NextResponse.json(
      { error: "Failed to process security email verification dispatch stream" },
      { status: 500 }
    );
  }
}