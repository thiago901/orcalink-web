import { ReactNode } from "react";
import { FiEyeOff } from "react-icons/fi";

interface HiddenTextProps {
  children: ReactNode;

  block?: boolean;
}

export function HiddenText({
  children,

  block = false,
}: HiddenTextProps) {
  return (
    <div className="relative inline-flex items-center gap-2">
      {children}
      {block && <FiEyeOff size={18} />}
    </div>
  );
}
