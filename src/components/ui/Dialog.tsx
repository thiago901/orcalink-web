import { ReactNode } from 'react';

import Button from './Button';
import { FaX } from 'react-icons/fa6';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

const Dialog = ({ isOpen, onClose, title, children, footer }: DialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-neutral-900/50 transition-opacity"
          onClick={onClose}
        />

        {/* Dialog */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-800">{title}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              icon={<FaX size={18} />}
            />
          </div>

          {/* Content */}
          <div className="p-4">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="flex justify-end gap-2 p-4 border-t border-neutral-200 bg-neutral-50">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dialog;