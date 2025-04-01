import { useEffect, useMemo, useRef, useState } from "react";
import hub from "./../assets/hub.png";
import { ArrowLeftStartOnRectangleIcon, Bars3Icon, Cog6ToothIcon, EnvelopeIcon, UserCircleIcon, UserIcon } from "@heroicons/react/20/solid";
import { IoIosNotifications } from "react-icons/io";
import DropdownTooltip from "./Tooltip";
import MessageDropdown from "./MessageDropdown";
import { getUserSession } from "../utils/functions";

export default function Navbar(props: any) {

    const [isOpen, setIsOpen] = useState(props.isOpen);
    const [user, setUser] = useState<any>(null);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let mounted = false;

        const session = getUserSession();

        if (session) {
            setUser(session.user);
        }

        return () => {
            mounted = true;
        }
    }, []);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
            setIsOpen(!isOpen);
        }
    }

    const ttContent = [
        [
            {
                id: "tt-profile",
                title: "Profile",
                icon: <UserIcon className="h-5 w-5" />,
                link: "/profile"
            },
        ],
        [
            {
                id: "tt-logout",
                title: "Logout",
                icon: <ArrowLeftStartOnRectangleIcon className="h-5 w-5" />,
                link: "/logout"
            },
        ]
    ];

    return (
        <header className="sticky top-0 w-full z-10 bg-gray-800 h-16 py-2 px-4 shadow-md flex justify-between items-center">
            <div className="flex space-x-2 md:space-x-0">
                <button
                    className="text-gray-00 focus:outline-none md:hidden"
                    onClick={() => props.toggleSidebar()}
                >
                    <Bars3Icon className="w-6 h-6 text-white" />
                </button>
                <p className="max-md:hidden text-white">Transparency Server Monitoring</p>
            </div>
            <div className="flex p-0 h-16 space-x-4">
                <p className="self-center text-white">{user ? user.firstName + ' ' + user.lastName : ''}</p>
                <div className="self-center">
                    <DropdownTooltip
                        content={
                            user && user.profileImage
                                ? <img className="inline-block size-8 rounded-full ring-2 ring-gray-900" src={user.profileImage} alt="" />
                                : <UserCircleIcon className="size-8 rounded-full bg-gray-500" />
                        }
                        icon={<UserCircleIcon className="h-5 w-5" />}
                        tooltipContent={ttContent} position={'left'}
                    />
                </div>
            </div>


            {props.children}
        </header >
    );
}