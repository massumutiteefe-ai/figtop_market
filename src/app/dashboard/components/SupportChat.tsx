"use client";

import React, { useState, useEffect, useRef } from "react";

export default function SupportChat() {
  const [clientId, setClientId] = useState<string>("");
  const [surname, setSurname] = useState<string>("Client");
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const formatWhatsAppDate = (dateString: string) => {
    const msgDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (msgDate.toDateString() === today.toDateString()) {
      return msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (msgDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return msgDate.toLocaleDateString('en-GB');
    }
  };

  useEffect(() => {
    const rawUserHeading = document.body.innerText || "";
    const welcomeMatch = rawUserHeading.match(/Welcome back,\s+([^\n]+)/i);
    let activeSurname = "Client";
    if (welcomeMatch && welcomeMatch) {
      activeSurname = welcomeMatch[1].trim();
    } else {
      const cachedSurname = localStorage.getItem("ftm_client_surname");
      if (cachedSurname) activeSurname = cachedSurname;
    }
    
    const cleanIdString = "usr-" + activeSurname.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    const cachedId = localStorage.getItem("ftm_client_user_id") || cleanIdString;
    
    setClientId(cachedId);
    setSurname(activeSurname);
  }, []);

  const loadMyChatHistory = async () => {
    if (!clientId) return;
    try {
      const res = await fetch(`https://free.nfwhatsapp_chat.php?client_id=${encodeURIComponent(clientId)}`);
      const data = await res.json();
      if (data.success) setMessages(data.history);
    } catch (e) { 
      console.error("Chat sync interface disconnect:", e); 
    }
  };

  useEffect(() => {
    if (clientId) {
      loadMyChatHistory();
      const poll = setInterval(loadMyChatHistory, 3000);
      return () => clearInterval(poll);
    }
  }, [clientId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // 🛠️ CENTRAL CORE ROUTING FLOW FOR BOTH TEXT AND MEDIA CONTENT
  const pushMessagePayload = async (content: string) => {
    if (!clientId) return;
    try {
      await fetch("https://free.nfwhatsapp_chat.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client_id: clientId, surname, sender: "client", message_text: content }),
      });
      loadMyChatHistory();
    } catch (e) { console.error(e); }
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    pushMessagePayload(text);
    setText("");
  };

  // 🖼️ NEW CLIENT WORKFLOW: CAPTURE, COMPRESS, AND DISPATCH IMAGE ATTACHMENTS
  const handleClientImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetFile = e.target.files?.[0];
    if (!targetFile || !clientId) return;

    const fileReader = new FileReader();
    fileReader.readAsDataURL(targetFile);
    fileReader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800; // Limits image payload footprint scale size
        const scaleSize = MAX_WIDTH / img.width;
        
        canvas.width = img.width > MAX_WIDTH ? MAX_WIDTH : img.width;
        canvas.height = img.width > MAX_WIDTH ? img.height * scaleSize : img.height;
        
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Export highly optimized JPEG payload format data string
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        pushMessagePayload(compressedBase64);
      };
    };
  };

  return (
    <div className="bg-slate-800/95 border border-slate-700/60 rounded-xl flex flex-col h-[460px] w-full max-w-2xl overflow-hidden text-xs text-slate-300 shadow-2xl mx-auto backdrop-blur">
      <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-slate-200 text-sm tracking-wide">Live Support Desk</h3>
          <p className="text-[10px] text-emerald-400 font-mono mt-0.5">Agent Online | Account: {surname}</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-900/40">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
            <p className="text-[11px] text-slate-500 font-mono italic">Welcome {surname}. Type a question to message the agent.</p>
          </div>
        ) : (
          messages.map((m) => {
            const isMe = m.sender === "client";
            return (
              <div key={m.id} className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`p-2.5 rounded-xl max-w-[75%] ${isMe ? "bg-blue-600 text-white rounded-tr-none" : "bg-slate-700 text-slate-200 rounded-tl-none"}`}>
                  {m.message_text.startsWith("data:image/") ? (
                    <img src={m.message_text} alt="Attachment" className="max-h-[160px] rounded object-contain border border-slate-700/50 bg-black/20" />
                  ) : (
                    <p className="break-all whitespace-pre-wrap font-medium">{m.message_text}</p>
                  )}
                  <span className="block text-[8px] text-right mt-1 opacity-40 font-mono font-bold">{formatWhatsAppDate(m.created_at)}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 📎 ATTACHMENT-ENABLED INPUT CONTROL PANEL */}
      <form onSubmit={handleSendText} className="p-3 bg-slate-950 flex gap-2 border-t border-slate-800 items-center">
        <label className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl cursor-pointer transition shrink-0 text-center text-xs active:scale-95">
          📎
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleClientImageUpload} 
            className="hidden" 
          />
        </label>
        <input 
          type="text" value={text} onChange={(e) => setText(e.target.value)}
          placeholder="Type your message text here..."
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-blue-500 font-medium"
        />
        <button type="submit" disabled={!text.trim()} className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 px-5 py-2.5 rounded-xl text-white font-bold transition shadow-lg">Send</button>
      </form>
    </div>
  );
}