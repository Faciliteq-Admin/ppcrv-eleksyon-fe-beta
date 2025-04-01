import { ArrowPathIcon, EnvelopeIcon } from '@heroicons/react/20/solid';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { awaitTimeout } from '../utils/functions';
import { getRequest } from '../utils/apiHelpers';

export default function MessageDropdown(props: any) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let mounted = false;

        if (!mounted) {
            document.addEventListener('mousedown', handleClickOutside);
            handleFetchMessages(props.page);
        }


        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            mounted = true;
        };
    }, [props.page]);

    let processing = false;
    const handleFetchMessages = async (page: string) => {

        let category = "";
        if (processing) return;
        if (page === "Case Reports") {
            category = 'report';
        } else if (page === "Facility Reservation") {
            category = 'reservation';
        } else {
            return
        }

        processing = true;
        setLoading(true);
        let messages = await getRequest(`/messages/list?category=${category}&receiverId=Administrator`);
        // let messages = await getRequest(`/messages`, { category, receiverId: 'Administrator', lastMessages: 'true' });

        if (messages.data) {
            setMessages(messages.data.items);
        }

        setLoading(false);
        processing = false;

    }


    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    const handleOnclick = (event: Event, link: string) => {
        console.log(link);
    }

    const handleSelect = (e: any, idx: number) => {
        props.handleSelectMessage(messages[idx]);
        setIsOpen(false);
    }

    const handleReload = async () => {
        setLoading(true);
        await handleFetchMessages(props.page);
        setLoading(false);
    }

    return (
        <div className="" ref={ref}>
            <button
                onClick={handleToggle}
                className={`h-full self-center focus:outline-none`}
            >
                <EnvelopeIcon className="size-6" />
            </button>

            {/* Tooltip dropdown */}
            {isOpen && (
                <div className={`absolute right-4 -mt-4 w-56 max-h-56 bg-white border divide-y border-gray-300 shadow-lg z-20 ease-in duration-300 overflow-y-auto`}>

                    {messages.map((m: any, idx: number) => {
                        return <div key={idx} className="p-0.5">
                            <span className={`p-1 grid ${m.isRead ? '' : 'bg-blue-200'} text-sm`} onClick={(e) => handleSelect(e, idx)}>
                                <p className='font-semibold'>{m.senderFullName}</p>
                                <p>Report ID: {m.code}</p>
                            </span>
                        </div>
                    })}
                    {messages.length === 0 && <div className='py-2 flex justify-center'>
                        <span className='px-4'>No messages.</span>
                    </div>}
                    <div className='flex justify-center py-2'>
                        <button className='text-blue-400 flex space-x-2' onClick={handleReload}><p>{loading ? 'Reloading...' : 'Reload'}</p><ArrowPathIcon className={`size-5 ${loading ? 'animate-spin' : ''}`} /></button>
                    </div>
                </div>
            )}
        </div>
    );
}