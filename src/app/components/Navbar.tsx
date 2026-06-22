import React from 'react';
import Link from 'next/link';
import Logo from './Logo';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#0b0f19]/90 backdrop-blur-md border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <a href="#home">
        <Logo />
      </a>
      
      {/* Anchor links pointing to sections on the same home page */}
      <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
        <li><a href="#home" className="hover:text-blue-500 transition-colors">Home</a></li>
        <li><a href="#pricing" className="hover:text-blue-500 transition-colors">Pricing</a></li>
        <li><a href="#about" className="hover:text-blue-500 transition-colors">About Us</a></li>
        <li><a href="#contact" className="hover:text-blue-500 transition-colors">Contact Us</a></li>
        <li><a href="#privacy" className="hover:text-blue-500 transition-colors">Privacy</a></li>
      </ul>

      {/* Pointing directly to your existing auth sub-folders */}
      <div className="flex items-center gap-4">
        <Link href="/auth/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
          Sign in
        </Link>
        <Link href="/auth/register" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all">
          Get Started
        </Link>
      </div>
    </nav>
  );
}