import { ReactNode } from "react";

type TextProps = {
  children: ReactNode;
  className?: string;
};

export function Text({ children, className = "" }: TextProps) {
  return (
    <p className={`text-base ${className}`}>
      {children}
    </p>
  );
}
