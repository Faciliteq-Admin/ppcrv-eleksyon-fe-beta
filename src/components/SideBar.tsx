
import hub from "./../assets/hub.png";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import DropdownTooltip from "./Tooltip";

export default function SideBar(props: any) {
    return (
        <div className={`fixed inset-y-0 left-0 z-10 ${props.isMinified ? 'w-[72px]' : 'w-56'} bg-gray-800 text-white transform transition-transform ` +
            `${props.isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ` +
            `md:translate-x-0 md:relative md:flex-shrink-0 h-screen overflow-hidden`}

        >
            <div className="p-0 h-screen overflow-y-auto">
                <header className="sticky top-0 z-50 ">
                    <div className="flex p-0 h-16" >  {/* bg-gray-900"> */}
                        <img
                            alt="Company Name"
                            src={hub}
                            className={`flex ${props.isMinified ? 'mx-auto' : 'ml-auto'} my-auto w-8 h-8`}
                        />
                        {!props.isMinified && <h2 className="flex mr-auto ml-1 my-auto text-xl font-semibold">Faciliteq Hub</h2>}
                    </div>
                </header>
                <div className="p-4 divide-y mb-6">

                    <ul className="mt-0 md:max-2xl:mt-4 space-y-2">
                        {props.sidebarData.map((item: any) => {
                            return (
                                <li key={item.id}>
                                    <a href="#" onClick={(e) => (item.children ? props.handleSectionToggle(item.id) : props.handleSidebarSelect(e, item.id, item.link))} className={`${item.children ? 'flex justify-between' : 'block'} p-2 text-sm rounded ${props.selectedItem === item.id ? 'bg-blue-700' : 'hover:bg-gray-700'}`}>
                                        <span className="flex">
                                            {item.icon}
                                            {!props.isMinified && <p className="ml-2">{item.title}</p>}
                                            {/* {item.children && !props.isMinified && item.icon}
                                            {item.children && props.isMinified && <DropdownTooltip content={item.icon} tooltipContent={item.children} position={'left'}/>}
                                            {!props.isMinified && item.title} */}
                                        </span>
                                        {/* {item.children && !props.isMinified && <ChevronRightIcon className={`w-4 h-4 self-center transform transition-transform duration-300 ${props.openSection === item.id ? 'rotate-90' : 'rotate-0'}`} />} */}
                                    </a>
                                    {item.children && !props.isMinified && props.openSection === item.id && (
                                        <ul className="mt-2 ml-4 space-y-1 rounded bg-gray-700">
                                            {
                                                item.children.map((child: any) => {
                                                    return (
                                                        <li key={child.id}><a href="#" onClick={(e) => props.handleSidebarSubSelect(e, item.id, child.id, child.link)} className={`flex p-2 text-sm rounded ${props.selectedSubItem === child.id ? 'text-blue-300' : 'hover:bg-gray-600'}`}>
                                                            {child.title}
                                                        </a></li>
                                                    );
                                                })
                                            }
                                        </ul>
                                    )}

                                    {item.children && props.isMinified && props.openSection === item.id &&
                                        <div className="absolute left-0 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-20">
                                            <div className="p-4 text-sm text-gray-700">
                                                This is a floating div positioned relative to the button.
                                            </div>
                                        </div>
                                    }
                                </li>
                            );
                        })}
                        <button
                            className="text-white w-8 h-8 rounded-full bg-slate-500 mx-auto max-md:hidden"
                            onClick={() => props.handleSidebarMinify()}
                        >
                            {props.isMinified ? <ChevronRightIcon className='w-5 h-5 mx-auto' /> : <ChevronLeftIcon className='w-5 h-5 mx-auto' />}
                        </button>
                    </ul>
                </div>

                <div className="fixed h-6 w-full stick bottom-0 justify-center bg-gray-900 flex">
                    <p className="m-auto text-[10px]">v1.0.0</p>
                </div>
            </div>
        </div>
    );
}