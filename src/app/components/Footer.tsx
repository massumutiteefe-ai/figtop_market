import React from 'react';
import Logo from './Logo';

export default function Footer() {
  // ==========================================
  // CONFIGURATION (BACKEND DATA SHUNTS)
  // Edit these parameters to change company channels instantly
  // ==========================================
  const companyConfig = {
    email: "support@digital-figtopmarkets.com",
    phone: "+1 (234) 567-8900",
  };

  return (
    <footer className="bg-[#090d16] border-t border-gray-900 pt-20 pb-8 px-6 md:px-12 w-full text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* --- PART 1: THE ACCORDION/SECTION HEADERS ARRAY GROUPED TOGETHER --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20 border-b border-gray-900/60 pb-16">
          
          {/* Fix 1: Changed from Privacy Policy to 'About Us' exactly where your cursor pointed */}
          <div id="about" className="scroll-mt-28">
            <h3 className="text-3xl md:text-4xl font-black tracking-tight mb-6 text-white">
              About Us
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xl">
              Digital Figtop is a revolutionary platform that leverages Artificial Intelligence (AI) 
              to simplify affiliate marketing. It offers AI-powered services for affiliate marketers, 
              including the Affiliate Tier Bot, Affiliate Tier Bot Niche, and Affiliate Tier Bot 
              eCommerce, to streamline marketing efforts.
            </p>
          </div>

          {/* Fix 3: Added 'Privacy' section directly into the layout column right across */}
          <div id="privacy" className="scroll-mt-28">
            <h3 className="text-3xl md:text-4xl font-black tracking-tight mb-6 text-white">
              Privacy
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xl">
              Our automated asset routing mechanisms prioritize transparency and maximum encryption protection. 
              We are strictly committed to secure innovation compliance protocols across all global 
              investment bot operations.
            </p>
          </div>

        </div>

        {/* --- PART 2: STANDARDIZED THREE COLUMN BOTTOM ROW FOOTER --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Left Column Container */}
          <div className="space-y-6">
            <Logo />
            
            {/* Fix 2: Generates 'Contact Us' heading with comfortable spacing before data records */}
            <div id="contact" className="pt-4 scroll-mt-28 border-t border-gray-900/40">
              <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-3">
                Contact Us
              </h4>
              <div className="space-y-2 text-xs text-gray-400 font-medium">
                <div className="flex items-center gap-2">
                  <span>✉️</span> 
                  <span>Email: <span className="text-gray-300 font-semibold">{companyConfig.email}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📞</span> 
                  <span>Phone: <span className="text-gray-300 font-semibold">{companyConfig.phone}</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Navigation Link Tree */}
          <div className="md:pl-12">
            <h4 className="text-white font-bold mb-4 tracking-wide text-base">Company</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#privacy" className="hover:text-white transition-colors">Terms and Condition</a></li>
              <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Right Newsletter Input Section Block */}
          <div>
            <h4 className="text-white font-bold mb-4 tracking-wide text-base">News & Update</h4>
            <div className="flex w-full mb-4 max-w-md border border-gray-800 rounded-lg overflow-hidden bg-[#111827]/40 p-1">
              <input 
                type="email" 
                placeholder="Enter Your Email" 
                className="bg-transparent text-white px-3 py-2 text-sm w-full focus:outline-none placeholder-gray-600"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2 rounded-md uppercase tracking-wider transition-colors">
                Subscribe
              </button>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed">
              Subscribe our newsletter for future updates, don&apos;t worry we don&apos;t spam your email address
            </p>
          </div>

        </div>

        {/* --- PART 3: LEGAL COPYRIGHT STATEMENT ROW --- */}
        <div className="border-t border-gray-900 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <p>Digital Figtop © 2026. All Rights Reserved.</p>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:underline">Terms</a>
            <a href="#privacy" className="hover:underline">Privacy</a>
          </div>
        </div>

      </div>
    </footer>
  );
}