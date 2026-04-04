'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { PurchaseModal } from './purchase-modal';

interface ModalContext {
  openModal: (plan?: 'starter' | 'pro' | 'enterprise') => void;
  closeModal: () => void;
}

const ModalCtx = createContext<ModalContext>({ openModal: () => {}, closeModal: () => {} });

export function usePurchaseModal() {
  return useContext(ModalCtx);
}

export function PurchaseModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [plan, setPlan] = useState<'starter' | 'pro' | 'enterprise'>('pro');

  const openModal = (p?: 'starter' | 'pro' | 'enterprise') => {
    if (p) setPlan(p);
    setIsOpen(true);
  };

  return (
    <ModalCtx.Provider value={{ openModal, closeModal: () => setIsOpen(false) }}>
      {children}
      <PurchaseModal isOpen={isOpen} onClose={() => setIsOpen(false)} defaultPlan={plan} />
    </ModalCtx.Provider>
  );
}
