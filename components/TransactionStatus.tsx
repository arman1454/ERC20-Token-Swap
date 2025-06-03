"use client"
import React, { Fragment, useState } from "react";
import { Spinner } from "@nextui-org/react";
import { Dialog, Transition } from "@headlessui/react";

const TransactionStatus: React.FC = () => {
  const [open, setOpen] = useState(true);

  function handleClose() {
    setOpen(true);
  }

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="fixed z-[99999] inset-0 overflow-y-auto" onClose={handleClose}>
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          {/* Headless UI v2.1+ does not have Dialog.Overlay, use a div for the overlay */}
          <Transition
            show={open}
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" />
          </Transition>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition
            show={open}
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="status inline-block align-bottom py-6 bg-white border rounded-lg text-center overflow-hidden shadow-xl trasnform transition-all md:w-[35%] sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 py-4 items-center justify-center sm:px-6 sm:flex sm:flex-row-reverse">
                <Spinner color="primary" size="lg" />
                <span className="ml-2">Completing the transaction</span>
              </div>
              <p className="px-4 py-4 text-black items-center text-sm justify-center sm:px-6 sm:flex sm:flex-row-reverse">
                (Transaction would usually take &lt; 12 secs...)
              </p>
            </div>
          </Transition>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TransactionStatus;