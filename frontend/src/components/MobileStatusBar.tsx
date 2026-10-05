import React from 'react';
import { Wifi, Battery } from 'lucide-react';

interface MobileStatusBarProps {
  isEmergency?: boolean;
}

export const MobileStatusBar: React.FC<MobileStatusBarProps> = ({ isEmergency = false }) => {
  return (
    <div
      className={`h-11 px-6 flex items-center justify-between text-xs font-semibold select-none transition-colors ${
        isEmergency ? 'bg-red-600 text-white' : 'bg-transparent text-slate-800'
      }`}
    >
      <span className="font-semibold tracking-tight">9:41</span>
      
      <div className="flex items-center gap-1.5">
        {/* Cellular bars */}
        <div className="flex items-end gap-0.5 h-3">
          <span className="w-0.75 h-1 bg-current rounded-xs" />
          <span className="w-0.75 h-1.5 bg-current rounded-xs" />
          <span className="w-0.75 h-2.2 bg-current rounded-xs" />
          <span className="w-0.75 h-3 bg-current rounded-xs" />
        </div>

        {/* Wifi */}
        <Wifi className="w-3.5 h-3.5 stroke-[2.2]" />

        {/* Battery */}
        <div className="flex items-center gap-0.5">
          <div className="w-5 h-2.5 rounded-xs border border-current p-0.5 flex items-center">
            <div className="h-full w-full bg-current rounded-2xs" />
          </div>
          <div className="w-0.5 h-1 bg-current rounded-r-xs" />
        </div>
      </div>
    </div>
  );
};
