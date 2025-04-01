'use client'

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'

export default function ImageDialog(props: any) {
    const [open, setOpen] = useState(true)

    const handleClose = () => {
        setOpen(!open);
        props.handleCloseImage();
    }

    return (
        <Dialog open={open} onClose={handleClose} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />

            <div className="fixed inset-0 z-20 w-screen overflow-y-auto">
                {/* <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"> */}
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg md:w-1/4 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                    >
                        <div className="bg-gray-50 sm:flex justify-center items-center">
                            <picture>
                                <source srcSet={props.image} />
                                <img src={props.image} 
                                    loading="lazy"
                                    alt={`Uploaded image`}
                                    className="object-scale-down"
                                    crossOrigin="anonymous"
                                />
                            </picture>
                            {/* <img
                                src={props.image}
                                loading="lazy"
                                alt={`Uploaded image`}
                                className="object-scale-down"
                                crossOrigin="anonymous"
                            /> */}
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}
