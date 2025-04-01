import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { prepareLogout } from '../utils/functions';
import { UserCircleIcon } from '@heroicons/react/20/solid';

export default function DropdownTooltip(props: any) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Toggle the dropdown on button click
    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    // Close the dropdown if clicked outside
    const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    const handleOnclick = (event: Event, link: string) => {
        setIsOpen(!isOpen);

        if (link === '/logout') {
            prepareLogout();
            navigate('/login');
        } else {
            navigate(link);
        }
    }

    useEffect(() => {
        // Add event listener for clicks outside the dropdown
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative inline-block text-left" ref={ref}>
            {/* Dropdown button */}
            <button
                onClick={handleToggle}
                className={`${props.padx} ${props.pady} ${props.textColor ?? 'text-white'} ${props.bgColor} ${props.borderRadius} ${props.hoverBgColor} focus:outline-none`}
            >
                {props.content}
            </button>

            {/* Tooltip dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white border divide-y border-gray-300 rounded-md shadow-lg z-20 ease-in duration-300">
                    {/* <div className={`absolute left-10 top-24 transform -translate-y-1/2 px-2 py-1 bg-gray-400 text-white text-sm rounded-md`}> */}
                    {props.tooltipContent.map((ttcItem: any, tidx: number) => {
                        if (Array.isArray(ttcItem)) {
                            return <div key={`item-${tidx}`} className="py-1" role="none">
                                {ttcItem.map((itemContent, idx) => {
                                    return <a
                                        onClick={(e: any) => handleOnclick(e, itemContent.link)}
                                        className="flex px-4 py-2 text-sm text-gray-700 space-x-3"
                                        role="menuitem"
                                        tabIndex={-1}
                                        key={`menu-item-${tidx}-${idx}-${itemContent.id}`}
                                    >
                                        {itemContent.icon}
                                        <span>{itemContent.title}</span>
                                    </a>
                                })}
                            </div>
                        } else {
                            return <div key={`item-${tidx}`} className="py-1" role="none">
                                <a onClick={(e: any) => handleOnclick(e, ttcItem.link)} className="flex px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1} key={`menu-item-${tidx}-${ttcItem.id}`} >{ttcItem.icon} {ttcItem.title}</a>
                            </div>
                        }
                    })}

                </div>
            )}
        </div>
    );
}