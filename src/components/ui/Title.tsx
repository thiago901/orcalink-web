import { ReactNode } from "react";

type TitleProps = {
  children: ReactNode;
  className?: string;
};

export function Title({ children, className = "" }: TitleProps) {
  return (
    <h1 className={`text-2xl font-bold ${className}`}>
      {children}
    </h1>
  );
}
