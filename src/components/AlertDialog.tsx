'use client'

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function AlertDialog(props: any) {
  const [open, setOpen] = useState(props.isOpen)

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
            className="fixed transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg md:w-1/4 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
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
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse justify-between">
              <button
                type="button"
                onClick={props.handleSubmit}
                className={`inline-flex w-full justify-center rounded-md bg-${props.submitButtonBGColor}-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-${props.submitButtonBGColor}-500 sm:w-auto`}
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
