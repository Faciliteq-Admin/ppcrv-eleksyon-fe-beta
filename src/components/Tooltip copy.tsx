import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { prepareLogout } from '../utils/functions';

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
        switch (link) {
            case '/logout':
                prepareLogout();
                navigate('/login');
                break;

            default:
                navigate(link);
                break;
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
                <div className={`absolute ${props.position ? props.position : 'left'}-0 mt-2 w-48 bg-white border divide-y border-gray-300 rounded-md shadow-lg z-20 ease-in duration-300`}>
                    {props.tooltipContent.map((ttcItem: any, tidx: number) => {
                        if (Array.isArray(ttcItem)) {
                            return <div className="py-1" role="none">
                                {ttcItem.map((itemContent, idx) => {
                                    return <a onClick={(e: any) => handleOnclick(e, itemContent.link)} className="flex px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1} key={`menu-item-${tidx}-${idx}-${itemContent.id}`} >{itemContent.icon} {itemContent.title}</a>
                                })}
                            </div>
                        } else {
                            return <div className="py-1" role="none">
                                <a onClick={(e: any) => handleOnclick(e, ttcItem.link)} className="flex px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1} key={`menu-item-${tidx}-${ttcItem.id}`} >{ttcItem.icon} {ttcItem.title}</a>
                            </div>
                        }
                    })}

                </div>
            )}
        </div>
    );
}