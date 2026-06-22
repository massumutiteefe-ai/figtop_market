"use client";

import React, { useState, useEffect } from "react";

export default function PaymentControl() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<any>({
    paypal_email: "",
    zelle_email: "",
    usdt_address: "",
    bitcoin_address: "",
    ethereum_address: "",
    litecoin_address: ""
  });
  
  // Controls editing states independently for each specific method field
  const [editingKeys, setEditingKeys] = useState<any>({
    paypal_email: false,
    zelle_email: false,
    usdt_address: false,
    bitcoin_address: false,
    ethereum_address: false,
    litecoin_address: false
  });

  const [savingKey, setSavingKey] = useState<string | null>(null);

  // Fetch initial payment values from the XAMPP database configuration
  useEffect(() => {
    if (isOpen) {
      fetch("http://localhost/figtop-api/get_payment_settings.php")
        .then((res) => res.json())
        .then((data) => { if (data) setForm(data); })
        .catch((err) => console.error("Database reading error:", err));
    }
  }, [isOpen]);

  const saveSetting = async (key: string) => {
    setSavingKey(key);
    try {
      const res = await fetch("http://localhost/figtop-api/update_payment_settings.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ setting_key: key, setting_value: form[key] })
      });
      const data = await res.json();
      if (data.success) {
        setEditingKeys((prev: any) => ({ ...prev, [key]: false }));
      } else {
        alert("Failed to save credentials.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="inline-block">
      {/* 💳 RECONFIGURED ICON BUTTON FOR MODAL TRIGGER */}
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-md transition"
        title="Open Payment Method Controller Options"
      >
        <span>💳</span> Payment Methods
      </button>

      {/* LIGHTWEIGHT LAYOUT MODAL OVERLAY */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
            
            {/* MODAL HEADER ROW */}
            <div className="bg-slate-900 border-b border-slate-700 px-5 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wide">
                  Global Gateways Matrix
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Select, edit, and verify active client remittance channels</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white text-sm bg-slate-800 p-1 px-2.5 rounded-md border border-slate-700 transition"
              >
                ✕ Close
              </button>
            </div>

            {/* MODAL INTERNAL SYSTEM MATRIX FIELDS */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              {Object.keys(form).map((key) => {
                const isEditable = editingKeys[key];
                return (
                  <div key={key} className="flex flex-col gap-1.5 bg-slate-900/50 p-3.5 rounded-lg border border-slate-700/60 mt-0">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        {key.replace("_", " ")}
                      </label>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${isEditable ? "text-amber-400 bg-amber-500/10" : "text-emerald-400 bg-emerald-500/10"}`}>
                        {isEditable ? "Editing" : "Locked"}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={form[key] || ""}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        disabled={!isEditable}
                        className={`flex-1 border rounded px-3 py-1.5 font-mono outline-none text-xs transition ${
                          isEditable 
                            ? "bg-slate-900 border-amber-500/50 text-white" 
                            : "bg-slate-950/40 border-slate-800 text-slate-400 cursor-not-allowed"
                        }`}
                        placeholder="No destination address configured..."
                      />
                      
                      {isEditable ? (
                        <button 
                          onClick={() => saveSetting(key)}
                          disabled={savingKey === key}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1 rounded transition text-[11px] min-w-[65px]"
                        >
                          {savingKey === key ? "..." : "Save"}
                        </button>
                      ) : (
                        <button 
                          onClick={() => setEditingKeys((prev: any) => ({ ...prev, [key]: true }))}
                          className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold px-3 py-1 rounded border border-slate-600 transition text-[11px] min-w-[65px]"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}