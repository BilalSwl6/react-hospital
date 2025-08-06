import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  confirmBeforeClose?: boolean;
}

const sizeMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
  confirmBeforeClose = false,
}: ModalProps) {
  const [pendingClose, setPendingClose] = useState(false);

  const handleOpenChange = (value: boolean) => {
    if (!value && confirmBeforeClose) {
      const confirmed = window.confirm('Are you sure you want to close this modal?');
      if (!confirmed) return;
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogOverlay className="bg-black/50 backdrop-blur-sm fixed inset-0 z-40 transition-all" />
      <DialogContent
        className={cn(
          'z-50 w-full rounded-xl border border-border bg-background p-6 shadow-xl transition-all',
          sizeMap[size]
        )}
      >
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}

        <div className="py-2">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
