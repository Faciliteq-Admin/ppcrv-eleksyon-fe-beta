import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import {
    MapPinIcon,
    UsersIcon,
    HomeIcon,
    BuildingLibraryIcon,
    PresentationChartLineIcon,
    ArrowUpOnSquareIcon,
    MapIcon,
    Cog6ToothIcon,
    DocumentChartBarIcon,
} from "@heroicons/react/20/solid";

import { awaitTimeout, boolValue, getUserSession } from "../utils/functions";
import SidebarMain from "./SidebarMain";
import { getRequest, postRequest, putRequest } from "../utils/apiHelpers";

const defaultNav = [
    {
        id: "home",
        title: "Home",
        link: "/",
        icon: <HomeIcon className="w-5 h-5 shrink-0 self-center" />,
    },
    {
        id: "national",
        title: "National",
        link: "/national",
        icon: <MapIcon className="w-5 h-5 shrink-0 self-center" />,
    },
    {
        id: "local",
        title: "Local",
        link: "/local",
        icon: <MapPinIcon className="w-5 h-5 shrink-0 self-center" />,
    },
    {
        id: "precints",
        title: "Precints",
        link: "/precints",
        icon: <BuildingLibraryIcon className="w-5 h-5 shrink-0 self-center" />,
    },
    {
        id: "candidates",
        title: "Candidates",
        link: "/candidates",
        icon: <UsersIcon className="w-5 h-5 shrink-0 self-center" />,
    },
    {
        id: "results",
        title: "Results",
        // link: "/results",
        icon: <PresentationChartLineIcon className="w-5 h-5 shrink-0 self-center" />,
        children: [
            // {
            //     id: "resultsAll",
            //     title: "All Results",
            //     link: "/results",
            //     icon: <PresentationChartLineIcon className="w-5 h-5 shrink-0 self-center" />,
            // },
            {
                id: "resultsCandidates",
                title: "By Candidate",
                link: "/results/candidates",
                icon: <PresentationChartLineIcon className="w-5 h-5 shrink-0 self-center" />,
            },
            {
                id: "resultsPrecincts",
                title: "By Precinct",
                link: "/results/precincts",
                icon: <PresentationChartLineIcon className="w-5 h-5 shrink-0 self-center" />,
            },
        ]
    },
    {
        id: "electionReturns",
        title: "Election Returns",
        link: "/election-returns",
        icon: <DocumentChartBarIcon className="w-5 h-5 shrink-0 self-center" />,
    },
    {
        id: "uploadResults",
        title: "Upload ER",
        link: "/upload-results",
        icon: <ArrowUpOnSquareIcon className="w-5 h-5 shrink-0 self-center" />,
    },
    {
        id: "settings",
        title: "Settings",
        link: "/settings",
        icon: <Cog6ToothIcon className="w-5 h-5 shrink-0 self-center" />,
    },
]

let sidebarData: any = [];

