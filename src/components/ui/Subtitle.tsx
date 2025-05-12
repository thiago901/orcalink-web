import { ReactNode } from "react";

type SubtitleProps = {
  children: ReactNode;
  className?: string;
};

export function Subtitle({ children, className = "" }: SubtitleProps) {
  return (
    <h2 className={`text-xl font-semibold ${className}`}>
      {children}
    </h2>
  );
}
