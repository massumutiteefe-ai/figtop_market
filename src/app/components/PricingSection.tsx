import React from 'react';
import Link from 'next/link';

const pricingPlans = [
  {
    title: "BASIC PLAN",
    range: "500.00 - USD 1,000.00",
    days: "4 days",
    features: [
      "Personalized Audience Targeting (Using 20 super computers)",
      "Social Media Advertising",
      "AI-Generated Video Ads (1 video)",
      "500% Daily Growth"
    ]
  },
  {
    title: "2,000.00 - USD 10,000.00",
    range: "2,000.00 - USD 10,000.00",
    days: "10 Days",
    features: [
      "Personalized Audience Targeting (Using 70 super computers)",
      "Social Media Advertising",
      "AI-Generated Video Ads (10 video)",
      "1000% Daily Growth"
    ],
    highlight: true 
  },
  {
    title: "AFFILIATE TIER BOT ECOMMERCE",
    range: "USD 20,000.00 - USD 100,000.00",
    days: "31 Days",
    features: [
      "Personalized Audience Targeting (Using 200 super computers)",
      "Social Media Advertising",
      "AI-Generated Video Ads (30 video)",
      "5000% Daily Growth"
    ]
  },
  {
    title: "(VIP) AFFILIATE TIER BOT ECOMMERCE",
    range: "USD 50,000.00 - USD 100,000.00+",
    days: "51 Days",
    features: [
      "Personalized Audience Targeting (Using 1000 super computers)",
      "Social Media Advertising",
      "AI-Generated Video Ads (Unlimited Videos)",
      "10,000% Daily Growth"
    ]
  }
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 px-4 md:px-8 bg-[#0b0f19] text-white scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Pricing and Packages
          </h2>
        </div>

        {/* Responsive Grid System Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index} 
              className="bg-[#111827]/40 border border-gray-800 rounded-2xl p-6 flex flex-col justify-between min-h-[580px] hover:border-blue-500/40 transition-all duration-300 backdrop-blur-sm"
            >
              <div>
                {/* Plan Header Identifier */}
                <div className="text-center mb-6">
                  <h3 className="text-xs font-bold tracking-widest text-blue-400 uppercase h-8 flex items-center justify-center px-2">
                    {plan.title}
                  </h3>
                  <div className="mt-4 text-xl font-black tracking-tight text-gray-100 min-h-[3.5rem] flex items-center justify-center flex-col">
                    <span>{plan.range}</span>
                  </div>
                  <span className="inline-block mt-2 text-xs bg-gray-950 px-2.5 py-1 rounded-md border border-gray-800 text-gray-400 font-medium">
                    {plan.days}
                  </span>
                </div>

                {/* All 'Start Now' buttons link to registration route */}
                <div className="mb-8 text-center">
                  <Link 
                    href="/auth/register"
                    className={`block w-full text-center py-2.5 px-4 rounded-full text-xs font-bold tracking-wide transition-all duration-200 ${
                      plan.highlight 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20' 
                        : 'bg-transparent border border-gray-700 hover:border-gray-500 text-gray-300'
                    }`}
                  >
                    Start Now
                  </Link>
                </div>

                {/* Plan Verified Detail Feature List Section */}
                <ul className="space-y-4 text-left border-t border-gray-800/60 pt-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-300 leading-relaxed">
                      <span className="text-blue-500 font-bold mt-0.5 select-none">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}