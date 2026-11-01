import React, { useState } from 'react';
import { Menu, Search, Heart, RefreshCw, ShoppingBag, ChevronDown, X } from 'lucide-react';
import logo from '../../assets/logo.jfif'; 

const Headers = () => {
  // to open mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white border-b border-gray-100 font-arial relative">
      
      {/* ========================================================
          the logo and mobile reponsive huamberger and x menu
          ======================================================== */}
      <div className="w-full mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-4 shadow-xs">
        
        {/*  (Logo) */}
        <div className="flex items-center flex-shrink-0 gap-2">
          {/* mobile devices hamburger menu (md:hidden) */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1 text-gray-600 hover:text-indigo-600 focus:outline-none"
          >
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

          <img
            src={logo}
            alt="logo"
            className="w-10 h-10 md:w-12 md:h-12 object-contain rounded-lg cursor-pointer"
          />
          {/* for small devices not texts are overflow*/}
          <span className="bg-linear-to-r from-pink-500 to-indigo-500 bg-clip-text text-2xl md:text-4xl font-bold text-transparent cursor-pointer tracking-tight md:tracking-normal">
            Kidus Furniture
          </span>
        </div>

        {/* (hidden md:flex) */}
        <div className="hidden md:flex flex-1 max-w-2xl items-center">
          <div className="flex items-center bg-gray-50 border border-gray-200 border-r-0 rounded-l-lg px-4 py-2 text-sm text-gray-600 cursor-pointer hover:bg-gray-100 transition">
            <span>All Categories</span>
            <ChevronDown size={16} className="ml-2 text-gray-400" />
          </div>
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search Products Here..."
              className="w-full bg-white border border-gray-200 px-4 py-2 text-sm text-gray-700 outline-none focus:border-indigo-500 transition"
            />
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-r-lg transition">
            <Search size={18} />
          </button>
        </div>

        {/* (Badges) */}
        <div className="flex items-center space-x-3 md:space-x-5 text-gray-700">
          
          {/* (Wishlist) */}
          <div className="relative cursor-pointer hover:text-indigo-600 transition">
            <Heart size={22} className="md:w-[24px] md:h-[24px]" />
            <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] md:text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
              0
            </span>
          </div>

          {/*  (hidden sm:block) */}
          <div className="hidden sm:block relative cursor-pointer hover:text-indigo-600 transition">
            <RefreshCw size={20} />
            <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
              2
            </span>
          </div>

          {/*(Cart) */}
          <div className="relative cursor-pointer hover:text-indigo-600 transition">
            <ShoppingBag size={22} className="md:w-[24px] md:h-[24px]" />
            <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] md:text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
              1
            </span>
          </div>

        </div>
      </div>

   {/* ======================================================== (BOTTOM ROW): ) ======================================================== */}
<div className="w-full border-t border-gray-100 hidden md:block">
  <div className="max-w-7xl mx-auto px-6 py-3 flex justify-center">
    <nav className="flex items-center space-x-8 text-gray-700 font-medium text-sm">
      <a href="#" className="relative py-1 text-indigo-600 font-semibold group flex items-center gap-1">
        Home <ChevronDown size={14} />
        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-indigo-600"></span>
      </a>
      <a href="#" className="relative py-1 hover:text-indigo-600 transition duration-300 group flex items-center gap-1">
        Orders
        <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
      </a>
      <a href="#" className="relative py-1 hover:text-indigo-600 transition duration-300 group flex items-center gap-1">
        Catalog <ChevronDown size={14} />
        <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
      </a>
      <a href="#" className="relative py-1 hover:text-indigo-600 transition duration-300 group flex items-center gap-1">
        Page <ChevronDown size={14} />
        <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
      </a>
      <a href="#" className="relative py-1 hover:text-indigo-600 transition duration-300 group">
        Blog
        <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
      </a>
      <a href="#" className="relative py-1 hover:text-indigo-600 transition duration-300 group">
        Contact
        <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
      </a>

      {/* 🔹 Added Login & Signup */}
      <a href="/login" className="relative py-1 hover:text-indigo-600 transition duration-300 group">
        Login
        <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
      </a>
      <a href="/signup" className="relative py-1 hover:text-indigo-600 transition duration-300 group">
        Signup
        <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
      </a>
    </nav>
  </div>
</div>

{/* ======================================================== (MOBILE DROPDOWN DRAWER) ======================================================== */}
{isMobileMenuOpen && (
  <div className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg z-50 md:hidden">
    {/* for mobile devices search box */}
    <div className="p-4 border-b border-gray-50 flex items-center">
      <input
        type="text"
        placeholder="Search Products..."
        className="w-full bg-gray-50 border border-gray-200 rounded-l-lg px-3 py-2 text-sm outline-none focus:border-indigo-500"
      />
      <button className="bg-indigo-600 text-white p-2 rounded-r-lg">
        <Search size={16} />
      </button>
    </div>

    {/* mobile links list*/}
    <nav className="flex flex-col p-4 font-medium text-gray-700 text-sm">
      <a href="#" className="py-2.5 px-2 text-indigo-600 bg-indigo-50/50 rounded-md font-semibold">Home</a>
      <a href="#" className="py-2.5 px-2 hover:bg-gray-50 rounded-md transition">Orders</a>
      <a href="#" className="py-2.5 px-2 hover:bg-gray-50 rounded-md transition flex justify-between items-center">
        Catalog <ChevronDown size={14} />
      </a>
      <a href="#" className="py-2.5 px-2 hover:bg-gray-50 rounded-md transition flex justify-between items-center">
        Page <ChevronDown size={14} />
      </a>
      <a href="#" className="py-2.5 px-2 hover:bg-gray-50 rounded-md transition">Blog</a>
      <a href="#" className="py-2.5 px-2 hover:bg-gray-50 rounded-md transition">Contact</a>

      {/* 🔹 Added Login & Signup for mobile */}
      <a href="/login" className="py-2.5 px-2 hover:bg-gray-50 rounded-md transition">Login</a>
      <a href="/signup" className="py-2.5 px-2 hover:bg-gray-50 rounded-md transition">Signup</a>
    </nav>
  </div>
)}


    </header>
  );
};

export default Headers;
