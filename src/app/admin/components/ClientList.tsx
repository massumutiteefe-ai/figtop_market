"use client";

import React, { useState, useEffect } from "react";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  balance: string;
  joined: string;
}

export default function ClientList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadFromRegister() {
      try {
        const res = await fetch("/api/clients");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setClients(data);
      } catch (err) {
        console.error("Failed syncing records:", err);
      } finally {
        setLoading(false);
      }
    }
    loadFromRegister();
  }, []);

  return (
    <div className="bg-slate-800 border border-slate-700 p-5 rounded-lg flex flex-col gap-4 shadow-xl">
      <div className="border-b border-slate-700 pb-2">
        <h3 className="text-sm font-semibold uppercase text-emerald-400">Registered Clients Database</h3>
        <p className="text-xs text-slate-400">Live data streaming directly from figtopmarkets.register</p>
      </div>

      {loading ? (
        <div className="text-xs text-slate-400 animate-pulse py-8 text-center">
          Querying figtopmarkets database...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* LEFT LIST VIEW PANE */}
          <div className="lg:col-span-1 space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {clients.map(client => (
              <div 
                key={client.id}
                onClick={() => setSelectedClient(client)}
                className={`p-3 rounded border text-xs cursor-pointer transition ${
                  selectedClient?.id === client.id 
                    ? "bg-emerald-600/20 border-emerald-500 text-white" 
                    : "bg-slate-900/50 border-slate-700 text-slate-300 hover:border-slate-600"
                }`}
              >
                <p className="font-bold">{client.name}</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{client.id}</p>
              </div>
            ))}
          </div>

          {/* RIGHT DETAILED RECORD PANE */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-700/50 rounded-md p-4 flex flex-col justify-between min-h-[220px]">
            {selectedClient ? (
              <div className="space-y-3 text-xs">
                <h4 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-1.5">
                  Account File: {selectedClient.name}
                </h4>
                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div>
                    <p className="text-[10px] uppercase text-slate-500">Client ID</p>
                    <p className="text-slate-300">{selectedClient.id}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-slate-500">Available Balance</p>
                    <p className="text-emerald-400 font-bold">{selectedClient.balance}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-slate-500">Email Address</p>
                    <p className="text-slate-300 truncate">{selectedClient.email}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-slate-500">Phone Contact</p>
                    <p className="text-slate-300">{selectedClient.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] uppercase text-slate-500">Residential Address</p>
                    <p className="text-slate-300 truncate">{selectedClient.address}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-slate-500">Registration Date</p>
                    <p className="text-slate-300">{selectedClient.joined}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-4">
                <p className="text-xs text-slate-500">Select a registered client from the left pane to mount their system files.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}