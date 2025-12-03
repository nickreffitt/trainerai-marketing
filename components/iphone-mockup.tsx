import React from 'react';
import { cn } from '@/lib/utils';

interface IPhoneMockupProps {
  children: React.ReactNode;
  className?: string;
}

export function IPhoneMockup({ children, className }: IPhoneMockupProps) {
  return (
    <div className={cn("relative mx-auto", className)}>
      {/* iPhone Frame */}
      <div className="relative bg-slate-900 rounded-[60px] p-3 shadow-2xl border-[14px] border-slate-900 w-[390px] h-[844px]">
        {/* Dynamic Island */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[35px] bg-slate-900 rounded-b-[20px] z-10" />

        {/* Screen */}
        <div className="relative bg-white rounded-[48px] overflow-hidden h-full w-full">
          <div className="absolute inset-0 overflow-y-auto scrollbar-hide">
            {children}
          </div>
        </div>

        {/* Side buttons */}
        <div className="absolute -left-[17px] top-[120px] w-1 h-8 bg-slate-800 rounded-l" />
        <div className="absolute -left-[17px] top-[170px] w-1 h-12 bg-slate-800 rounded-l" />
        <div className="absolute -left-[17px] top-[230px] w-1 h-12 bg-slate-800 rounded-l" />
        <div className="absolute -right-[17px] top-[180px] w-1 h-16 bg-slate-800 rounded-r" />
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 -z-10 blur-3xl opacity-30">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-blue-500 to-purple-500" />
      </div>
    </div>
  );
}
