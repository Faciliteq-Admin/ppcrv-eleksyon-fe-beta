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
    DocumentCheckIcon,
} from "@heroicons/react/20/solid";

import { boolValue, getUserSession, saveActiveBatchNumber } from "../utils/functions";
import SidebarMain from "./SidebarMain";
import { getRequest } from "../utils/apiHelpers";

const defaultNav = [
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
];
const initialValidatorNav = [
    {
        id: "validations",
        title: "ER Validations",
        icon: <DocumentCheckIcon className="w-5 h-5 shrink-0 self-center" />,
        children: [
            {
                id: "forValidations",
                title: "For Validations",
                link: "/validations/for-validations",
                icon: <PresentationChartLineIcon className="w-5 h-5 shrink-0 self-center" />,
            },
            {
                id: "completedValidations",
                title: "Completed Validations",
                link: "/validations/completed-validations",
                icon: <PresentationChartLineIcon className="w-5 h-5 shrink-0 self-center" />,
            },
        ]
    },
];
const finalValidatorNav = [
    {
        id: "results",
        title: "Results",
        icon: <PresentationChartLineIcon className="w-5 h-5 shrink-0 self-center" />,
        children: [
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
];
const adminNav = [
    {
        id: "validations",
        title: "ER Validations",
        link: "/validations",
        icon: <DocumentCheckIcon className="w-5 h-5 shrink-0 self-center" />,
    },
    {
        id: "uploadResults",
        title: "Upload ER",
        link: "/upload-results",
        icon: <ArrowUpOnSquareIcon className="w-5 h-5 shrink-0 self-center" />,
    },
    {
        id: "userManagement",
        title: "User Management",
        link: "/user-management",
        icon: <UsersIcon className="w-5 h-5 shrink-0 self-center" />,
        children: [
            {
                id: "administrators",
                title: "Administrators",
                link: "/user-management/administrators",
            },
            {
                id: "validators",
                title: "Validators",
                link: "/user-management/validators",
            },
        ]
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

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<string>('home');
    const [selectedSubItem, setSelectedSubItem] = useState<string>('');
    const [openSection, setOpenSection] = useState<string>('');
    const navigate = useNavigate();

    const ref = useRef<HTMLLIElement>(null);
    const refE = useRef<HTMLElement>(null);

    let session = getUserSession();
    let selectedSidebar = sidebarData.filter((s: any) => s.id === selectedItem);
    let selectedTitle = selectedSidebar.length > 0 ? selectedSidebar[0].title : '';

    const state = useLocation().state;

    useEffect(() => {
        if (!session) {
            console.log('should navigate to login');
            navigate('/login');
        }

        if (session.user.role === "Administrator") {
            sidebarData = [...defaultNav, ...finalValidatorNav, ...adminNav];
        } else if (session.user.role === "Final Validator") {
            sidebarData = [...defaultNav, ...initialValidatorNav, ...finalValidatorNav];
        } else {
            sidebarData = [...defaultNav, ...initialValidatorNav];
        }

        let mounted = false;
        if (mounted) return;


        const path = window.location.pathname;

        if (["/", "/home"].includes(path)) {
            setSelectedItem('national');
        } else if (path.includes('results')) {
            setSelectedItem('results');
            if (path.includes('candidates')) {
                setSelectedSubItem('resultsCandidates');
            } else if (path.includes('precincts')) {
                setSelectedSubItem('resultsPrecincts');
            }
        } else if (path.includes('user-management')) {
            setSelectedItem('user-management');
            if (path.includes('administrators')) {
                setSelectedSubItem('administrators');
            } else if (path.includes('validators')) {
                setSelectedSubItem('validators');
            }
        } else if (path.includes('validations')) {
            setSelectedItem('validations');
            if (path.includes('for')) {
                setSelectedSubItem('for-validations');
            } else if (path.includes('completed')) {
                setSelectedSubItem('completed-validations');
            }
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

        handleGetActiveBatch();

        navigate(path, { state: state });

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            mounted = true;
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleGetActiveBatch = async () => {
        let res = await getRequest('/settings?field=activeBatch');
        if (res.data && res.data.length > 0) {
            saveActiveBatchNumber(res.data[0].value);
        }
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
    };

    const handleOnclick = (item: string, subItem: string) => {
        setSelectedItem(item);
        setSelectedSubItem(subItem ? subItem : '');
    }

    const handleSidebarMinify = () => {
        setIsMinified(!isMinified)
    }

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }


    // Close the dropdown if clicked outside
    const handleClickOutside = (event: any) => {
        if (refE.current) {
            if (openSection) {
                setOpenSection('');
            }
        }
        if (ref.current && !ref.current.contains(event.target)) {
            if (openSection) {
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
                <Navbar title={selectedTitle} toggleSidebar={toggleSidebar}></Navbar>
                <div className="p-4">
                    {props.children}
                </div>
            </main>

        </div >
    );
}

export default SideNavLayout;