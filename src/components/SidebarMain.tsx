import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import logo from "./../assets/ppcrvlogo.png";

export default function SidebarMain(props: any) {

    function handleClick(e: any) {
        if (e.target.id === "sidebarContainer") {
            props.handleSidebarToggle();
        }
    }

    return (
        <div id="sidebarContainer" className={`max-md:fixed max-md:h-full max-md:w-full max-md:z-20 ${props.isSidebarOpen ? '' : 'max-md:hidden'} relative ${props.isMinified ? 'w-[4.5rem]' : 'md:w-56'} max-md:bg-slate-600/60 shadow-md drop-shadow-xl`}
            onClick={handleClick}
        >
            {/* <div className={`${props.isMinified ? 'w-[4.5rem]' : 'w-56'} h-full bg-[#00A1E4] text-white overflow-y-auto space-y-12`}> */}
            <div className={`${props.isMinified ? 'w-[4.5rem]' : 'w-56'} h-full bg-gray-100 text-gray-600 overflow-y-auto space-y-12`}>
                <div>
                    <div className={`sticky top-0 h-16 flex bg-gray-800`}>
                        <div className={`flex gap-2 mx-auto my-auto h-12`}>
                            <img
                                alt="Company Name"
                                src={logo}
                                className={`flex ${props.isMinified ? 'mx-auto' : 'ml-auto'} my-auto h-12`}
                            />
                            {!props.isMinified && <h2 className="flex mr-auto my-auto text-xl font-semibold text-white">Eleksyon 2025</h2>}
                            {/* {!props.isMinified &&
                                <img
                                    alt="SumbongMo"
                                    src={banner}
                                    className={`my-auto -ml-3 h-10`}
                                />
                            } */}
                        </div>
                    </div>
                    <ul className="m-0"> {
                        props.sidebarData.map((data: any) => {
                            return (
                                <li key={data.id} ref={props.ref}>
                                    <a className={`flex mx-4 my-1 p-2 text-sm rounded ${props.selectedItem === data.id ? 'bg-[#00A1E4] text-white' : 'hover:bg-[#a9e1f8]'} justify-items-center`} onClick={(e) => (data.children ? props.handleSectionToggle(data.id) : props.handleSidebarSelect(e, data.id, data.link))}>
                                        {data.icon}
                                        {!props.isMinified && <p className="ml-2">{data.title}</p>}
                                    </a>

                                    {props.openSection === data.id &&
                                        <div className={`${props.isMinified ? 'absolute ml-16 -mt-11 bg-gray-700 rounded ' : 'mx-4'} `}>
                                            <ul className={`${props.isMinified ? 'm-2' : 'mx-4 bg-gray-700 rounded'} space-y-1`}> {
                                                data.children?.map((child: any) => {
                                                    return (
                                                        <li key={child.id}><a href="#" onClick={(e) => props.handleSidebarSubSelect(e, data.id, child.id, child.link)} className={`flex p-2 text-sm rounded ${props.selectedSubItem === child.id ? 'text-white' : 'hover:bg-gray-600'}`}>
                                                            {child.title}
                                                        </a></li>
                                                    );
                                                })
                                            } </ul>
                                        </div>
                                    }
                                </li>
                            );
                        })
                    } </ul>
                </div>
                <button
                    className="text-white mb-4 w-8 h-8 rounded-full bg-slate-500 mx-auto flex"
                    onClick={() => props.handleSidebarMinify()}
                >
                    {props.isMinified ? <ChevronRightIcon className='w-6 h-6 mx-auto my-auto' /> : <ChevronLeftIcon className='w-6 h-6 mx-auto my-auto' />}
                </button>
                {/* Version at the Bottom */}
                {/* <div className="fixed w-full landscape-hidden:hidden bottom-0 bg-gray-900 p-2 text-center">
                <p className="text-[10px]">v1.0.0</p>
            </div> */}
            </div>
        </div>
    );
}