'use client';
import { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import Typography from './Typography';

interface ModalProps {
  onClose: () => void; 
  onConfirm?: () => void; // Optional prop, use `?` to indicate it may be undefined
  message?: string; // Optional custom message
}

const Modal = ({ onClose, onConfirm, message }: ModalProps) => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    onClose(); 
  };

  const handleConfirm = () => {
    setOpen(false);
    if (onConfirm) { // Check if `onConfirm` is defined before calling it
      onConfirm();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-10">
      <div className="fixed inset-0 bg-black bg-opacity-30" aria-hidden="true" />
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <DialogPanel className="relative transform overflow-hidden lg:w-[232px] w-full max-w-md rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all">
            <div className="mt-3 text-center">
              <DialogTitle as="h4" className="text-lg font-semibold leading-6 text-gray-900">
                <Typography className='text-black'>{message || "Are you sure you want to delete this card?"}</Typography>
              </DialogTitle>
            </div>
            <div className="mt-5 flex justify-between space-x-4">
              {/* "No" Button */}
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                No
              </button>
              {/* "Yes" Button */}
              <button
                type="button"
                onClick={handleConfirm}
                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Yes
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default Modal;
