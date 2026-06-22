'use client';
import React, { useState } from 'react';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What Is Digital Figtop, And What Does It Offer?",
    answer: "Digital Figtop is a revolutionary platform that leverages Artificial Intelligence (AI) to simplify affiliate marketing. It offers AI-powered services for affiliate marketers, including the Affiliate Tier Bot, Affiliate Tier Bot Niche, and Affiliate Tier Bot eCommerce, to streamline marketing efforts."
  },
  {
    question: "How Do I Get Started With Digital Figtop?",
    answer: "To get started, simply register on the platform and make a deposit using the available methods in your dashboard. Once you've made a deposit, explore and choose one of our AI services to begin your affiliate marketing journey."
  },
  {
    question: "What Sets Digital Figtop Apart From Other Affiliate Marketing Platforms?",
    answer: "Digital Figtop stands out due to its advanced AI technology, personalized audience targeting, social media advertising, and AI-generated video ads. It simplifies affiliate marketing, making it accessible to users with various levels of experience."
  },
  {
    question: "What Is The Referral Program, And How Does It Work?",
    answer: "The Referral Program allows you to earn rewards beyond monetary incentives. You can share your unique referral link with others and benefit from our Referral Aggregator service. This service lets you earn a percentage of investments made by users you've referred to Digital Figtop."
  },
  {
    question: "Can I Withdraw My Earnings, And How Does It Work?",
    answer: "Yes, once your AI service has completed its marketing campaigns and generated earnings, you can initiate a withdrawal from your Digital Figtop account. The withdrawal process is simple and convenient, allowing you to access your earnings whenever you choose."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 px-4 max-w-4xl mx-auto text-white">
      
      {/* 1. Accordion Header List */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
          Questions About our Digital Figtop?
        </h2>
        <h3 className="text-2xl md:text-3xl font-bold text-blue-500 mb-6">
          We have Answers!
        </h3>
      </div>

      <div className="space-y-4 mb-24">
        {faqData.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="bg-[#0e1626]/60 border border-gray-800/60 rounded-xl overflow-hidden transition-all duration-300">
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full text-left px-5 py-5 flex justify-between items-center gap-4 hover:bg-gray-800/10"
              >
                <span className="font-semibold text-sm md:text-base text-gray-100">{item.question}</span>
                <span className="text-lg font-bold text-blue-500">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && (
                <div className="px-5 py-5 text-xs md:text-sm text-gray-300 border-t border-gray-800/30 bg-[#0b101d]/50">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 2. Updated Call-To-Action with High-Tech Asset Image Display */}
      <div className="border-t border-gray-900 pt-16 flex flex-col items-center text-center">
        <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-6">
          All set to be<br />a partner?
        </h3>
        
        <Link 
          href="/auth/register"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-8 py-3.5 rounded-full shadow-lg shadow-blue-600/20 transition-all transform hover:-translate-y-0.5 mb-12"
        >
          Get Started Now
        </Link>

        {/* Dynamic Display Container targeting your custom asset upload */}
        <div className="w-full max-w-2xl rounded-2xl border border-gray-800/80 bg-[#111827]/40 p-1.5 backdrop-blur-sm shadow-2xl">
          <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-black/40">
            <img 
              src="/ai-dashboard.png" 
              alt="Digital Figtop AI Stock Market Generated Assets Analytics" 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Safe network fallback graphic in case your file isn't found right away
                e.currentTarget.src = "https://unsplash.com";
              }}
            />
          </div>
        </div>
      </div>

    </section>
  );
}