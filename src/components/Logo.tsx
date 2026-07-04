import React from "react";
// @ts-ignore
import logoUrl from "../assets/images/5.png";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export default function Logo({ className = "w-24 h-24", showText = true }: LogoProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`} id="brand-logo-container">
      <img
        src={logoUrl}
        alt="Qal'at Al-Dumalwah Yemeni Honey Logo"
        className="w-full h-full object-contain rounded-full shadow-lg border-2 border-[#B58A30]/30 hover:border-[#B58A30] transition-colors duration-300"
        referrerPolicy="no-referrer"
      />

      {showText && (
        <div className="text-center mt-3" id="brand-text-block">
          <h1 className="text-2xl font-bold text-[#4A2F13] tracking-tight font-sans">
            قلعة الدملوة
          </h1>
          <p className="text-xs text-[#B58A30] uppercase font-mono tracking-widest mt-1">
            YEMENI PREMIUM HONEY
          </p>
        </div>
      )}
    </div>
  );
}
