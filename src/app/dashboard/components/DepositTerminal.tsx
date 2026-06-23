"use client";

import React, { useState, useEffect } from "react";

export default function DepositTerminal() {
  const [depositMethod, setDepositMethod] = useState<string>("none");
  const [cryptoType, setCryptoType] = useState<string>("none");
  const [amount, setAmount] = useState<string>(""); // New state for input amount
  const [gateways, setGateways] = useState<any>({});
  const [copied, setCopied] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "pending">("idle");
  const [selectedFileName, setSelectedFileName] = useState<string>("");

  useEffect(() => {
    fetch("https://onrender.comget_payment_settings.php")
      .then((res) => res.json())
      .then((data) => setGateways(data))
      .catch((err) => console.error(err));
  }, []);

  const getActiveAddress = () => {
    if (depositMethod === "paypal") return gateways?.paypal_email;
    if (depositMethod === "zelle") return gateways?.zelle_email;
    if (depositMethod === "usdt") return gateways?.usdt_address;
    if (depositMethod === "crypto") {
      if (cryptoType === "bitcoin") return gateways?.bitcoin_address;
      if (cryptoType === "ethereum") return gateways?.ethereum_address;
      if (cryptoType === "litecoin") return gateways?.litecoin_address;
    }
    return "";
  };

  const handleCopyToClipboard = async () => {
    const address = getActiveAddress();
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleNotifyAdmin = async () => {
    // Validation: Ensure amount is provided before notifying
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid deposit amount.");
      return;
    }

    const activeAddress = getActiveAddress();
    const methodString = depositMethod === "crypto" ? `Crypto (${cryptoType.toUpperCase()})` : depositMethod.toUpperCase();
    
    // Structured details for the PHP backend parser
    const notificationMessage = `DEPOSIT_REQUEST|Method: ${methodString}|Amount: $${amount}|Gateway: ${activeAddress}`;

    try {
      const res = await fetch("https://onrender.comsend_message.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: "USR-001", // Replace dynamically with real logged-in client ID if available
          sender: "client",
          message_text: notificationMessage,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPaymentStatus("pending");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGiftCardUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Validation: Ensure amount is provided before uploading
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter the value amount of the gift card first.");
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64String = reader.result as string;
      
      // Structured metadata prepended to the image string
      const payloadText = `GIFTCARD_REQUEST|Amount: $${amount}|Data: ${base64String}`;

      try {
        const res = await fetch("https://onrender.comsend_message.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            client_id: "USR-001",
            sender: "client",
            message_text: payloadText,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setPaymentStatus("pending");
        }
      } catch (err) {
        console.error(err);
      }
    };
  };

  return (
    <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 text-xs text-slate-300 space-y-4 shadow-xl max-w-md">
      <div>
        <h3 className="font-bold text-emerald-400 mb-1 uppercase text-sm">Funding Deposit Terminal</h3>
        <p className="text-[11px] text-slate-400">Select your preferred asset settlement gateway</p>
      </div>

      {/* 1. Select Option Matrix */}
      <div className="flex flex-col gap-1.5">
        <label className="text-slate-400 font-semibold">1. Select Option Matrix:</label>
        <select
          onChange={(e) => { 
            setDepositMethod(e.target.value); 
            setCryptoType("none"); 
            setPaymentStatus("idle");
            setSelectedFileName("");
          }}
          value={depositMethod}
          className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 outline-none focus:border-emerald-500 font-medium"
        >
          <option value="none">-- Choose Payment System --</option>
          <option value="crypto">Cryptocurrency Address</option>
          <option value="usdt">USDT Wallet (TRC20)</option>
          <option value="paypal">PayPal Merchant Email</option>
          <option value="zelle">Zelle Transfer Gateway</option>
          <option value="giftcard">Digital Gift Card Voucher</option>
        </select>
      </div>

      {/* 2. Choose Network Variant for Crypto */}
      {depositMethod === "crypto" && (
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-400 font-semibold">2. Choose Network Variant:</label>
          <select
            onChange={(e) => { setCryptoType(e.target.value); setPaymentStatus("idle"); }}
            value={cryptoType}
            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 outline-none focus:border-emerald-500 font-medium"
          >
            <option value="none">-- Select Token --</option>
            <option value="bitcoin">Bitcoin (BTC)</option>
            <option value="ethereum">Ethereum (ETH)</option>
            <option value="litecoin">Litecoin (LTC)</option>
          </select>
        </div>
      )}

      {/* 3. Enter Deposit Amount Input Field */}
      {depositMethod !== "none" && (depositMethod !== "crypto" || cryptoType !== "none") && (
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-400 font-semibold">3. Enter Amount ($):</label>
          <input
            type="number"
            min="1"
            step="any"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={paymentStatus === "pending"}
            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 outline-none focus:border-emerald-500 font-medium font-mono"
          />
        </div>
      )}

      {/* Active State View Layout */}
      {paymentStatus === "idle" && (
        <>
          {/* Address Remittance Container */}
          {depositMethod !== "none" && depositMethod !== "giftcard" && (depositMethod !== "crypto" || cryptoType !== "none") && (
            <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg space-y-3">
              <p className="text-slate-500 text-[10px] uppercase font-sans font-bold">Copy Remittance Destination Info:</p>
              
              <div className="flex gap-2 items-center">
                <div className="p-2 bg-slate-950 rounded text-emerald-400 font-mono text-[11px] select-all break-all border border-slate-800 flex-1">
                  {getActiveAddress()}
                </div>
                <button
                  type="button"
                  onClick={handleCopyToClipboard}
                  className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded transition shrink-0"
                >
                  {copied ? "✓ Copied" : "Copy"}
                </button>
              </div>

              <p className="text-[10px] font-sans text-slate-400">⚠️ Upload confirmation receipt screenshots into support chat after routing funds.</p>

              <button
                type="button"
                onClick={handleNotifyAdmin}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded shadow transition text-center mt-2"
              >
                I Have Made the Deposit
              </button>
            </div>
          )}

          {/* Gift Card Upload Button Container */}
          {depositMethod === "giftcard" && (
            <div className="bg-slate-900 border border-dashed border-slate-700 p-4 rounded-lg text-center space-y-3">
              <p className="text-slate-300">Upload Digital Gift Card Code Voucher Image File</p>
              
              <div className="flex flex-col items-center gap-2">
                <label className="inline-block px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded cursor-pointer transition shadow-md">
                  📸 Browse & Submit Image
                  <input type="file" accept="image/*" onChange={handleGiftCardUpload} className="hidden" />
                </label>
                {selectedFileName && (
                  <p className="text-[11px] text-slate-400 italic">Selected: {selectedFileName}</p>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Global Alert Notification Banner Engine */}
      {paymentStatus === "pending" && (
        <div className="bg-indigo-950/40 border border-indigo-500/50 p-4 rounded-lg text-center space-y-2 animate-fade-in">
          <div className="inline-block w-4 height-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mb-1"></div>
          <h4 className="text-indigo-400 font-bold text-xs uppercase tracking-wider">Deposit Status: Pending</h4>
          <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
            Your transfer receipt data has been securely forwarded to our administrators. Please wait for official payment verification confirmation.
          </p>
          <button 
            onClick={() => setPaymentStatus("idle")}
            className="text-[10px] text-indigo-400 underline hover:text-indigo-300 transition pt-1 display-block mx-auto"
          >
            Go Back
          </button>
        </div>
      )}
    </div>
  );
}