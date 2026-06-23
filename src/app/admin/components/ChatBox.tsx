"use client";

import React, { useState, useEffect, useRef } from "react";

export default function ChatBox() {
  const [threads, setThreads] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [activeSurname, setActiveSurname] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);
  const [reply, setReply] = useState<string>("");
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

  const loadThreads = async () => {
    try {
      const res = await fetch("https://free.nfwhatsapp_chat.php?action=get_threads");
      const data = await res.json();
      if (data.success) {
        setThreads(data.threads);
        if (data.threads.length > 0 && !activeId) {
          setActiveId(data.threads[0].client_id);
          setActiveSurname(data.threads[0].surname);
        }
      }
    } catch (e) { console.error(e); }
  };

  const loadActiveChatLogs = async () => {
    if (!activeId) return;
    try {
      const res = await fetch(`https://free.nfwhatsapp_chat.php?client_id=${activeId}`);
      const data = await res.json();
      if (data.success) setMessages(data.history);
    } catch (e) { console.error(e); }
  };

  const handleDeleteUserChat = async (e: React.MouseEvent, clientId: string) => {
    e.stopPropagation();
    if (!confirm("Permanently clear this client's chat logs?")) return;
    try {
      const res = await fetch("https://free.nfchat_controls.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_chat", client_id: clientId }),
      });
      const data = await res.json();
      if (data.success) {
        setActiveId("");
        setActiveSurname("");
        setMessages([]);
        loadThreads();
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    loadThreads();
    const interval = setInterval(loadThreads, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadActiveChatLogs();
    const interval = setInterval(loadActiveChatLogs, 3000);
    return () => clearInterval(interval);
  }, [activeId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const executeMessageDispatch = async (contentString: string) => {
    if (!activeId) return;
    try {
      await fetch("https://free.nfwhatsapp_chat.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client_id: activeId, surname: activeSurname, sender: "admin", message_text: contentString }),
      });
      loadActiveChatLogs();
    } catch (e) { console.error(e); }
  };

  const sendResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !activeId) return;
    executeMessageDispatch(reply);
    setReply("");
  };

  const handleAdminImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetFile = e.target.files?.[0];
    if (!targetFile || !activeId) return;
    const fileReader = new FileReader();
    fileReader.readAsDataURL(targetFile);
    fileReader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = img.width > MAX_WIDTH ? MAX_WIDTH : img.width;
        canvas.height = img.width > MAX_WIDTH ? img.height * scaleSize : img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        executeMessageDispatch(canvas.toDataURL("image/jpeg", 0.7));
      };
    };
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl flex h-[500px] w-full text-xs text-slate-300 shadow-2xl overflow-hidden font-sans">
      <div className="w-56 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-3.5 border-b border-slate-800 bg-slate-950/40 font-bold uppercase text-slate-400 tracking-wider text-[10px]">💬 Client Contacts</div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {threads.map((t) => (
            <div 
              key={t.client_id} onClick={() => { setActiveId(t.client_id); setActiveSurname(t.surname); }}
              className={`w-full text-left p-2.5 rounded-lg transition flex justify-between items-center border group cursor-pointer ${activeId === t.client_id ? "bg-emerald-600 border-emerald-500 text-white shadow" : "bg-transparent border-transparent text-slate-400 hover:bg-slate-900"}`}
            >
              <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                <span className="font-bold truncate text-sm">{t.surname}</span>
                <span className="text-[10px] truncate opacity-60">{t.message_text.startsWith("data:image/") ? "🖼️ Sent an image" : t.message_text}</span>
              </div>
              <button type="button" onClick={(e) => handleDeleteUserChat(e, t.client_id)} className="ml-2 p-1 bg-rose-900/40 hover:bg-rose-600 border border-rose-500/20 text-white rounded text-[10px] opacity-0 group-hover:opacity-100 transition">🗑️</button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 bg-slate-900/10">
        <div className="bg-slate-950/80 p-4 border-b border-slate-800 font-bold text-emerald-400 text-sm">👤 Operator Viewport: <span className="text-slate-100 font-extrabold">{activeSurname}</span></div>
        <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-900/40">
          {messages.map((m) => {
            const isAdmin = m.sender === "admin";
            return (
              <div key={m.id} className={`flex w-full ${isAdmin ? "justify-end" : "justify-start"}`}>
                <div className={`p-2.5 rounded-xl max-w-[75%] ${isAdmin ? "bg-emerald-600 text-white rounded-tr-none" : "bg-slate-800 text-slate-200 border border-slate-700/60 rounded-tl-none"}`}>
                  {m.message_text.startsWith("data:image/") ? (
                    <img src={m.message_text} alt="Chat Media" className="max-h-[160px] rounded object-contain bg-black/40 border border-slate-700" />
                  ) : (
                    <p className="break-all whitespace-pre-wrap font-medium leading-relaxed">{m.message_text}</p>
                  )}
                  <span className="block text-[8px] text-right mt-1 opacity-40 font-mono font-bold">{formatWhatsAppDate(m.created_at)}</span>
                </div>
              </div>
            );
          })}
        </div>

        <form onSubmit={sendResponse} className="p-3 bg-slate-950 flex gap-2 border-t border-slate-800 items-center">
          <label className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl cursor-pointer text-xs shrink-0">
            📎 <input type="file" accept="image/*" onChange={handleAdminImageUpload} disabled={!activeId} className="hidden" />
          </label>
          <input 
            type="text" value={reply} onChange={(e) => setReply(e.target.value)}
            placeholder={activeId ? `Type response text to ${activeSurname}...` : "Select a thread..."} disabled={!activeId}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:border-emerald-500 font-medium"
          />
          <button type="submit" disabled={!reply.trim() || !activeId} className="bg-emerald-600 hover:bg-emerald-500 font-bold px-5 py-2.5 rounded-lg text-white transition">Dispatch</button>
        </form>
      </div>
    </div>
  );
}