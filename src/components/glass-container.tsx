import { ReactNode } from "react";

interface GlassContainerProps {
  children: ReactNode;
}

export function GlassContainer({ children }: GlassContainerProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-lg">
      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm border border-white/30 z-0" />
      
      <div className="relative z-10 blur-sm select-none opacity-0 pointer-events-none">
        {children}
      </div>
    </div>
  );
}
