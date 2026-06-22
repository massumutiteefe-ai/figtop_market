"use client";

import React from "react";

interface PersonalInfoProps {
  profile: {
    surname: string;
    middle_name?: string;
    last_name: string;
    address: string;
    zip_code: string;
    country: string;
    email: string;
    phone: string;
    client_id: string;
  } | null;
}

export default function PersonalInfo({ profile }: PersonalInfoProps) {
  if (!profile) {
    return (
      <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl shadow-xl text-center text-xs text-slate-400">
        Loading personal record files...
      </div>
    );
  }

  // Combine components into a clean, complete legal name presentation string
  const fullLegalName = `${profile.surname} ${profile.middle_name ? profile.middle_name + ' ' : ''}${profile.last_name}`;

  return (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-xl space-y-4 text-xs max-w-xl animate-fade-in">
      <div className="border-b border-slate-700/60 pb-2">
        <h3 className="text-sm font-bold tracking-wide uppercase text-emerald-400">Personal Records Profile</h3>
        <p className="text-[11px] text-slate-400 font-mono">Secure Client Account Token: {profile.client_id}</p>
      </div>

      <div className="space-y-4 font-mono">
        {/* DYNAMIC LEGAL NAME */}
        <div>
          <span className="text-[10px] text-slate-500 uppercase block font-sans font-bold">Legal Name</span>
          <span className="text-sm font-medium text-slate-200 font-sans">{fullLegalName}</span>
        </div>

        {/* DYNAMIC REGISTERED HOME ADDRESS */}
        <div>
          <span className="text-[10px] text-slate-500 uppercase block font-sans font-bold">Registered Home Address</span>
          <span className="text-slate-300 font-sans leading-relaxed">
            {profile.address}, {profile.zip_code}
          </span>
        </div>

        {/* DYNAMIC COUNTRY RESIDENCE TRACKER */}
        <div>
          <span className="text-[10px] text-slate-500 uppercase block font-sans font-bold">Country of Residence</span>
          <span className="text-slate-300 font-sans">{profile.country}</span>
        </div>

        {/* ACCOUNT STATUS METRICS BUNDLE */}
        <div className="pt-2 grid grid-cols-2 gap-4 border-t border-slate-700/40">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-sans font-bold">Email Coordinate</span>
            <span className="text-slate-300 truncate font-sans block">{profile.email}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-sans font-bold">Account Clearance Tier</span>
            <span className="text-emerald-400 font-sans font-bold block mt-0.5">Verified Level 2 Account</span>
          </div>
        </div>
      </div>
    </div>
  );
}