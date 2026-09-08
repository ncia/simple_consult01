import React from 'react';
import { ShieldAlert, Phone } from 'lucide-react';
import { handleKakaoConsultation, KAKAO_CHAT_URL } from '../utils/kakao';

interface HeaderProps {
  onContactClick: () => void;
}

export function Header({ onContactClick }: HeaderProps) {
  return (
    <header className="bg-white/80 dark:bg-neutral-dark/80 backdrop-blur-md sticky top-0 z-50 border-b border-neutral-border w-full">
      <div className="flex justify-between items-center w-full px-5 h-16 max-w-[768px] mx-auto">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          {/* Logo Brand Icon with Heart and Pulse concept */}
          <div className="bg-brand-blue text-white p-1.5 rounded-lg flex items-center justify-center shadow-md shadow-brand-blue/20">
            <ShieldAlert size={18} className="fill-current" />
          </div>
          <span className="font-display text-lg font-extrabold tracking-tight bg-gradient-to-r from-brand-blue to-brand-blue-hover bg-clip-text text-transparent">
            핀토스 보험케어
          </span>
        </button>
        
        <div className="flex items-center gap-2">
          {/* Kakao Talk Consultation Button */}
          <a
            href={KAKAO_CHAT_URL}
            onClick={handleKakaoConsultation}
            className="flex items-center gap-1.5 font-sans font-semibold text-xs bg-[#FEE500] text-[#371D1E] hover:bg-[#FDD800] px-3.5 py-2 rounded-full transition-colors duration-300 active:scale-95 shadow-sm cursor-pointer"
          >
            <img src="/kakao_talk_icon.png" alt="카카오톡" className="w-[14px] h-[14px]" />
            <span>카톡상담</span>
          </a>
          
          {/* Phone Consultation Button */}
          <a
            href="tel:01026277771"
            className="flex items-center gap-1.5 font-sans font-semibold text-xs bg-white text-brand-blue border border-brand-blue hover:bg-brand-blue hover:text-white px-3.5 py-2 rounded-full transition-colors duration-300 active:scale-95 shadow-sm group cursor-pointer"
          >
            <Phone size={13} className="text-brand-blue group-hover:text-white transition-colors duration-300" />
            <span>빠른상담</span>
          </a>
        </div>
      </div>
    </header>
  );
}
