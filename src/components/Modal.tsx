import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  children: ReactNode;
  overlayClassName?: string;
  contentClassName?: string;
}

export function Modal({ isOpen, children, overlayClassName, contentClassName }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className={overlayClassName}>
      <div className={contentClassName}>{children}</div>
    </div>
  );
}