const SideNavLayout = (props: any) => {
    let savedIsMinified = boolValue(localStorage.getItem('isMinified')) ?? false;
    const [isMinified, setIsMinified] = useState(savedIsMinified);

    const [isOpen, setIsOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<string>('home');
    const [selectedSubItem, setSelectedSubItem] = useState<string>('');
    const [openSection, setOpenSection] = useState<string>('');
    const navigate = useNavigate();
    const [message, setMessage] = useState<any | null | undefined>();
    const [messages, setMessages] = useState<any[]>([]);
    const [isSending, setIsSending] = useState(false);
    const [loading, setLoading] = useState(false);
    const [text, setText] = useState("");
    const [image, setImage] = useState("");
    const [file, setFile] = useState("");

    const ref = useRef<HTMLLIElement>(null);
    const refE = useRef<HTMLElement>(null);

    let user = getUserSession();
    let selectedSidebar = sidebarData.filter((s: any) => s.id === selectedItem);
    let selectedTitle = selectedSidebar.length > 0 ? selectedSidebar[0].title : '';

    const state = useLocation().state;
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end", inline: "end" });
    }
    const scrollToEnd = async () => {
        if (messagesEndRef.current) {
            await awaitTimeout(50);
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }

    useEffect(() => {
        if (!user) {
            console.log('should navigate to login');
            navigate('/login');
        }

        sidebarData = defaultNav;

        if (user && user.user && user.user.lguId) {
            if (sidebarData.length < 4) {
                // sidebarData.push(userManagement);
            }
        } else {
            if (sidebarData.length < 4) {
                // let um = userManagement;
                // if (um.children.length === 2) {
                //     um.children.push(citizen);
                // }

                // sidebarData.push(lgu);
                // sidebarData.push(um);
                // sidebarData.push(location);
            }
        }

        let mounted = false;
        if (mounted) return;


        const path = window.location.pathname;

        if (["/", "/home"].includes(path)) {
            setSelectedItem('home');
        } else if (path.includes('results')) {
            setSelectedItem('results');
            if (path.includes('candidates')) {
                setSelectedSubItem('resultsCandidates');
            } else if (path.includes('precincts')) {
                setSelectedSubItem('resultsPrecincts');
            }
            // else {
            //     setSelectedSubItem('resultsAll');
            // }
        } else if (path.includes('national')) {
            setSelectedItem('national');
        } else if (path.includes('local')) {
            setSelectedItem('local');
        } else if (path.includes('precints')) {
            setSelectedItem('precints');
        } else if (path.includes('candidates')) {
            setSelectedItem('candidates');
        } else if (path.includes('upload-results')) {
            setSelectedItem('upload-results');
        } else if (path.includes('election-returns')) {
            setSelectedItem('electionReturns');
        } else if (path.includes('settings')) {
            setSelectedItem('settings');
        }

        navigate(path, { state: state });

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            mounted = true;
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [message]);

    let processing = false;
    const handleFetchMessages = async (category: string, referenceId: string) => {
        if (!message) return;
        processing = true;
        setLoading(true);
        let msgRes = await getRequest(`/messages?category=${category}&referenceId=${referenceId}`);
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

    const handleSidebarSelect = (e: any, item: string, link: string) => {
        e.preventDefault();
        console.log({ item, link });

        handleOnclick(item, '');
        if (isMinified) {
            setOpenSection('');
        }

        if (window.innerWidth < 768) {
            setIsSidebarOpen(!isSidebarOpen);
        }
        navigate(link);
    }

    const handleSidebarSubSelect = (e: any, item: string, subItem: string, link: string) => {
        e.preventDefault();
        console.log({ item, subItem, link });

        handleOnclick(item, subItem);
        if (isMinified) {
            setOpenSection('');
        }

        if (window.innerWidth < 768) {
            setIsSidebarOpen(!isSidebarOpen);
        }
        navigate(link);
    }

    // Toggle child items visibility
    const handleSectionToggle = (section: string) => {
        setOpenSection(openSection === section ? '' : section);
        // localStorage.setItem('openSection', openSection);
    };

    const handleOnclick = (item: string, subItem: string) => {
        setSelectedItem(item);
        setSelectedSubItem(subItem ? subItem : '');
        // localStorage.setItem('selectedItem', item);
        // localStorage.setItem('selectedSubItem', subItem);
        // localStorage.setItem('openSection', item);
    }

    const handleSidebarMinify = () => {
        // console.log(isMinified);

        setIsMinified(!isMinified)
        // localStorage.setItem('isMinified', (!isMinified).toString());
    }

    const toggleSidebar = () => {
        // console.log({ isSidebarOpen });
        setIsSidebarOpen(!isSidebarOpen);
        // localStorage.setItem('isSidebarOpen', isSidebarOpen.toString());
    }


    // Close the dropdown if clicked outside
    const handleClickOutside = (event: any) => {
        if (refE.current) {
            // console.log('ref cur', {openSection});
            if (openSection) {
                // console.log('ref cur opn sec', { openSection });
                // localStorage.setItem('openSection', '');
                setOpenSection('');
            }
        }
        if (ref.current && !ref.current.contains(event.target)) {
            // console.log('ref not cur', { openSection });
            if (openSection) {
                // console.log('ref not cur opn sec', { openSection });
                // localStorage.setItem('openSection', '');
                setOpenSection('');
            }
        }
    };


    return (
        <div className="layout flex h-screen" dir="ltr">

            { /* sidebar*/}
            <SidebarMain
                innerRef={ref}
                selectedSubItem={selectedSubItem}
                isSidebarOpen={isSidebarOpen}
                selectedItem={selectedItem}
                sidebarData={sidebarData}
                openSection={openSection}
                isMinified={isMinified}
                handleSidebarSubSelect={handleSidebarSubSelect}
                handleSidebarSelect={handleSidebarSelect}
                handleSectionToggle={handleSectionToggle}
                handleSidebarMinify={handleSidebarMinify}
                handleSidebarToggle={toggleSidebar}
                setOpenSection={setOpenSection}
            />

            <main className="main flex-1 overflow-y-auto" ref={refE}>
                <Navbar title={selectedTitle} user={user} toggleSidebar={toggleSidebar}></Navbar>
                <div className="p-4">
                    {props.children}
                </div>
            </main>

        </div >
    );
}

export default SideNavLayout;