import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../../../components/Loader";
import EmptyCard from "../../../components/EmptyCard";
import { useLocations } from "../../../hooks/useLocations";
import { useResultPrecinctSummary } from "../../../hooks/useValidationSummary";
import { getUserSession } from "../../../utils/functions";
import { ChevronRightIcon, FlagIcon } from "@heroicons/react/20/solid";

export default function ValidationPrecinctListPage(props: any) {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(50);
    const [search, setSearch] = useState("");

    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedCityMuns, setSelectedCityMuns] = useState("");
    const [selectedBarangay, setSelectedBarangay] = useState("");
    const {
        data, total, loading,
        getResultSummary,
    } = useResultPrecinctSummary(page, limit);
    const {
        isLoading, regions, provinces, cityMuns, barangays,
        getRegions, getProvinces, getBarangays, getMunicipalities
    } = useLocations();

    const totalPages = Math.ceil(total / limit);
    const user = getUserSession().user;

    useEffect(() => {
        getRegions();
        getResultSummary();
    }, [page, limit]);

    const handleRowsPerPageChange = (e: any) => {
        console.log(e.target.value);

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
                getMunicipalities();
                getBarangays();
            }

        } else if (e.target.name === "selectedProvince") {
            if (e.target.name !== selectedProvince) {
                setSelectedCityMuns("");
                setSelectedBarangay("");
                setSelectedProvince(e.target.value);
                getMunicipalities(e.target.value);
                getBarangays();
            }

        } else if (e.target.name === "selectedCityMuns") {
            if (e.target.value !== selectedCityMuns) {
                setSelectedBarangay("");
                setSelectedCityMuns(e.target.value);
                getBarangays(selectedProvince, e.target.value);
            }

        } else if (e.target.name === "selectedBarangay") {
            if (e.target.value !== selectedBarangay) {
                console.log(e);

                setSelectedBarangay(e.target.value);
            }
        }
    }

    const handleFilter = (e: any) => {
        setPage(1);
        getResultSummary(selectedRegion, selectedProvince, selectedCityMuns, selectedBarangay, search);
    }

    const handleClear = (e: any) => {
        setPage(1);
        setSearch("");
        setSelectedRegion("");
        setSelectedProvince("");
        setSelectedCityMuns("");
        setSelectedBarangay("");
        getProvinces();
        getMunicipalities();
        getBarangays();
    }

    const handleRowClick = async (data: any) => {
        let session = getUserSession();
        console.log(session.user.role);

        if (session.user.role === "Administrator") {
            navigate('/validations/' + data._id, { state: data });
        } else {
            const newData = { ...data, headerLabel: 'For Validations' };
            navigate('/validations/for-validations/' + data._id, { state: newData });
        }
    }

    return (
        <div>
            {loading && <Loader />}
            {isLoading && <Loader />}
            <span className="flex text-sm font-medium text-gray-500">ER Validations <ChevronRightIcon className="size-4 self-center" /> <p className="text-black">For Validations</p> </span>
            <div className="mt-4 flex flex-col gap-2 lg:flex-row lg:items-center">
                <div className="">
                    <label htmlFor="selectedRegion" className="block text-sm/6 font-medium text-gray-900">
                        ACM ID / Precinct
                    </label>
                    <div className="mt-1">
                        <input
                            type="text"
                            placeholder="ACM ID / Precinct"
                            className="px-4 py-2 border border-gray-300 rounded-md "
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>
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
                            <option key={'default'}>{selectedBarangay}</option>
                            {barangays.filter(e => e !== selectedBarangay).map((m, index) => <option key={index}>{m}</option>)}
                        </select>
                    </div>
                </div>
                <div className="flex gap-2 self-end">
                    <button
                        onClick={handleFilter}
                        className="px-4 py-2 bg-blue-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
                    >
                        Filter
                    </button>
                    {selectedRegion && <button
                        onClick={handleClear}
                        className="px-4 py-2 bg-blue-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
                    >
                        Clear
                    </button>}
                </div>
            </div>
            <div className="flex flex-col">
                <div className="grid gap-2 my-0 lg:flex lg:justify-between py-1">
                    <p className="self-end">Total: {total}</p>

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
                    <div className="flex flex-col">

                        {/* Table */}
                        <div className="shadow overflow-auto">
                            <table className="min-w-full shadow-md rounded-lg">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th key="acmId"
                                            scope="col"
                                            className="cursor-pointer text-sm font-medium text-gray-900 px-4 py-4 text-left"
                                        >
                                            <b className='flex'>
                                                ACM ID
                                            </b>
                                        </th>
                                        {user.role === "Administrator" && <th key="Status"
                                            scope="col"
                                            className="cursor-pointer text-sm font-medium text-gray-900 px-4 py-4 text-left"
                                        >
                                            <b className='flex'>
                                                Status
                                            </b>
                                        </th>}
                                        {user.role === "Administrator" && <th key="Result"
                                            scope="col"
                                            className="cursor-pointer text-sm font-medium text-gray-900 px-4 py-4 text-left"
                                        >
                                            <b className='flex'>
                                                Result
                                            </b>
                                        </th>}
                                        <th key="address"
                                            scope="col"
                                            className="cursor-pointer text-sm font-medium text-gray-900 px-4 py-4 text-left"
                                        >
                                            <b className='flex'>
                                                Address
                                            </b>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((row: any, idx: number) => (
                                        <tr key={idx} className="bg-white border-b">
                                            <td
                                                key={`acmId-${idx}`}
                                                onClick={() => handleRowClick(row)}
                                                className="px-4 py-2  whitespace-nowrap text-sm font-medium text-gray-900"
                                            >
                                                {row.precinctCode}
                                            </td>
                                            {user.role === "Administrator" && <th key={`status-${idx}`}
                                                scope="col"
                                                className="cursor-pointer text-sm font-medium text-gray-900 px-4 py-4 text-left"
                                            >
                                                <b className='flex'>
                                                    {row.finalPassDone && <p className="text-green-500">Done</p>}
                                                    {!row.finalPassDone && <p className="text-gray-500">Pending</p>}
                                                </b>
                                            </th>}
                                            {user.role === "Administrator" && <th key={`result-${idx}`}
                                                scope="col"
                                                className="cursor-pointer text-sm font-medium text-gray-900 px-4 py-4 text-left"
                                            >
                                                <b className='flex'>
                                                    {!row.finalPassDone && <FlagIcon className="size-4 text-gray-400" />}
                                                    {row.finalPassDone && row.finalPassFlag && <FlagIcon className="size-4 text-green-600" />}
                                                    {row.finalPassDone && !row.finalPassFlag && <FlagIcon className="size-4 text-red-600" />}
                                                </b>
                                            </th>}
                                            <td
                                                key={`address-${idx}`}
                                                className="px-4 py-2  whitespace-nowrap text-sm font-medium text-gray-900"
                                            >
                                                {row.regName}, {row.prvName}, {row.munName}, {row.brgyName}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
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