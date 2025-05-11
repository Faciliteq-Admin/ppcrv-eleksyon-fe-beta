import { useEffect, useState } from "react";
import Loader from "../../../components/Loader";
import EmptyCard from "../../../components/EmptyCard";
import { getRequest } from "../../../utils/apiHelpers";
import { formatNumber, getActiveBatchNumber, saveActiveBatchNumber } from "../../../utils/functions";

export default function ResultSummaryPage(props: any) {

    const [regions, setRegions] = useState<any[]>([]);
    const [provinces, setProvinces] = useState<any[]>([]);
    const [cityMuns, setCityMuns] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedCityMuns, setSelectedCityMuns] = useState("");
    const [data, setData] = useState<any[]>();
    let processing = false;

    useEffect(() => {

        let mounted = false;
        getData();

        return () => {
            mounted = true;
        };
    }, []);

    const getData = async () => {
        if (processing) return;

        processing = true;
        setLoading(true);

        await getLocations();
        await getReports();

        setLoading(false);
        processing = false;
    }

    const getReports = async () => {
        let path = `/reports/summary?`;
        const queries = [];
        if (selectedRegion) {
            queries.push(`regName=${selectedRegion}`);
        }
        if (selectedProvince) {
            queries.push(`prvName=${selectedProvince}`);
        }
        if (selectedCityMuns) {
            queries.push(`munName=${selectedCityMuns}`);
        }

        const activeBatch = getActiveBatchNumber();
        if (activeBatch) {
            queries.push(`uploadBatchNum=` + activeBatch);
        } else {
            let res = await getRequest('/settings?field=activeBatch');
            if (res.data && res.data.length > 0) {
                saveActiveBatchNumber(res.data[0].value);
                queries.push(`uploadBatchNum=` + res.data[0].value);
            }
        }

        const resultRes = await getRequest(path + queries.join('&'));
        if (resultRes && resultRes.data) {
            setData(resultRes.data);
        }

    }

    const getLocations = async () => {
        await getRegions();
    }

    const getRegions = async (regName?: string) => {
        let path = '/reports/locations?type=region';
        const regRes = await getRequest(path);
        if (regRes && regRes.data) {
            setRegions(regRes.data);
        }
    }

    const getProvinces = async (regName?: string) => {
        let path = '/reports/locations?type=province';
        if (regName) path += '&regName=' + regName;
        const provRes = await getRequest(path);
        if (provRes && provRes.data) {
            setProvinces(provRes.data);
        }
    }

    const getMunicipalities = async (prvName?: string) => {
        let path = '/reports/locations?type=city';
        if (selectedRegion) path += '&regName=' + selectedRegion;
        if (prvName) path += `&prvName=${prvName}`;

        const munRes = await getRequest(path);
        if (munRes && munRes.data) {
            setCityMuns(munRes.data);
        }
    }

    async function handleSelect(e: any) {

        if (e.target.name === "selectedRegion") {
            if (e.target.name !== selectedRegion) {
                setSelectedRegion(e.target.value);
                setSelectedProvince("");
                setSelectedCityMuns("");
                setCityMuns([]);
                setLoading(true);
                await getProvinces(e.target.value);
                setLoading(false);
            }

        } else if (e.target.name === "selectedProvince") {
            if (e.target.name !== selectedProvince) {
                setSelectedProvince(e.target.value);
                setSelectedCityMuns("");
                setLoading(true);
                await getMunicipalities(e.target.value);
                setLoading(false);
            }

        } else if (e.target.name === "selectedCityMuns") {
            if (e.target.value !== "") {
                setSelectedCityMuns(e.target.value);
                setLoading(true);
                setLoading(false);
            }
        }
    }

    const handleFilter = async (e: any) => {
        await getReports();
    }

    const handleClear = async (e: any) => {
        setSelectedRegion("");
        setSelectedProvince("");
        setSelectedCityMuns("");
        setProvinces([]);
        setCityMuns([]);
    }

    return (
        <div key={'local-election'}>
            {loading && <Loader />}
            <span className="flex text-sm font-medium text-gray-500">ER Summary</span>
            <div className="mt-4 mb-4 grid gap-5 md:grid-cols-4">
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
                {selectedRegion && <div className="">
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
                </div>}
                {selectedProvince && <div className="">
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
                </div>}
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

            {data && data.length > 0 &&
                <div className="flex flex-col">

                    {/* Table */}
                    <div className="shadow overflow-auto">
                        <table className="min-w-full shadow-md rounded-lg">
                            <thead className="bg-gray-100">
                                <tr>
                                    {(data && data[0].regName) && <th key="selectedRegion"
                                        scope="col"
                                        className="cursor-pointer text-sm font-medium text-gray-900 px-4 py-4"
                                    >
                                        <b className='flex'>
                                            Region
                                        </b>
                                    </th>}
                                    {(data && data[0].prvName) && <th key="selectedProvince"
                                        scope="col"
                                        className="cursor-pointer text-sm font-medium text-gray-900 px-4 py-4 text-left"
                                    >
                                        <b className='flex'>
                                            Province
                                        </b>
                                    </th>}
                                    {(data && data[0].munName) && <th key="selectedCityMuns"
                                        scope="col"
                                        className="cursor-pointer text-sm font-medium text-gray-900 px-4 py-4 text-left"
                                    >
                                        <b className='flex'>
                                            City/Municipality
                                        </b>
                                    </th>}
                                    {(data && data[0].brgyName) && <th key="selectedCityMuns"
                                        scope="col"
                                        className="cursor-pointer text-sm font-medium text-gray-900 px-4 py-4 text-left"
                                    >
                                        <b className='flex'>
                                            Barangay
                                        </b>
                                    </th>}
                                    <th key="totalAcms"
                                        scope="col"
                                        className="cursor-pointer text-sm font-medium text-gray-900 px-4 py-4 text-left"
                                    >
                                        <b className='flex'>
                                            Total ACMs
                                        </b>
                                    </th>
                                    <th key="totalVoters"
                                        scope="col"
                                        className="cursor-pointer text-sm font-medium text-gray-900 px-4 py-4 text-left"
                                    >
                                        <b className='flex'>
                                            Total Voters
                                        </b>
                                    </th>
                                    <th key="totalVotes"
                                        scope="col"
                                        className="cursor-pointer text-sm font-medium text-gray-900 px-4 py-4 text-left"
                                    >
                                        <b className='flex'>
                                            Total Votes
                                        </b>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row: any, idx: number) => (
                                    <tr key={idx} className="bg-white border-b text-left">
                                        {(row.regName) && <th key={`selectedProvince-${idx}`}
                                            scope="col"
                                            className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900"
                                        >
                                            {row.regName}
                                        </th>}
                                        {(row.prvName) && <th key={`selectedProvince-${idx}`}
                                            scope="col"
                                            className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900"
                                        >
                                            {row.prvName}
                                        </th>}
                                        {(row.munName) && <th key={`selectedCityMuns-${idx}`}
                                            scope="col"
                                            className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900"
                                        >
                                            {row.munName}
                                        </th>}
                                        {(row.brgyName) && <th key={`selectedCityMuns-${idx}`}
                                            scope="col"
                                            className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900"
                                        >
                                            {row.brgyName}
                                        </th>}
                                        <th key={`totalAcms-${idx}`}
                                            scope="col"
                                            className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900"
                                        >
                                            {formatNumber(row.totalAcms)}
                                        </th>
                                        <th key={`totalVoters-${idx}`}
                                            scope="col"
                                            className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900"
                                        >
                                            {formatNumber(row.totalVoters)}
                                        </th>
                                        <th key={`totalVotes-${idx}`}
                                            scope="col"
                                            className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900"
                                        >
                                            {formatNumber(row.totalVotes)}
                                        </th>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            }
            {(!data || data.length === 0) && <EmptyCard>
                <div className="place-self-center">
                    <p className="">
                        No data
                    </p>
                </div>
            </EmptyCard>}

        </div>
    );
}
