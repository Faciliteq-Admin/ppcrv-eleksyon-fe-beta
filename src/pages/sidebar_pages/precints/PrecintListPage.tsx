import { useLoaderData, useNavigate } from "react-router-dom";
import TableCheckbox from "../../../components/TableCheckbox";
import { useEffect, useMemo, useState } from "react";
import Loader from "../../../components/Loader";
import { getRequest } from "../../../utils/apiHelpers";
import EmptyCard from "../../../components/EmptyCard";
import { toDate } from "../../../utils/functions";
import { usePrecincts } from "../../../hooks/usePrecincts";
import Table from "../../../components/Table";
import { useLocations } from "../../../hooks/useLocations";

export default function PrecintListPage(props: any) {
    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(50);
    const [search, setSearch] = useState("");
    const {
        data, total, loading, getPrecincts
    } = usePrecincts(page, limit);

    const {
        isLoading, regions, provinces, cityMuns, barangays,
        getRegions, getProvinces, getBarangays, getMunicipalities
    } = useLocations();

    const totalPages = Math.ceil(total / limit);

    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedCityMuns, setSelectedCityMuns] = useState("");
    const [selectedBarangay, setSelectedBarangay] = useState("");

    useEffect(() => {
        getPrecincts(selectedRegion, selectedProvince, selectedCityMuns, selectedBarangay);
        getRegions();
    }, [page, limit, search]);

    const filterFields = ['acmId', 'registeredVoters', 'regName', 'prvName', 'pollplace'];
    const tColumns = [
        {
            header: 'ACM ID',
            accessorKey: 'acmId',
            cell: (info: any) => `${info ?? 'N/A'}`,
            // accessorKey: null,
            // cell: (info: any) => {
            //     return <span className="">
            //         <a className="text-blue-500" onClick={(e) => handleView(e, info)}>{data[info].acmId}</a>
            //     </span>
            // },
            sort: true,
        },
        // {
        //     header: 'Clustered Precint',
        //     accessorKey: 'clusteredPrec',
        //     cell: (info: any) => `${info ?? 'N/A'}`,
        //     sort: true,
        // },
        {
            header: 'Registered Voters',
            accessorKey: 'registeredVoters',
            cell: (info: any) => `${info ?? 'N/A'}`,
            sort: true,
        },
        {
            header: 'Region',
            accessorKey: 'regName',
            cell: (info: any) => `${info ?? 'N/A'}`,
            sort: true,
        },
        {
            header: 'Province',
            accessorKey: 'prvName',
            cell: (info: any) => `${info ?? 'N/A'}`,
            sort: true,
        },
        {
            header: 'Poll Place',
            accessorKey: 'pollplace',
            cell: (info: any) => `${info ?? 'N/A'}`,
            sort: true,
        },
        // {
        //     header: 'City/Municipality',
        //     accessorKey: 'munName',
        //     cell: (info: any) => `${info ?? 'N/A'}`,
        //     sort: true,
        // },
        // {
        //     header: 'Barangay',
        //     accessorKey: 'brgyName',
        //     cell: (info: any) => `${info ?? 'N/A'}`,
        //     sort: true,
        // },
        // {
        //     header: 'Actions',
        //     accessorKey: null,
        //     cell: (info: any) => {
        //         return <span className="">
        //             <a className="text-blue-500" onClick={(e) => handleView(e, info)}>View</a>
        //         </span>
        //     }
        // }
    ];


    const handleView = (e: any, index: any) => {
        // navigate(`/precints/${(data as any[])[index].id}`, { state: data[index] });
    }

    const handleAddNew = () => {
        navigate('/precints/new');
    }

    const handleRowsPerPageChange = (e: any) => {
        setLimit(Number(e.target.value));
        setPage(1); // Reset to first page after changing rows per page
    };

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    async function handleSelect(e: any) {

        if (e.target.name === "selectedRegion") {
            if (e.target.name !== selectedRegion) {
                setSelectedProvince("");
                setSelectedCityMuns("");
                setSelectedBarangay("");
                setSelectedRegion(e.target.value);
                getProvinces(e.target.value);
            }

        } else if (e.target.name === "selectedProvince") {
            if (e.target.name !== selectedProvince) {
                setSelectedCityMuns("");
                setSelectedBarangay("");
                setSelectedProvince(e.target.value);
                getMunicipalities(e.target.value);
            }

        } else if (e.target.name === "selectedCityMuns") {
            if (e.target.value !== selectedCityMuns) {
                setSelectedBarangay("");
                setSelectedCityMuns(e.target.value);
                getBarangays(selectedProvince, e.target.value);
            }

        } else if (e.target.name === "selectedBarangay") {
            if (e.target.value !== selectedBarangay) {
                setSelectedBarangay(e.target.value);
            }
        }
    }

    const handleFilter = (e: any) => {
        setPage(1);
        getPrecincts(selectedRegion, selectedProvince, selectedCityMuns, selectedBarangay);
    }

    return (
        <div>
            {loading && <Loader />}
            {isLoading && <Loader />}
            <span className="text-sm font-medium">Precints</span>
            <div className="mt-4 flex flex-col">
                <div className="flex flex-col gap-2 lg:flex-row lg:items-center py-1">
                    <div className="">
                        <label htmlFor="selectedRegion" className="block text-sm/6 font-medium text-gray-900">
                            Region
                        </label>
                        <div className="mt-1">
                            <select
                                id="selectedRegion"
                                name="selectedRegion"
                                value={selectedRegion}
                                onChange={handleSelect}
                                autoComplete="reported-area"
                                className="px-2 py-2 w-full border border-gray-300 rounded-md text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                            // className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6"
                            >
                                <option key={'default'}></option>
                                {regions.map((m, index) => <option key={index}>{m}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="">
                        <label htmlFor="selectedProvince" className="block text-sm/6 font-medium text-gray-900">
                            Province
                        </label>
                        <div className="mt-1">
                            <select
                                id="selectedProvince"
                                name="selectedProvince"
                                value={selectedProvince}
                                onChange={handleSelect}
                                autoComplete="reported-area"
                                className="px-2 py-2 w-full border border-gray-300 rounded-md text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                            // className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6"
                            >
                                <option key={'default'}></option>
                                {provinces.map((m, index) => <option key={index}>{m}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="">
                        <label htmlFor="selectedCityMuns" className="block text-sm/6 font-medium text-gray-900">
                            City/Municipality
                        </label>
                        <div className="mt-1">
                            <select
                                id="selectedCityMuns"
                                name="selectedCityMuns"
                                value={selectedCityMuns}
                                onChange={handleSelect}
                                autoComplete="reported-area"
                                className="px-2 py-2 w-full border border-gray-300 rounded-md text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                            // className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6"
                            >
                                <option key={'default'}></option>
                                {cityMuns.map((m, index) => <option key={index}>{m}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="">
                        <label htmlFor="selectedBarangay" className="block text-sm/6 font-medium text-gray-900">
                            Barangay
                        </label>
                        <div className="mt-1">
                            <select
                                id="selectedBarangay"
                                name="selectedBarangay"
                                value={selectedBarangay}
                                onChange={handleSelect}
                                autoComplete="reported-area"
                                className="px-2 py-2 w-full border border-gray-300 rounded-md text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                            // className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6"
                            >
                                <option key={'default'}></option>
                                {barangays.map((m, index) => <option key={index}>{m}</option>)}
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={handleFilter}
                        className="px-4 py-2 bg-blue-300 rounded-md hover:bg-gray-400 disabled:opacity-50 self-end"
                    >
                        Filter
                    </button>
                </div>
                <div className="grid gap-2 my-2 lg:flex lg:justify-between">
                    <p className="self-end">Total Precints: {total}</p>
                    <div className="flex justify-between">
                        {data && data.length > 0 &&
                            <select
                                className="px-4 py-2 border border-gray-300 rounded-md"
                                value={limit}
                                onChange={handleRowsPerPageChange}
                            >
                                <option value={10}>10 rows</option>
                                <option value={25}>25 rows</option>
                                <option value={50}>50 rows</option>
                                <option value={100}>100 rows</option>
                                <option value={500}>500 rows</option>
                                <option value={1000}>1000 rows</option>
                            </select>
                        }
                    </div>
                </div>
                {data && data.length > 0 &&
                    <Table data={data} columns={tColumns} />
                }
                {!data || data.length === 0 && <EmptyCard>
                    <div className="place-self-center">
                        <p className="">
                            No data
                        </p>
                    </div>
                </EmptyCard>
                }
                {/* Pagination Controls  md:flex-col justify-between  */}
                {data && data.length > 0 &&
                    < div className={`mt-4 ${limit > 20 ? 'grid grid-cols-1 gap-2 md:flex' : 'flex'}  justify-between`}>
                        <div className='flex justify-between space-x-2'>
                            {limit > 20 && data.length > 20 &&
                                <select
                                    className="px-4 py-2 border border-gray-300 rounded-md"
                                    value={limit}
                                    onChange={handleRowsPerPageChange}
                                >
                                    <option value={10}>10 rows</option>
                                    <option value={25}>25 rows</option>
                                    <option value={50}>50 rows</option>
                                    <option value={100}>100 rows</option>
                                    <option value={500}>500 rows</option>
                                    <option value={1000}>1000 rows</option>
                                </select>
                            }
                        </div>
                        <div className="flex justify-between space-x-2">
                            <button
                                onClick={handlePreviousPage}
                                disabled={page === 1}
                                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className='mt-1.5'>
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={handleNextPage}
                                disabled={page === totalPages}
                                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}