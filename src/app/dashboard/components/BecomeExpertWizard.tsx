"use client";

import React, { useState } from "react";

interface WizardProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileCreated: (newProfile: any) => void;
}

export default function BecomeExpertWizard({ isOpen, onClose, onProfileCreated }: WizardProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("📈");
  const [specialty, setSpecialty] = useState("Crypto");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProceed = () => {
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setIsSubmitting(true);
    
    // Save profile cleanly inside local database array parameters
    setTimeout(() => {
      const newLiveExpert = {
        id: `exp_${Date.now()}`,
        name: name,
        avatar: avatar,
        roi: "0.0%",
        winRate: "0.0%",
        copiers: 0,
        riskScore: "Medium",
        specialty: `${specialty} Specialist`,
        isVerified: false,
      };

      // Read existing stored items list from local DB array mapping layers
      const existingExpertsRaw = localStorage.getItem("local_expert_profiles");
      const existingExperts = existingExpertsRaw ? JSON.parse(existingExpertsRaw) : [];
      
      // Push new record to top of the array stack list
      existingExperts.unshift(newLiveExpert);
      localStorage.setItem("local_expert_profiles", JSON.stringify(existingExperts));

      onProfileCreated(newLiveExpert);
      alert("Your Expert Trader Page has been created successfully!");
      
      // Reset layout configurations
      setStep(1);
      setName("");
      setAvatar("📈");
      setIsSubmitting(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-md bg-[#16181f] border border-gray-800 rounded-2xl p-6 shadow-2xl relative">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white text-sm">✕</button>

        <div className="flex justify-between items-center mb-6 text-xs font-mono text-gray-500">
          <span>STEP {step} OF 3</span>
          <div className="flex gap-1">
            <span className={`w-4 h-1 rounded ${step >= 1 ? "bg-blue-500" : "bg-gray-800"}`} />
            <span className={`w-4 h-1 rounded ${step >= 2 ? "bg-blue-500" : "bg-gray-800"}`} />
            <span className={`w-4 h-1 rounded ${step >= 3 ? "bg-blue-500" : "bg-gray-800"}`} />
          </div>
        </div>

        {step === 1 && (
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Become an Expert Trader</h3>
            <p className="text-xs text-gray-400 mb-6">Choose a recognizable public handle or trading group name.</p>
            <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-2">Display Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Meagan UGC"
              className="w-full bg-[#12131a] border border-gray-800 focus:border-blue-500 text-sm p-3 rounded-xl text-white outline-none"
            />
          </div>
        )}

        {step === 2 && (
          <div className="text-center">
            <h3 className="text-lg font-bold text-white mb-1">Add Profile Image</h3>
            <p className="text-xs text-gray-400 mb-6">Upload an official avatar for your trading brand layout.</p>
            <div className="w-24 h-24 bg-gray-900 border border-gray-800 rounded-full mx-auto flex items-center justify-center overflow-hidden mb-4">
              {avatar.startsWith("data:image") ? (
                <img src={avatar} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl">{avatar}</span>
              )}
            </div>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              className="text-xs text-gray-400 block mx-auto bg-gray-950 p-2 border border-gray-800 rounded cursor-pointer" 
            />
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Select Market Focus</h3>
            <p className="text-xs text-gray-400 mb-6">Specify the primary operational asset portfolio class you analyze.</p>
            <div className="grid grid-cols-2 gap-3">
              {["Crypto", "Forex", "Index", "Stocks"].map((asset) => (
                <button
                  key={asset}
                  type="button"
                  onClick={() => setSpecialty(asset)}
                  className={`p-4 border rounded-xl font-bold text-xs text-center transition ${
                    specialty === asset 
                      ? "bg-blue-600/10 border-blue-500 text-blue-400" 
                      : "bg-[#12131a] border-gray-800 text-gray-400 hover:border-gray-700"
                  }`}
                >
                  {asset}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="flex-1 bg-gray-900 border border-gray-800 hover:bg-gray-800 text-gray-300 py-3 rounded-xl text-xs font-semibold">
              Back
            </button>
          )}
          <button
            onClick={handleProceed}
            disabled={(step === 1 && !name.trim()) || isSubmitting}
            className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 text-white py-3 rounded-xl text-xs font-semibold transition"
          >
            {isSubmitting ? "Generating Page..." : step === 3 ? "Click to Proceed" : "Next Step"}
          </button>
        </div>
      </div>
    </div>
  );
}