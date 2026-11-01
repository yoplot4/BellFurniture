import React from "react";
import { FaArrowRight, FaCubesStacked } from "react-icons/fa6";
// እንደየፋይልህ አቀማመጥ የባነር ምስል ማስገባት ትችላለህ (አማራጭ)
// import BannerBg from '../../assets/Banner.jfif';

const SpecialOffer = () => {
  return (
    <div className="w-full px-9 my-12">
      <div 
        className="relative w-full rounded-3xl overflow-hidden shadow-xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 py-16 px-8 md:px-16 flex flex-col md:flex-row items-center justify-between"
        /* ምስል መጠቀም ከፈለግክ ከታች ያለውን style ማብራት ትችላለህ 
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.85)), url(${BannerBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        */
      >
        {/* Left Content */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-xl z-10">
          
          {/* Tag Badge */}
          <span className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 animate-fade-in-up [animation-delay:100ms] [animation-fill-mode:both]">
            <FaCubesStacked className="w-3.5 h-3.5" /> Custom Made Just For You
          </span>

          {/* Heading */}
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight animate-fade-in-up [animation-delay:250ms] [animation-fill-mode:both]">
            Have a Specific Design in Mind?
          </h2>

          {/* Description */}
          <p className="text-slate-300 mt-4 text-base md:text-lg font-light leading-relaxed animate-fade-in-up [animation-delay:400ms] [animation-fill-mode:both]">
            Transform your living space with custom-crafted furniture tailored precisely to your measurements, style, and favorite materials. Get special discounts on full home packages today!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto animate-fade-in-up [animation-delay:550ms] [animation-fill-mode:both]">
            <button className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 cursor-pointer group">
              Order Custom Furniture
              <FaArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            
            <button className="inline-flex items-center justify-center px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl backdrop-blur-md border border-white/20 transition-all duration-300 cursor-pointer">
              Contact Support
            </button>
          </div>

        </div>

        {/* Right Accent / Graphic Element */}
        <div className="mt-10 md:mt-0 z-10 flex flex-col items-center justify-center bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-md text-center">
          <span className="text-indigo-400 font-bold text-sm tracking-widest uppercase">Limited Time Offer</span>
          <span className="text-4xl md:text-5xl font-black text-white my-2">15% OFF</span>
          <span className="text-slate-300 text-sm">On your first custom furniture order</span>
        </div>

      </div>
    </div>
  );
};

export default SpecialOffer; // ( export default SpecialOffer;)