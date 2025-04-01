'use client'

import { useEffect, useRef, useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, TransitionChild } from '@headlessui/react'
import { ArrowDownTrayIcon, PaperAirplaneIcon, PaperClipIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { getRequest, postRequest, putRequest } from '../utils/apiHelpers';
import { awaitTimeout } from '../utils/functions';

export default function MessageDialog(props: any) {
    const [spiel, setSpiel] = useState("");
    const [messages, setMessages] = useState<any[]>([]);
    const [isSending, setIsSending] = useState(false);
    const [loading, setLoading] = useState(false);
    const [text, setText] = useState("");
    const [image, setImage] = useState("");
    const [file, setFile] = useState("");

    let processing = false;
    const messagesEndRef = useRef<null | HTMLDivElement>(null);


    const emptySpiels = [
        "No messages yet!\nStart the conversation now. 🚀",
        "It's a little quiet here...\nSay something! 😃",
        "No messages found.\nWant to be the first to send one?",
        "No messages available at this time.",
        "Your inbox is empty. Check back later!",
        "No conversations yet. Start a new chat now.",
        "Crickets... 🦗 No messages yet!",
        "No messages? Maybe it's time to make some noise! 🎤",
        "This chat is feeling lonely... Send a message!",
        "Silence is golden... but messages are better! 💬",
        "Nothing to see here... yet! 👀",
        "Still waiting for the first message to drop. ⏳",
        "No messages? Maybe they're on vacation. 🌴",
        "Your inbox is empty—like a brand-new notebook! 📖",
        "Psst... say something! The chat won’t start itself. 😉",
        "A quiet place... too quiet. 🤫",
        "No messages detected. Did they go into stealth mode? 🕵️‍♂️",
        "Your messages are currently missing in action. 🚀",
        "Still loading... oh wait, there’s nothing here. 😅",
    ];

    useEffect(() => {
        setSpiel(emptySpiels[Math.floor(Math.random() * emptySpiels.length)]);
        handleFetchMessages();

    }, []);

    const scrollToEnd = async () => {
        if (messagesEndRef.current) {
            await awaitTimeout(50);
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }

    const handleFetchMessages = async () => {
        processing = true;
        setLoading(true);
        let msgRes = await getRequest(`/messages?referenceId=${props.data.id}`);
        if (msgRes.data) {
            setMessages(msgRes.data.items.reverse());
        }
        setLoading(false);
        processing = false;
    }

    const handleSetReadMessages = async (message: any) => {
        if (!message) return;
        const payload = {
            "referenceId": message.referenceId,
            "category": message.category,
            "senderId": message.senderId,
            "isRead": true
        }

        await putRequest('/messages', payload);
    }

    const handleSendMessage = async (e: any, file?: any) => {
        e.preventDefault();

        if (isSending) return;

        const payload: any = {
            messageBody: file ? null : text,
            attachment: file,
            senderId: "Administrator",
            referenceId: props.data.id,
            receiverId: props.data.reportedBy,
            isRead: false,
        };

        setIsSending(true);
        const res = await postRequest("/messages", payload);
        if (res) {
            setMessages((prev) => [...prev, { ...res.data }]);
            scrollToEnd();
        }
        setIsSending(false);

        setText('');
        setFile('');
        setImage('');
    }

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const uploadedFiles = Array.from(event.target.files);

            event.target.value = '';
            const formData = new FormData();
            formData.append('file', uploadedFiles[0]);

            let response = await postRequest('/uploader/single', formData);
            if (response) {
                if (response.fileUrl) {
                    handleSendMessage(
                        event,
                        {
                            url: response.fileUrl,
                            type: uploadedFiles[0].type,
                            name: uploadedFiles[0].name,
                            size: uploadedFiles[0].size,
                        }
                    );
                }
            }
        }
    }

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {

        if (event.target.files) {
            const uploadedFiles = Array.from(event.target.files);

            event.target.value = '';
            const formData = new FormData();
            formData.append('file', uploadedFiles[0]);

            let response = await postRequest('/uploader/single', formData);
            if (response) {
                if (response.fileUrl) {
                    setFile(response.fileUrl);
                    handleSendMessage(
                        event,
                        {
                            url: response.fileUrl,
                            type: uploadedFiles[0].type,
                            name: uploadedFiles[0].name,
                            size: uploadedFiles[0].size,
                        }
                    );
                }
            }
        }
    }

    function handleInput(e: any) {
        if (e.target.name === 'msg-text') {
            setText(e.target.value);
        }
    }

    return (
        <Dialog open={props.open} onClose={props.setOpen} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
            />

            <div className="fixed inset-0 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
                        <DialogPanel
                            transition
                            className="pointer-events-auto relative w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
                        >
                            <div className="flex h-full flex-col bg-blue-100 py-6 shadow-xl">
                                <div className="px-4 sm:px-6">
                                    <DialogTitle className="text-base font-semibold text-gray-900">{props.data.fullName}</DialogTitle>
                                    <TransitionChild>
                                        <div className="absolute top-0 right-0 mr-2 flex pt-4 pr-2 duration-500 ease-in-out data-closed:opacity-0 sm:-ml-10 sm:pr-2">
                                            <button
                                                type="button"
                                                onClick={() => props.setOpen(false)}
                                                className="relative rounded-md text-gray-300 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden"
                                            >
                                                <span className="absolute -inset-2.5" />
                                                <span className="sr-only">Close panel</span>
                                                <XMarkIcon aria-hidden="true" className="mt-1 size-7 text-gray-500" />
                                            </button>
                                        </div>
                                    </TransitionChild>
                                </div>
                                <div className="relative mt-6 flex-1">
                                    {/* Your content //px-4 sm:px-6 */}
                                    {/* {message && */}

                                    <div className="fixed border-2 w-full bg-white space-y-2 h-[calc(100%-4.5rem)]">
                                        <div className="grid p-2  h-10 rounded-t-lg text-s">
                                            {/* <span className="text-white text-sm">Report ID: {message.referenceId}</span> */}
                                            {/* <span className="text-white text-sm">Report ID: {message.code}, {message.senderFullName}</span> */}
                                            {/* <span>Tenant Full Name</span> */}
                                            {/* <button className="absolute top-2 right-2" onClick={handleCloseMessageBox}><XMarkIcon className="size-5 text-white" /></button> */}
                                        </div>
                                        <div ref={messagesEndRef} className="space-y-1 py-1 overflow-y-auto h-[calc(100%-6rem)]">
                                            {!messages || messages.length === 0 &&
                                                <div className='place-self-center'>
                                                    <p className="text-gray-500 sm:text-2xl px-6">{spiel}</p>
                                                </div>
                                            }
                                            {messages && messages.length > 0 && messages.map((m, idx) => {
                                                if (m.senderId === "Administrator") {
                                                    // you
                                                    return <div key={idx} dir='rtl' className="px-2 block" >
                                                        {m.messageBody &&
                                                            <div dir="ltr" className="p-2 w bg-blue-600 rounded-b-2xl rounded-tl-2xl text-sm ml-6 text-white inline-block">
                                                                {m.messageBody}
                                                            </div>
                                                        }
                                                        {m.attachment && !m.attachment.type.includes('image') &&
                                                            <div dir="ltr" className="p-2 bg-blue-600 rounded-b-2xl rounded-tl-2xl text-sm ml-6 text-white inline-block">
                                                                <a download={m.attachment.name} href={m.attachment.url} target="_blank" className="flex space-x-1" >
                                                                    <ArrowDownTrayIcon className="size-4 self-center" /> <p>{m.attachment.name}</p>
                                                                </a>
                                                            </div>
                                                        }
                                                        {m.attachment && m.attachment.type.includes('image') &&
                                                            <div dir="ltr" className="p-2 bg-blue-600 rounded-b-2xl rounded-tl-2xl text-sm ml-6 text-white inline-block">
                                                                <img
                                                                    src={m.attachment.url}
                                                                    loading="lazy"
                                                                    alt="image"
                                                                    crossOrigin="anonymous"
                                                                />
                                                            </div>
                                                        }
                                                    </div>
                                                } else {
                                                    // other
                                                    return <div key={idx} dir='ltr' className="px-2 block" >
                                                        {m.messageBody &&
                                                            <div dir="ltr" className="p-2 bg-gray-300 rounded-b-2xl rounded-tr-2xl text-sm mr-6 inline-block">
                                                                {m.messageBody}
                                                            </div>
                                                        }
                                                        {m.messageType === "file" && <div dir="ltr" className="p-2 bg-gray-300 rounded-b-2xl rounded-tr-2xl text-sm mr-6 inline-block">
                                                            <a download={m.filename} href={m.messageBody} target="_blank" className="flex space-x-1" >
                                                                <ArrowDownTrayIcon className="size-4 self-center" /> <p>{m.filename}</p>
                                                            </a>
                                                        </div>}
                                                        {m.messageType === "image" && <div dir="ltr" className="p-2 bg-gray-300 rounded-b-2xl rounded-tr-2xl text-sm mr-6 inline-block">
                                                            <img
                                                                src={m.attachment.url}
                                                                loading="lazy"
                                                                alt="image"
                                                                crossOrigin="anonymous"
                                                            />
                                                        </div>}
                                                    </div>
                                                }
                                            })}
                                            {isSending && <div dir="rtl" className="text-xs mx-1">...Sending</div>}
                                        </div>
                                        <div className="flex bottom-0 w-full p-1 bg-slate-200">
                                            <form onSubmit={handleSendMessage} className="w-full">
                                                <div className="flex space-x-1" >
                                                    <label className="">
                                                        <PaperClipIcon className="size-6 text-gray-500 my-1" />
                                                        <input id="file-upload" name="file-upload" type="file" hidden className="sr-only top-0" onChange={handleFileUpload}
                                                            accept=".csv, .pdf, application/pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                                        />
                                                    </label>
                                                    <label>
                                                        <PhotoIcon className="size-6 text-gray-500 my-1" />
                                                        <input id="image-upload" name="image-upload" type="file" hidden accept="image/*" onChange={handleImageUpload} />
                                                    </label>
                                                    <input
                                                        id="msg-text"
                                                        name="msg-text"
                                                        type="text"
                                                        value={text ?? ""}
                                                        placeholder="Type a message..."
                                                        onChange={handleInput}
                                                        className="p-2 border w-full h-8 border-gray-300 rounded-full text-gray-900 focus:ring-inset focus:outline-none"
                                                    // className="w-56 flex-grow rounded-full px-1" 
                                                    />
                                                    <button type="submit">
                                                        <PaperAirplaneIcon className="size-6 self-center text-blue-500" />
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                    {/* </div>} */}
                                </div>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}
