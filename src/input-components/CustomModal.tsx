'use client'

import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogOverlay, DialogPortal, DialogTitle } from "@/components/ui/dialog"

interface ModalProps {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  children: React.ReactNode;
  modalHeading: string;
}

const Modal: React.FC<ModalProps> = ({ modalOpen, setModalOpen, children,modalHeading }) => {
  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <DialogContent className="sm:max-w-[70vw] 2xl:max-w-[65vw] rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle>{modalHeading}</DialogTitle>
          <DialogDescription  className='hidden'>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
          {children}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}

export default Modal;
