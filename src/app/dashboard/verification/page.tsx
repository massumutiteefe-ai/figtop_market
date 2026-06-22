"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdvancedVerificationWizard() {
  const router = useRouter();
  
  // FIXED: Resetting the state index parameter to 1 ensures the wizard properly kicks off at Phase 1
  const [phase, setPhase] = useState(1); 
  
  const [isEmailVerified, setIsEmailVerified] = useState(false); // Keeps phase 2 locked until OTP check clears
  const [otpCodeSent, setOtpCodeSent] = useState(false);
  const [userEnteredOtp, setUserEnteredOtp] = useState("");
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Consolidated client state tracking object
  const [formData, setFormData] = useState({
    // Phase 1: Account fields
    fullName: "",
    emailAddress: "patronathena6@gmail.com", // Populates your authenticated user field reference
    phoneNumber: "",
    
    // Phase 2: Personal fields
    age: "",
    gender: "",
    homeAddress: "",
    jobTitle: "",
    nationality: "",
    stateRegion: "",

    // Phase 3: Image / Identity targets
    documentType: "National ID / NIN",
    documentIdNumber: "",
    uploadedFile: null as File | null,
  });

  // Action: Requests server routing node to issue temporary token
  const handleRequestVerificationCode = async () => {
    setSendingCode(true);
    try {
      const res = await fetch("/api/verification/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.emailAddress }),
      });
      if (res.ok) setOtpCodeSent(true);
    } catch (err) {
      console.error("OTP delivery pipeline error:", err);
    } finally {
      setSendingCode(false);
    }
  };

  // Action: Matches token client side versus server validation node
  const handleCheckVerificationCode = async () => {
    setVerifyingCode(true);
    try {
      const res = await fetch("/api/verification/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.emailAddress, code: userEnteredOtp }),
      });
      if (res.ok) {
        setIsEmailVerified(true);
        alert("Email confirmed successfully! You can now proceed to the next phase.");
      } else {
        alert("Invalid authorization security token. Check credentials and retry.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setVerifyingCode(false);
    }
  };

  const processNextPhase = async () => {
    if (phase === 1) {
      if (!formData.fullName || !formData.phoneNumber) {
        alert("Please provide your full legal name and phone number to continue.");
        return;
      }
      if (!isEmailVerified) {
        alert("You must verify your email address via token sequence before continuing.");
        return;
      }
      setPhase(2);
    } else if (phase === 2) {
      if (!formData.age || !formData.gender || !formData.homeAddress || !formData.jobTitle || !formData.nationality || !formData.stateRegion) {
        alert("Please fill in all mandatory fields before moving to the identity phase.");
        return;
      }
      setPhase(3);
    } else if (phase === 3) {
      if (!formData.documentIdNumber || !formData.uploadedFile) {
        alert("Please enter your document number and upload a valid image of your credential.");
        return;
      }
      
      setIsSubmitting(true);
      try {
        const submissionPayload = new FormData();
        submissionPayload.append("email", formData.emailAddress);
        submissionPayload.append("fullName", formData.fullName);
        submissionPayload.append("phoneNumber", formData.phoneNumber);
        submissionPayload.append("age", formData.age);
        submissionPayload.append("gender", formData.gender);
        submissionPayload.append("homeAddress", formData.homeAddress);
        submissionPayload.append("jobTitle", formData.jobTitle);
        submissionPayload.append("nationality", formData.nationality);
        submissionPayload.append("stateRegion", formData.stateRegion);
        submissionPayload.append("documentType", formData.documentType);
        submissionPayload.append("documentIdNumber", formData.documentIdNumber);
        if (formData.uploadedFile) {
          submissionPayload.append("file", formData.uploadedFile);
        }

        const response = await fetch("/api/verification/submit-profile", {
          method: "POST",
          body: submissionPayload,
        });

        if (response.ok) {
          setShowSuccessModal(true);
        } else {
          alert("Submission processing error. Please check parameters and retry.");
        }
      } catch (err) {
        console.error("Critical submission failure node point:", err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0e12] text-white p-6 flex flex-col items-center justify-center relative font-sans">
      <div className="w-full max-w-lg bg-[#16181f] rounded-xl p-8 border border-gray-800 shadow-2xl">
        
        {/* Phase Timeline Tracker Navigation Anchor */}
        <div className="flex justify-between items-center mb-10 border-b border-gray-800 pb-6">
          {[
            { id: 1, label: "Account" },
            { id: 2, label: "Personal" },
            { id: 3, label: "Identity Upload" }
          ].map((p) => (
            <div key={p.id} className="flex flex-col items-center flex-1 relative">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
                phase >= p.id ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" : "bg-gray-800 text-gray-500"
              }`}>
                {p.id}
              </div>
              <span className={`text-[11px] mt-2 font-semibold tracking-wide uppercase ${phase >= p.id ? "text-blue-400" : "text-gray-500"}`}>{p.label}</span>
            </div>
          ))}
        </div>

        {/* ================= PHASE 1: ACCOUNT LAYOUT ================= */}
        {phase === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h3 className="text-base font-bold text-gray-200">Phase 1: Account Initialization</h3>
              <p className="text-xs text-gray-500 mb-4">Confirm your core credentials and pass security checks.</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2">Full Name *</label>
              <input 
                type="text" 
                className="w-full bg-[#1c1f26] border border-gray-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter formal legal name"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2">Phone Number *</label>
              <input 
                type="tel" 
                className="w-full bg-[#1c1f26] border border-gray-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="+1 (555) 000-0000"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              />
            </div>
            <div>
  <label className="block text-xs font-semibold text-gray-400 mb-2">Email Address *</label>
  <div className="flex space-x-2">
    <input 
      type="email" 
      className="flex-1 bg-[#1c1f26] border border-gray-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
      placeholder="name@example.com"
      value={formData.emailAddress}
      onChange={(e) => setFormData({...formData, emailAddress: e.target.value})} 
    />
    <button
      type="button"
      onClick={handleRequestVerificationCode}
      disabled={sendingCode || isEmailVerified}
      className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 rounded-lg text-xs transition-colors disabled:opacity-40"
    >
      {isEmailVerified ? "Verified ✓" : sendingCode ? "Sending Code..." : "Verify Email"}
    </button>
  </div>
</div>
  

            {otpCodeSent && !isEmailVerified && (
              <div className="bg-blue-950/20 border border-blue-900/60 rounded-xl p-4 mt-4 space-y-3">
                <label className="block text-xs font-semibold text-blue-400">Enter Security Access Token String *</label>
                <div className="flex space-x-2">
                  <input 
                    type="text" 
                    maxLength={6}
                    placeholder="######"
                    className="w-full bg-[#1c1f26] border border-blue-500/40 rounded-lg p-3 text-center font-mono text-base tracking-widest text-white focus:outline-none"
                    value={userEnteredOtp}
                    onChange={(e) => setUserEnteredOtp(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleCheckVerificationCode}
                    disabled={verifyingCode}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-5 rounded-lg text-xs font-bold transition-colors"
                  >
                    {verifyingCode ? "Verifying..." : "Confirm"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
         
         {/* DYNAMIC TOKEN INPUT DROP-DOWN SECTION */}
{otpCodeSent && !isEmailVerified && (
  <div className="bg-blue-950/20 border border-blue-900/60 rounded-xl p-5 mt-4 space-y-3 animate-fadeIn">
    <div className="text-left">
      <label className="block text-xs font-semibold text-blue-400 uppercase tracking-wider">
        Enter 6-Digit Security Verification Token *
      </label>
      <p className="text-[11px] text-gray-500 mt-0.5">
        Check your email inbox or spam folder for the access code string.
      </p>
    </div>
    
    <div className="flex space-x-2">
      <input 
        type="text" 
        maxLength={6}
        placeholder="######"
        className="w-full bg-[#1c1f26] border border-blue-500/40 rounded-lg p-3 text-center font-mono text-lg tracking-[0.5em] text-white focus:outline-none focus:border-blue-500 transition-colors"
        value={userEnteredOtp}
        onChange={(e) => setUserEnteredOtp(e.target.value)}
      />
      <button
        type="button"
        onClick={handleCheckVerificationCode}
        disabled={verifyingCode}
        className="bg-blue-600 hover:bg-blue-500 text-white px-6 rounded-lg text-xs font-bold transition-colors"
      >
        {verifyingCode ? "Verifying..." : "Confirm Code"}
      </button>
    </div>
  </div>
)}
        
        {/* ================= PHASE 2: PERSONAL LAYOUT ================= */}
        {phase === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h3 className="text-base font-bold text-gray-200">Phase 2: Profile Demographics</h3>
              <p className="text-xs text-gray-500 mb-4">Please input your matching government information profile parameters.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2">Age *</label>
                <input 
                  type="number" 
                  placeholder="25"
                  className="w-full bg-[#1c1f26] border border-gray-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2">Sex / Gender *</label>
                <select 
                  className="w-full bg-[#1c1f26] border border-gray-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                >
                  <option value="">Select Option</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other / Prefer Not Say</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2">Home Address *</label>
              <input 
                type="text" 
                className="w-full bg-[#1c1f26] border border-gray-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Street address line components, Suite, Apt"
                value={formData.homeAddress}
                onChange={(e) => setFormData({...formData, homeAddress: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2">Current Occupation / Job *</label>
              <input 
                type="text" 
                className="w-full bg-[#1c1f26] border border-gray-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Financial Analyst, Trader, etc."
                value={formData.jobTitle}
                onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2">Nationality *</label>
                <input 
                  type="text" 
                  className="w-full bg-[#1c1f26] border border-gray-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="e.g. American"
                  value={formData.nationality}
                  onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2">State / Region *</label>
                <input 
                  type="text" 
                  className="w-full bg-[#1c1f26] border border-gray-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="e.g. California"
                  value={formData.stateRegion}
                  onChange={(e) => setFormData({...formData, stateRegion: e.target.value})}
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= PHASE 3: IMAGE & IDENTITY LAYOUT ================= */}
        {phase === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h3 className="text-base font-bold text-gray-200">Phase 3: Identity & Credential Capture</h3>
              <p className="text-xs text-gray-500 mb-4">Select and upload clear proof files matching your identity profile parameters.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2">Select Valid Credential Type *</label>
              <select 
                className="w-full bg-[#1c1f26] border border-gray-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                value={formData.documentType}
                onChange={(e) => setFormData({...formData, documentType: e.target.value})}
              >
                <option value="National ID / NIN">National ID / NIN (Country Dependent)</option>
                <option value="International Passport">International Passport</option>
                <option value="Drivers License">Driver's License</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2">Document Serial / Identification Number *</label>
              <input 
                type="text" 
                className="w-full bg-[#1c1f26] border border-gray-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter unique identification sequence token card number"
                value={formData.documentIdNumber}
                onChange={(e) => setFormData({...formData, documentIdNumber: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2">Upload Clear Image Asset Document File *</label>
              <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 bg-[#1c1f26] hover:border-blue-500 transition-colors text-center cursor-pointer relative">
                <input 
                  type="file" 
                  id="document-file" 
                  className="hidden" 
                  accept="image/*,application/pdf"
                  onChange={(e) => setFormData({...formData, uploadedFile: e.target.files?.[0] || null})}
                />
                <label htmlFor="document-file" className="cursor-pointer block">
                  <div className="mx-auto w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center mb-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-400">Click to attach high-resolution photos or identity scans</p>
                  <span className="mt-3 inline-block bg-gray-800 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-gray-700 text-gray-300">Choose Image File</span>
                </label>
              </div>
              {formData.uploadedFile && (
                <div className="p-3 bg-emerald-950/20 border border-emerald-900/50 rounded-lg mt-2 flex items-center justify-between">
                  <p className="text-xs text-emerald-400 font-medium truncate">
                    ✓ File Registered: {formData.uploadedFile.name}
                  </p>
                  <span className="text-[10px] text-gray-500 bg-gray-900 px-2 py-0.5 rounded">
                    {(formData.uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Global Control Execution Button */}
        <button 
          onClick={processNextPhase}
          disabled={isSubmitting}
          className="w-full mt-8 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold py-3 rounded-lg text-sm transition-all shadow-md shadow-blue-600/20 flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Processing System Verification Payload...</span>
            </>
          ) : phase === 3 ? (
            "Finish & Submit All Details"
          ) : (
            "Next Phase"
          )}
        </button>
      </div>

      {/* ================= SUCCESS VERIFICATION CONFIRMATION POPUP MODAL ================= */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl transition-transform transform scale-100">
            <div className="w-16 h-16 bg-emerald-50 border-4 border-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Documents Received</h3>
            <p className="text-sm text-gray-600 font-medium leading-relaxed mb-6">
              You Have Successfully Submitted Your Documents. Hold on for Approval.
            </p>
            <button 
              onClick={() => router.push("/dashboard/verification/status")}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
            >
              Acknowledge & Exit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}