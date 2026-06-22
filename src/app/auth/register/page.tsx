'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    surname: '',
    middleName: '',
    lastName: '',
    address: '',
    zipCode: '',
    country: '',
    email: '',
    phone: '',
    referralCode: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.surname || !formData.lastName || !formData.email || !formData.password || !formData.country) {
      return alert("Please fulfill all mandatory operational registration entries.");
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost/figtop-api/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: formData.surname,
          middleName: formData.middleName,
          last_name: formData.lastName,
          address: formData.address,
          zipCode: formData.zipCode,
          country: formData.country,
          email: formData.email,
          phone: formData.phone,
          referralCode: formData.referralCode,
          password: formData.password
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Account created successfully! Welcome to Figtop Markets. Your ID: ${data.client_id}`);
        router.push("/auth/login"); 
      } else {
        alert(`Registration Rejected: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("Backend API gateway connection timeout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070b19] text-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-[#0f162e] p-8 rounded-xl shadow-lg w-full max-w-lg space-y-4 my-8 max-h-[90vh] overflow-y-auto"
      >
        <div className="text-center pb-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">Create Account</h1>
          <p className="text-xs text-slate-400 mt-1">Join Figtop Markets trading ledger network</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="flex flex-col gap-1">
            <label className="text-slate-400 font-medium">Surname *</label>
            <input name="surname" placeholder="Surname" value={formData.surname} onChange={handleChange} required
              className="w-full px-4 py-2 rounded-lg bg-[#1a2238] text-white border border-gray-700 outline-none focus:border-blue-500" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-slate-400 font-medium">Middle Name</label>
            <input name="middleName" placeholder="Middle Name (Optional)" value={formData.middleName} onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-[#1a2238] text-white border border-gray-700 outline-none focus:border-blue-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="flex flex-col gap-1">
            <label className="text-slate-400 font-medium">Last Name *</label>
            <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required
              className="w-full px-4 py-2 rounded-lg bg-[#1a2238] text-white border border-gray-700 outline-none focus:border-blue-500" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-slate-400 font-medium">Contact Number *</label>
            <input name="phone" placeholder="Phone e.g. +234..." value={formData.phone} onChange={handleChange} required
              className="w-full px-4 py-2 rounded-lg bg-[#1a2238] text-white border border-gray-700 outline-none focus:border-blue-500" />
          </div>
        </div>

        <div className="flex flex-col gap-1 text-xs">
          <label className="text-slate-400 font-medium">Residential Street Address *</label>
          <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} required
            className="w-full px-4 py-2 rounded-lg bg-[#1a2238] text-white border border-gray-700 outline-none focus:border-blue-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="flex flex-col gap-1">
            <label className="text-slate-400 font-medium">Zip / Postal Code *</label>
            <input name="zipCode" placeholder="Zip Code" value={formData.zipCode} onChange={handleChange} required
              className="w-full px-4 py-2 rounded-lg bg-[#1a2238] text-white border border-gray-700 outline-none focus:border-blue-500" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-slate-400 font-medium">Country of Residence *</label>
            <input
              list="countryList"
              name="country"
              placeholder="Type or select your country"
              value={formData.country}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-[#1a2238] text-white border border-gray-700 outline-none focus:border-blue-500"
            />
            <datalist id="countryList">
              <option value="Argentina" />
              <option value="Australia" />
              <option value="Austria" />
              <option value="Bahrain" />
              <option value="Bangladesh" />
              <option value="Belgium" />
              <option value="Brazil" />
              <option value="Brunei" />
              <option value="Canada" />
              <option value="Chile" />
              <option value="China" />
              <option value="Colombia" />
              <option value="Czech Republic" />
              <option value="Denmark" />
              <option value="Finland" />
              <option value="France" />
              <option value="Germany" />
              <option value="Greece" />
              <option value="Hong Kong" />
              <option value="Hungary" />
              <option value="Iceland" />
              <option value="India" />
              <option value="Indonesia" />
              <option value="Ireland" />
              <option value="Israel" />
              <option value="Italy" />
              <option value="Japan" />
              <option value="Kuwait" />
              <option value="Luxembourg" />
              <option value="Malaysia" />
              <option value="Mexico" />
              <option value="Netherlands" />
              <option value="New Zealand" />
              <option value="Norway" />
              <option value="Oman" />
              <option value="Pakistan" />
              <option value="Peru" />
              <option value="Philippines" />
              <option value="Poland" />
              <option value="Portugal" />
              <option value="Qatar" />
              <option value="Saudi Arabia" />
              <option value="Singapore" />
              <option value="South Korea" />
              <option value="Spain" />
              <option value="Sweden" />
              <option value="Switzerland" />
              <option value="Turkey" />
              <option value="United Arab Emirates" />
              <option value="United Kingdom" />
              <option value="United States" />
            </datalist>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="flex flex-col gap-1">
            <label className="text-slate-400 font-medium">Email Address *</label>
            <input name="email" type="email" placeholder="email@example.com" value={formData.email} onChange={handleChange} required
              className="w-full px-4 py-2 rounded-lg bg-[#1a2238] text-white border border-gray-700 outline-none focus:border-blue-500" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-slate-400 font-medium">Referral Code</label>
            <input name="referralCode" placeholder="Optional" value={formData.referralCode} onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-[#1a2238] text-white border border-gray-700 outline-none focus:border-blue-500" />
          </div>
        </div>

        <div className="flex flex-col gap-1 text-xs">
          <label className="text-slate-400 font-medium">Account Security Password *</label>
          <input name="password" type="password" placeholder="Create strong password" value={formData.password} onChange={handleChange} required
            className="w-full px-4 py-2 rounded-lg bg-[#1a2238] text-white border border-gray-700 outline-none focus:border-blue-500 text-sm" />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white py-2.5 rounded-lg font-bold uppercase text-xs tracking-wider transition shadow-md mt-2"
        >
          {loading ? "Registering account file..." : "Complete Registration"}
        </button>

        <p className="text-xs text-center text-slate-400 pt-1">
          Already have an account? <Link href="/auth/login" className="text-blue-400 hover:underline">Sign In</Link>
        </p>
      </form>
    </div>
  );
}