import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full h-full min-h-screen bg-slate-900">{children}</div>;
}