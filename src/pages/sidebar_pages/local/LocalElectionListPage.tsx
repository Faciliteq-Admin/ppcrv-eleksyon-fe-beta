import { useLoaderData, useNavigate } from "react-router-dom";
import TableCheckbox from "../../../components/TableCheckbox";
import { useEffect, useMemo, useState } from "react";
import Loader from "../../../components/Loader";
import { getRequest } from "../../../utils/apiHelpers";
import EmptyCard from "../../../components/EmptyCard";
import { toDate } from "../../../utils/functions";

export default function LocalElectionListPage(props: any) {
    const navigate = useNavigate();

    const [provincialContest, setProvincialContest] = useState<any[]>([]);
    const [municipalContest, setMunicipalContest] = useState<any[]>([]);
    const [regions, setRegions] = useState<any[]>([]);
    const [provinces, setProvinces] = useState<any[]>([]);
    const [cityMuns, setCityMuns] = useState<any[]>([]);
    const [barangays, setBarangays] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState("CORDILLERA ADMINISTRATIVE REGION");
    const [selectedProvince, setSelectedProvince] = useState("ABRA");
    const [selectedCityMuns, setSelectedCityMuns] = useState("");
    const [selectedBarangay, setSelectedBarangay] = useState("");
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
        await getProvincialContestsAndCandidates(selectedProvince);

        setLoading(false);
        processing = false;
    }

    const getProvincialContestsAndCandidates = async (selectedProvince?: string) => {
        let path = '/contests?contestType=local';
        if (selectedRegion) {
            path += `&regName=${selectedRegion}`;
        }
        if (selectedProvince) {
            if (selectedProvince.toLowerCase().includes("national capital region")) return;
            path += `&prvName=${selectedProvince}`;

            const contestsRes = await getRequest(path);
            if (contestsRes && contestsRes.data) {
                if (contestsRes.data.length > 0) {
                    let contRes = [];
                    for (const c of contestsRes.data) {
                        const res = await getRequest(`/candidates?contestCode=${c.contestCode}`);
                        if (res.data) {
                            c.candidates = res.data.items;
                            contRes.push(c);
                        }
                    }

                    setProvincialContest(contRes)
                } else {
                    setProvincialContest([]);
                }
            }
        }


    }

    const getMunicipalContestsAndCandidates = async (selectedCityMuns?: string) => {
        let path = '/contests?contestType=local';
        if (selectedRegion) {
            path += `&regName=${selectedRegion}`;
        }
        if (selectedProvince) {
            if (selectedProvince.toLowerCase().includes("national capital region")) {
                path += `&prvName=NCR`;
            } else {
                path += `&prvName=${selectedProvince}`;
            }
        }
        if (selectedCityMuns) {
            path += `&munName=${selectedCityMuns}`;

            const contestsRes = await getRequest(path);
            if (contestsRes && contestsRes.data) {
                if (contestsRes.data.length > 0) {
                    let contRes = [];
                    for (const c of contestsRes.data) {
                        const res = await getRequest(`/candidates?contestCode=${c.contestCode}`);
                        if (res.data) {
                            c.candidates = res.data.items;
                            contRes.push(c);
                        }
                    }

                    setMunicipalContest(contRes)
                } else {
                    setMunicipalContest([]);
                }
            }
        }
    }

    const getLocations = async () => {
        await getRegions();
        await getProvinces(selectedRegion);
        await getMunicipalities(selectedProvince);
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
        if (prvName) path += `&prvName=${prvName}`;

        const munRes = await getRequest(path);
        if (munRes && munRes.data) {
            setCityMuns(munRes.data);
        }
    }

    const getBarangays = async (prvName?: string, munName?: string) => {
        let path = '/reports/locations?type=barangay';
        if (prvName) path += `&prvName=${prvName}`;
        if (munName) path += `&munName=${munName}`;

        const brgyRes = await getRequest(path);
        if (brgyRes && brgyRes.data) {
            setBarangays(brgyRes.data);
        }
    }

    const handleView = (e: any, index: any) => {
        // navigate(`/precints/${(data as any[])[index].id}`, { state: data[index] });
    }

    const handleAddNew = () => {
        navigate('/precints/new');
    }

    async function handleSelect(e: any) {

        if (e.target.name === "selectedRegion") {
            if (e.target.name !== selectedRegion) {
                setSelectedRegion(e.target.value);
                setSelectedProvince("");
                setSelectedCityMuns("");
                setSelectedBarangay("");
                setCityMuns([]);
                setLoading(true);
                await getProvincialContestsAndCandidates(e.target.value);
                await getProvinces(e.target.value);
                setLoading(false);
            }

        } else if (e.target.name === "selectedProvince") {
            if (e.target.name !== selectedProvince) {
                setSelectedProvince(e.target.value);
                setProvincialContest([]);
                setMunicipalContest([]);
                setSelectedCityMuns("");
                setSelectedBarangay("");
                setLoading(true);
                await getProvincialContestsAndCandidates(e.target.value);
                await getMunicipalities(e.target.value);
                setLoading(false);
            }

        } else if (e.target.name === "selectedCityMuns") {
            if (e.target.value !== "") {
                setMunicipalContest([]);
                setSelectedCityMuns(e.target.value);
                setSelectedBarangay("");
                setLoading(true);
                await getMunicipalContestsAndCandidates(e.target.value);
                setLoading(false);
            } else {
                setMunicipalContest([]);
            }
        }
    }

    return (
        <div key={'local-election'}>
            {loading && <Loader />}
            <span className="text-sm font-medium">Local Elections</span>
            <div className="grid gap-5 md:grid-cols-4">
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
                {/* {barangays && barangays.length > 0 && <div className="">
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
                </div>} */}
            </div>

            {municipalContest && municipalContest.length > 0 && municipalContest.map((c: any, idx: number) => (
                <EmptyCard key={`${idx}-${c.contestName}`}>
                    <div className="mb-4">
                        <p className="text-sm font-medium">{c.contestName}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
                        {c.candidates && (c.candidates as any[]).map((s: any, idx: number) => {
                            const cand = s.candidateName.split('(');
                            const name = cand[0];
                            // const party = cand[1].replace(')', '');
                            return (
                                <div key={idx} className="flex flex-row justify-between items-center">
                                    <div className="flex flex-row items-center gap-2 m-1">
                                        <div className="p-1 size-7 bg-slate-700 rounded-full">
                                            <p className="text-sm font-medium text-center text-white">{`${s.totalizationOrder}`}</p>
                                        </div>
                                        <p className="text-sm font-medium capitalize">{name.toLowerCase()}</p>
                                        {/* <span className="text-sm font-medium">({party})</span> */}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </EmptyCard>
            ))}

            {municipalContest.length > 0 && provincialContest.length > 0 && <hr className="h-px my-8 bg-gray-200 border-2 dark:bg-gray-700" />}

            {provincialContest && provincialContest.length > 0 && provincialContest.map((c: any, idx: number) => (
                <EmptyCard key={`${idx}-${c.contestName}`}>
                    <div className="mb-4">
                        <p className="text-sm font-medium">{c.contestName}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
                        {c.candidates && (c.candidates as any[]).map((s: any, idx: number) => {
                            const cand = s.candidateName.split('(');
                            const name = cand[0];
                            // const party = cand[1].replace(')', '');
                            return (
                                <div key={idx} className="flex flex-row justify-between items-center">
                                    <div className="flex flex-row items-center gap-2 m-1">
                                        <div className="p-1 size-7 bg-slate-700 rounded-full">
                                            <p className="text-sm font-medium text-center text-white">{`${s.totalizationOrder}`}</p>
                                        </div>
                                        <p className="text-sm font-medium capitalize">{name.toLowerCase()}</p>
                                        {/* <span className="text-sm font-medium">({party})</span> */}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </EmptyCard>
            ))}

        </div>
    );
}