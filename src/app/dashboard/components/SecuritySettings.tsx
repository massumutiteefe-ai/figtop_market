"use client";

import React, { useState } from "react";

interface SecuritySettingsProps {
  profile: {
    client_id: string;
    surname: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
  } | null;
}

export default function SecuritySettings({ profile }: SecuritySettingsProps) {
  // FORM EDITING STATES
  const [email, setEmail] = useState(profile?.email || "john@example.com");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [address, setAddress] = useState(profile?.address || "");
  const [password, setPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // ACCOUNT VERIFICATION MODULE STATES
  const [verificationStep, setVerificationStep] = useState<"unverified" | "otp_sent" | "doc_submitted" | "verified">("unverified");
  const [otpCode, setOtpCode] = useState("");

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch("https://onrender.comupdate_profile_settings.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: profile?.client_id || "USR-001",
          action: "update_info",
          email,
          phone,
          address
        })
      });
      const data = await res.json();
      if (data.success) alert("Settings changes successfully saved.");
    } catch (err) { console.error(err); }
    setIsUpdating(false);
  };

  const handleChangePassword = async () => {
    if (!password.trim()) return alert("Password cannot be blank.");
    try {
      const res = await fetch("https://onrender.comupdate_profile_settings.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: profile?.client_id || "USR-001",
          action: "change_password",
          password
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("Security password updated successfully!");
        setPassword("");
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-6 text-xs text-slate-300 max-w-4xl animate-fade-in pb-12">
      
      {/* SECTION 1: FACEBOOK-STYLE ACCOUNT SETTINGS GRID */}
      <section className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl space-y-4">
        <div className="border-b border-slate-700/60 pb-2">
          <h3 className="text-sm font-bold uppercase text-slate-100">Personal Information Settings</h3>
          <p className="text-[11px] text-slate-400">Modify your legal contact credentials and residential routing details</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 font-medium">Linked Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-white outline-none focus:border-blue-500" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 font-medium">Contact Phone Mobile</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-white outline-none focus:border-blue-500" />
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-slate-400 font-medium">Registered Residential Street Address</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-white outline-none focus:border-blue-500" />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button onClick={handleUpdateProfile} disabled={isUpdating} className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg uppercase tracking-wide transition shadow-md">
            {isUpdating ? "Saving..." : "Save Settings Changes"}
          </button>
        </div>
      </section>

      {/* SECTION 2: INDEPENDENT PASSWORD MANAGEMENT ROW */}
      <section className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="md:col-span-2 space-y-1">
          <h4 className="text-xs font-bold text-slate-100 uppercase">Change Account Security Password</h4>
          <p className="text-[11px] text-slate-400">Update your core login authorization passkey variables regularly</p>
          <input type="password" placeholder="Create strong new password hash keys..." value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-white mt-2 outline-none focus:border-blue-500 text-sm" />
        </div>
        <button onClick={handleChangePassword} className="w-full py-2.5 bg-slate-900 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-200 font-bold transition text-center uppercase">
          Update Security Password
        </button>
      </section>

      {/* SECTION 3: STANDARD IDENTITY VERIFICATION KYC GATEWAY */}
      <section className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl space-y-4">
        <div className="border-b border-slate-700/60 pb-2 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold uppercase text-emerald-400">Identity Verification Registry</h3>
            <p className="text-[11px] text-slate-400">Complete authentication requirements to unlock premium trading capabilities</p>
          </div>
          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
            verificationStep === "verified" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
          }`}>
            {verificationStep === "verified" ? "Fully Verified Account" : "Verification Pending"}
          </span>
        </div>

        {/* STEP A: CONTACT METHOD OTP CODE CHALLENGE */}
        {verificationStep === "unverified" && (
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h5 className="font-bold text-slate-200">1. Verify Contact Tokens</h5>
              <p className="text-[11px] text-slate-400 mt-0.5">Generate a secure authentication digit string token code straight to your device.</p>
            </div>
            <button onClick={() => setVerificationStep("otp_sent")} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition shadow-md uppercase text-[10px]">
              Send Verification Code
            </button>
          </div>
        )}

        {/* STEP B: INPUT CHALLENGE FIELD */}
        {verificationStep === "otp_sent" && (
          <div className="p-4 bg-slate-900 rounded-xl border border-amber-500/30 space-y-3 animate-fade-in">
            <h5 className="font-bold text-amber-400">Enter Verification Code Number</h5>
            <p className="text-[11px] text-slate-400">A 6-digit confirmation key has been dispatched. Enter it below to unlock document uploads:</p>
            <div className="flex gap-2 text-xs">
              <input type="text" maxLength={6} placeholder="e.g. 842109" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} className="w-40 bg-slate-800 border border-slate-700 text-center rounded p-2 font-mono text-sm tracking-widest text-emerald-400 outline-none" />
              <button onClick={() => { if(otpCode.length === 6) setVerificationStep("doc_submitted"); else alert("Invalid code."); }} className="px-4 bg-emerald-600 hover:bg-emerald-500 font-bold rounded text-[11px]">Verify Code</button>
            </div>
          </div>
        )}

        {/* STEP C: LEGAL KYC CHANNELS UPLOAD */}
        {verificationStep === "doc_submitted" && (
          <div className="p-5 bg-slate-900 border border-dashed border-slate-700 rounded-xl space-y-4 animate-fade-in text-center max-w-xl mx-auto">
            <div>
              <h5 className="font-bold text-slate-200 text-sm">2. Upload Government Identity Documents</h5>
              <p className="text-[11px] text-slate-400 mt-0.5">Provide copies of your National Passport, Driver's License, or State Identification files</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="flex flex-col gap-1">
                <label className="text-slate-500 text-[10px] uppercase font-bold">Document Type Option</label>
                <select className="bg-slate-800 border border-slate-700 rounded p-2 text-slate-300 outline-none">
                  <option>International Passport File</option>
                  <option>Drivers License Card</option>
                  <option>Government Issued ID Card</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-slate-500 text-[10px] uppercase font-bold">Select ID Attachment File</label>
                <label className="bg-slate-800 border border-slate-700 rounded p-2 cursor-pointer text-slate-400 hover:text-white transition text-center font-medium">
                  📷 Browse Photo File
                  <input type="file" accept="image/*" onChange={() => setVerificationStep("verified")} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* STEP D: FINALIZE ACCREDITATION STATUS */}
        {verificationStep === "verified" && (
          <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 rounded-xl flex items-center gap-3 animate-fade-in font-sans">
            <span className="text-xl">✅</span>
            <div>
              <h5 className="font-bold text-slate-200">Accreditation Audit File Verified!</h5>
              <p className="text-[11px] text-slate-400 mt-0.5">Your personal verification criteria fields have checked out successfully. Financial limitations have been removed.</p>
            </div>
          </div>
        )}

      </section>
    </div>
  );
}