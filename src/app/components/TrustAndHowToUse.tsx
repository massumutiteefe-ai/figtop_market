import React from 'react';
import Link from 'next/link';

export default function TrustAndHowToUse() {
  return (
    <div className="bg-[#0b0f19] text-white">
      {/* Trust Logos */}
      <section className="py-16 border-t border-b border-gray-900 bg-[#0e1422]/20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-8">
            professionals & teams choose Digital Figtop
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-30 grayscale filter">
            <span className="text-xl font-bold text-white">Spotify</span>
            <span className="text-xl font-extrabold text-white">stripe</span>
            <span className="text-xl font-black text-white">Walmart ☀️</span>
            <span className="text-xl font-semibold text-white">airbnb</span>
            <span className="text-xl font-bold text-white">amazon</span>
          </div>
        </div>
      </section>

      {/* How To Use */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center">
        <div className="mb-16">
          <h2 className="text-4xl font-extrabold tracking-tight mb-4">How to use</h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
            Let our AI assist with most time consuming marketing and Affiliate services.
          </p>
        </div>

        <div className="space-y-12">
          {/* Step 01 */}
          <div className="bg-[#111827]/40 border border-gray-800/80 rounded-2xl p-8 md:p-12 text-left flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="max-w-xl">
              <span className="text-5xl font-black text-blue-500/10 block mb-2 font-mono">01</span>
              <h3 className="text-2xl font-bold text-white mb-3">Create Account in seconds</h3>
              <p className="text-gray-400 text-sm/relaxed">Click Get started and fill in all the required details needed to become a user</p>
            </div>
            <Link href="/auth/register" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-full shadow-md">Get Started Free</Link>
          </div>

          {/* Step 02 */}
          <div className="bg-[#111827]/40 border border-gray-800/80 rounded-2xl p-8 md:p-12 text-left flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="max-w-xl">
              <span className="text-5xl font-black text-blue-500/10 block mb-2 font-mono">02</span>
              <h3 className="text-2xl font-bold text-white mb-3">Make a deposit</h3>
              <p className="text-gray-400 text-sm/relaxed">We have varieties of channels of making deposit into your account, bank deposits, crypto, others means are provided by our customer services.</p>
            </div>
            <Link href="/auth/register" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-full shadow-md">Get Started Free</Link>
          </div>

          {/* Step 03 */}
          <div className="bg-[#111827]/40 border border-gray-800/80 rounded-2xl p-8 md:p-12 text-left flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="max-w-xl">
              <span className="text-5xl font-black text-blue-500/10 block mb-2 font-mono">03</span>
              <h3 className="text-2xl font-bold text-white mb-3">Purchase any AI bot package</h3>
              <p className="text-gray-400 text-sm/relaxed">Choose from the different variety of AI bots listed on the dashboard, investment page they are of different prices. And our AI will start marketing for you 24/7</p>
            </div>
            <Link href="/auth/register" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-full shadow-md">Get Started Free</Link>
          </div>

          {/* Step 04 */}
          <div className="bg-[#111827]/40 border border-gray-800/80 rounded-2xl p-8 md:p-12 text-left flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="max-w-xl">
              <span className="text-5xl font-black text-blue-500/10 block mb-2 font-mono">04</span>
              <h3 className="text-2xl font-bold text-white mb-3">Invest in diversified assets</h3>
              <p className="text-gray-400 text-sm/relaxed">Maximize market efficiency by distributing allocation shares across automated stock options and premium innovation indexes.</p>
            </div>
            <Link href="/auth/register" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-full shadow-md">Get Started Free</Link>
          </div>
        </div>
      </section>
    </div>
  );
}