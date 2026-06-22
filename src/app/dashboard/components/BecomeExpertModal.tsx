"use client";

import React, { useState } from "react";

interface BecomeExpertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BecomeExpertModal({ isOpen, onClose }: BecomeExpertModalProps) {
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("Forex");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Replace this URL with your actual live backend registration route
      const response = await fetch("/api/expert/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, specialty }),
      });

      if (response.ok) {
        alert("Application submitted successfully! Waiting for admin verification.");
        onClose();
      } else {
        alert("Submission failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#16181f] border border-gray-800 rounded-xl p-6 shadow-2xl relative animate-fadeIn">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white text-sm"
        >
          ✕
        </button>

        <h3 className="text-lg font-bold text-white mb-1">Become an Expert Trader</h3>
        <p className="text-xs text-gray-400 mb-6">Apply to list your portfolio for other investors to copy.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Display Name</label>
            <input
              type="text"
              required
              placeholder="e.g., John Doe (Fx Pro)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#12131a] border border-gray-800 focus:border-blue-500 rounded-lg p-3 text-sm text-white outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Primary Market Specialty</label>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full bg-[#12131a] border border-gray-800 focus:border-blue-500 rounded-lg p-3 text-sm text-white outline-none transition"
            >
              <option value="Forex">Forex</option>
              <option value="Crypto">Crypto</option>
              <option value="Index">Index</option>
              <option value="Stock">Stock</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold py-3 rounded-lg text-xs tracking-wide transition shadow-lg mt-2"
          >
            {isSubmitting ? "Submitting Application..." : "Submit Registration"}
          </button>
        </form>
      </div>
    </div>
  );
}