'use client'

import { useEffect, useMemo, useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function ModalDialog(props: any) {
  const [open, setOpen] = useState(props.isOpen)

  let bgColor: string;
  let bgHoverColor: string;

  switch (props.submitButtonBGColor) {
    case 'red':
      bgColor = 'bg-red-600';
      bgHoverColor = 'hover:bg-red-600';
      break;
    case 'green':
      bgColor = 'bg-green-600';
      bgHoverColor = 'hover:bg-green-600';
      break;
    case 'orange':
      bgColor = 'bg-orange-600';
      bgHoverColor = 'hover:bg-orange-600';
      break;
    case 'blue':
      bgColor = 'bg-blue-600';
      bgHoverColor = 'hover:bg-blue-600';
      break;
    default:
      bgColor = 'bg-gray-600';
      bgHoverColor = 'hover:bg-gray-600';
  }

  return (
    <Dialog open={open} onClose={props.handleCancel} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg md:w-2/4 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="grid gap-3">
                <div className="mt-3 text-center sm:mt-0">
                  <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                    {props.title}
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {props.description}
                    </p>
                  </div>
                </div>
              </div>
              {props.children}
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse justify-between">
              <button
                type="button"
                onClick={props.handleSubmit}
                className={`inline-flex w-full justify-center rounded-md ${bgColor} px-3 py-2 text-sm font-semibold text-white shadow-sm ${bgHoverColor} sm:w-auto`}
              >
                {props.submitButtonTitle}
              </button>
              <button
                type="button"
                data-autofocus
                onClick={props.handleCancel}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
