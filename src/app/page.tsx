'use client';
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PromoVideo from './components/PromoVideo';
import PricingSection from './components/PricingSection';
import FAQSection from './components/FAQSection';
import TrustAndHowToUse from './components/TrustAndHowToUse'; 
import Footer from './components/Footer'; // Imports our custom footer grid

const phrases = [
  "Provides Personalized Audience Targeting",
  "Provides AI-Generated Video Ad",
  "Provides Live Tracking of your Investments"
];

export default function Home() {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % phrases.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0b0f19] min-h-screen text-white overflow-x-hidden relative">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section id="home" className="min-h-screen pt-36 pb-20 flex flex-col items-center justify-center text-center px-6 relative max-w-7xl mx-auto">
        {/* Floating Circles */}
        <div className="absolute left-4 top-1/3 w-12 h-12 rounded-full border-2 border-blue-500/30 overflow-hidden hidden md:block shadow-lg animate-float-slow">
          <img src="https://unsplash.com" alt="User Box 1" className="w-full h-full object-cover" />
        </div>
        <div className="absolute left-16 bottom-1/4 w-14 h-14 rounded-full border-2 border-indigo-500/30 overflow-hidden hidden md:block shadow-lg animate-float-delayed">
          <img src="https://unsplash.com" alt="User Box 2" className="w-full h-full object-cover" />
        </div>
        <div className="absolute right-6 top-1/4 w-14 h-14 rounded-full border-2 border-blue-500/30 overflow-hidden hidden md:block shadow-lg animate-float-slow">
          <img src="https://unsplash.com" alt="User Box 3" className="w-full h-full object-cover" />
        </div>
        <div className="absolute right-12 bottom-1/3 w-12 h-12 rounded-full border-2 border-indigo-500/30 overflow-hidden hidden md:block shadow-lg animate-float-delayed">
          <img src="https://unsplash.com" alt="User Box 4" className="w-full h-full object-cover" />
        </div>

        <h1 className="text-4xl md:text-6xl font-black max-w-4xl tracking-tight leading-tight text-white mb-2">
          Digital Figtop AI bot <br />
          <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">and stock market</span>
        </h1>

        <div className="h-16 flex items-center justify-center mb-6">
          <p className="text-2xl md:text-4xl font-extrabold text-blue-500 transition-all duration-500">
            {phrases[textIndex]}
          </p>
        </div>

        <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-8 px-4 border-l-2 border-blue-600/40 bg-blue-950/5 py-2 rounded-r-lg">
          Digital Figtop is a revolutionary platform that leverages Artificial Intelligence 
          (AI) to simplify affiliate marketing. It offers AI-powered services for affiliate marketers.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a href="/auth/register" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-8 py-3.5 rounded-full transition-all shadow-lg transform hover:-translate-y-0.5">
            Register Now for free
          </a>
          <a href="/auth/login" className="bg-[#111827] border border-gray-800 text-gray-300 hover:text-white font-bold text-sm px-8 py-3.5 rounded-full transition-all hover:bg-gray-800">
            Login
          </a>
        </div>
      </section>

      {/* --- STANDARDIZED NON-REPETITIVE SEQUENCE BODY --- */}
      <main>
        <PromoVideo />
        <PricingSection />
        <FAQSection />       {/* Includes Questions & the updated User Graphic Panel */}
        <TrustAndHowToUse /> {/* Includes Brand Trust Bar and Onboarding Steps */}
      </main>

      <Footer />            {/* Includes About Us, Privacy, Contact info, and legal links */}
    </div>
  );
}