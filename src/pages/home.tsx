import { useState } from 'react';
import {
    CubeIcon,
    UsersIcon,
    MapPinIcon,
    ChartPieIcon,
    HomeModernIcon,
    Cog6ToothIcon,
    UserIcon,
    ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/20/solid";
import { closestCenter, DndContext } from '@dnd-kit/core';
import DraggableRadialBarChart from '../components/DraggableRadialBarChart';
import DraggableBarChart from '../components/DraggableBarChart';
import DraggableLineChart from '../components/DraggableLineChart';
import DraggablePieChart from '../components/DraggablePieChart';
import { rectSwappingStrategy, SortableContext } from '@dnd-kit/sortable';

const data = [
    { name: 'Jan', value: 40 },
    { name: 'Feb', value: 50 },
    { name: 'Mar', value: 70 },
];

const data1 = [
    {
        "name": "Page A",
        "uv": 4000,
        "pv": 2400
    },
    {
        "name": "Page B",
        "uv": 3000,
        "pv": 1398
    },
    {
        "name": "Page C",
        "uv": 2000,
        "pv": 9800
    },
    {
        "name": "Page D",
        "uv": 2780,
        "pv": 3908
    },
    {
        "name": "Page E",
        "uv": 1890,
        "pv": 4800
    },
    {
        "name": "Page F",
        "uv": 2390,
        "pv": 3800
    },
    {
        "name": "Page G",
        "uv": 3490,
        "pv": 4300
    }
]

const data2 = [
    {
        "name": "18-24",
        "uv": 31.47,
        "pv": 2400,
        "fill": "#8884d8"
    },
    {
        "name": "25-29",
        "uv": 26.69,
        "pv": 4567,
        "fill": "#83a6ed"
    },
    {
        "name": "30-34",
        "uv": -15.69,
        "pv": 1398,
        "fill": "#8dd1e1"
    },
    {
        "name": "35-39",
        "uv": 8.22,
        "pv": 9800,
        "fill": "#82ca9d"
    },
    {
        "name": "40-49",
        "uv": -8.63,
        "pv": 3908,
        "fill": "#a4de6c"
    },
    {
        "name": "50+",
        "uv": -2.63,
        "pv": 4800,
        "fill": "#d0ed57"
    },
    {
        "name": "unknow",
        "uv": 6.67,
        "pv": 4800,
        "fill": "#ffc658"
    }
]


const user = {
    name: 'Tom Cook',
    email: 'tom@example.com',
    imageUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}
const navigation = [
    { name: 'Dashboard', href: '#', current: true },
    { name: 'Team', href: '#', current: false },
    { name: 'Projects', href: '#', current: false },
    { name: 'Calendar', href: '#', current: false },
    { name: 'Reports', href: '#', current: false },
]
const userNavigation = [
    { name: 'Your Profile', href: '#' },
    { name: 'Settings', href: '#' },
    { name: 'Sign out', href: '#' },
]


const sidebarData = [
    {
        id: "dashboard",
        title: "Dashboard",
        icon: <ChartPieIcon className="w-5 h-5 self-center mr-2" />,
        link: "/dashboard",
        children: null,
    },
    {
        id: "platform",
        title: "Platforms",
        icon: <CubeIcon className="w-5 h-5 self-center mr-2" />,
        link: "/platforms",
        children: null,
    },
    {
        id: "location",
        title: "Locations",
        icon: <MapPinIcon className="w-5 h-5 self-center mr-2" />,
        link: "/locations",
        children: [
            {
                id: "province",
                title: "Provinces",
                icon: null,
                link: "/locations/provinces",
            },
            {
                id: "citymunicipality",
                title: "Cities / Municipalities",
                icon: null,
                link: "/locations/citymuns",
            },
            {
                id: "barangay",
                title: "Barangays",
                icon: null,
                link: "/locations/barangays",
            },
        ],
    },
    {
        id: "usermanagement",
        title: "User Management",
        icon: <UsersIcon className="w-5 h-5 self-center mr-2" />,
        link: "/user-management",
        children: [
            {
                id: "user",
                title: "Users",
                icon: null,
                link: "/users",
                children: null,
            },
            {
                id: "homeowner",
                title: "Homeowners",
                icon: null,
                link: "/homeowners",
                children: null,
            },
            {
                id: "developer",
                title: "Developers",
                icon: null,
                link: "/developers",
                children: null,
            },
            {
                id: "contractor",
                title: "Contractors",
                icon: null,
                link: "/contractors",
                children: null,
            },
        ]
    },
    {
        id: "propertymanagement",
        title: "Property Management",
        icon: <HomeModernIcon className="w-5 h-5 self-center mr-2" />,
        link: "/property-management",
        children: [
            {
                id: "project",
                title: "Projects",
                icon: null,
                link: "/projects",
                children: null,
            },
            {
                id: "tower",
                title: "Towers",
                icon: null,
                link: "/towers",
                children: null,
            },
            {
                id: "commonarea",
                title: "Common Areas",
                icon: null,
                link: "/common-areas",
                children: null,
            },
            {
                id: "unit",
                title: "Units",
                icon: null,
                link: "/units",
                children: null,
            },
        ]
    }
]

const ttContent = [
    [
        {
            id: "tt-profile",
            label: "Profile",
            icon: <UserIcon className="h-5 w-5" />,
            link: "/profile"
        },
        {
            id: "tt-settings",
            label: "Settings",
            icon: <Cog6ToothIcon className="h-5 w-5" />,
            link: "/settings"
        }
    ],
    [
        {
            id: "tt-logout",
            label: "Logout",
            icon: <ArrowLeftStartOnRectangleIcon className="h-5 w-5" />,
            link: "/logout"
        }
    ]
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const initialCharts = [
    { id: "chart1", data: data, type: 'line' },
    { id: "chart2", data: data, type: 'pie' },
    { id: "chart4", data: data2, type: 'radialbar' },
    { id: "chart3", data: data1, type: 'bar' },
    { id: "chart5", data: data1, type: 'bar', layout: 'horizontal' },
];

export default function HomePage(props: any) {
    const [charts, setCharts] = useState(initialCharts);

    const handleDragAndDrop = (e: any) => {
        const { active, over } = e;
        
        if (active.id !== over.id) {
            const oldIndex = charts.findIndex(a => a.id === active.id);
            const newIndex = charts.findIndex(a => a.id === over.id);
            const a = charts[oldIndex];
            const n = charts[newIndex];
            charts[oldIndex] = n;
            charts[newIndex] = a;
            
            setCharts([...charts]);
        }

    };

    return (
        <div >
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragAndDrop}>
                <div className="p-6 grid grid-cols-2 gap-4">
                    <SortableContext items={charts} strategy={rectSwappingStrategy}>
                        {charts.map((chart) => {
                            if (chart.type === 'bar') {
                                return <DraggableBarChart key={chart.id} chart={chart} />
                            } else if (chart.type === 'pie') {
                                return <DraggablePieChart key={chart.id} chart={chart} />
                            } else if (chart.type === 'radialbar') {
                                return <DraggableRadialBarChart key={chart.id} chart={chart} />
                            } else {
                                return <DraggableLineChart key={chart.id} chart={chart} />
                            }
                        })}
                    </SortableContext>
                </div>
            </DndContext>
        </div>
    );
}
