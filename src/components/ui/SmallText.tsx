import { ReactNode } from "react";

type TextProps = {
  children: ReactNode;
  className?: string;
};

export function SmallText({ children, className = "" }: TextProps) {
  return (
    <p className={`text-base text-xs ${className}`}>
      {children}
    </p>
  );
}
