import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../../../components/Loader";
import EmptyCard from "../../../components/EmptyCard";
import { ChevronLeftIcon, ChevronRightIcon, FlagIcon } from "@heroicons/react/20/solid";
import { getRequest } from "../../../utils/apiHelpers";
import { awaitTimeout, getActiveBatchNumber, getUserSession } from "../../../utils/functions";
import TableCheckbox from "../../../components/TableCheckbox";
import ActionButton from "../../../components/ActionButton";

export default function ValidationPrecinctDetailsPage(props: any) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [prvLoading, setPrvLoading] = useState(false);
    const [munLoading, setMunLoading] = useState(false);
    const [senators, setSenators] = useState<any>();
    const [partyLists, setPartyLists] = useState<any>();
    const [localContent, setLocalContent] = useState<any[]>([]);

    const locationState = useLocation().state;

    let processing = false;

    const user = getUserSession().user;
    const adminAdditionalColumns = [
        {
            header: '1st Validation',
            accessorKey: 'firstPassFlag',
            cell: (info: any) => {
                switch (info) {
                    case true: return <FlagIcon className="size-4 text-red-600" />;
                    case false: return <FlagIcon className="size-4 text-green-600" />
                    default: return <FlagIcon className="size-4 text-gray-400" />;
                }
            },
        },
        {
            header: '2nd Validation',
            accessorKey: 'secondPassFlag',
            cell: (info: any) => {
                switch (info) {
                    case true: return <FlagIcon className="size-4 text-red-600" />;
                    case false: return <FlagIcon className="size-4 text-green-600" />
                    default: return <FlagIcon className="size-4 text-gray-400" />;
                }
            },
        },
        {
            header: 'Final Validation',
            accessorKey: 'finalPassFlag',
            cell: (info: any) => {
                switch (info) {
                    case true: return <FlagIcon className="size-4 text-red-600" />;
                    case false: return <FlagIcon className="size-4 text-green-600" />
                    default: return <FlagIcon className="size-4 text-gray-400" />;
                }
            },
        },
    ];

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        if (processing) return;

        processing = true;
        setLoading(true);
        let senatorContestRes = await getRequest('/contests?contestType=national&contestPosition=senator');
        if (senatorContestRes && senatorContestRes.data && senatorContestRes.data.length > 0) {

            let senatorRes = await getRequest(`/candidates/qr?contestCode=${senatorContestRes.data[0].contestCode}&precinctCode=${locationState.precinctCode}`);
            if (senatorRes.data) {
                const a = senatorRes.data.items.map((s: any, idx: number) => {
                    return { rank: idx + 1, ...s }
                });
                setSenators(a);
            }
        }

        let plContestRes = await getRequest('/contests?contestType=national&contestPosition=party list');
        if (plContestRes && plContestRes.data && plContestRes.data.length > 0) {
            let plRes = await getRequest(`/candidates/qr?contestCode=${plContestRes.data[0].contestCode}&precinctCode=${locationState.precinctCode}`);
            if (plRes.data) {
                const a = plRes.data.items.map((s: any, idx: number) => {
                    return { rank: idx + 1, ...s }
                });
                setPartyLists(a);
            }
        }

        getProvincialContestsAndCandidates(locationState.regName, locationState.prvName);
        getMunicipalContestsAndCandidates(locationState.regName, locationState.prvName, locationState.munName);

        setLoading(false);
        processing = false;
    }

    const getProvincialContestsAndCandidates = async (selectedRegion: string, selectedProvince: string) => {

        let path = '/contests?contestType=local';
        path += `&regName=${selectedRegion}`;
        if (selectedProvince.toLowerCase().includes("national capital region")) return;
        path += `&prvName=${selectedProvince}`;

        setPrvLoading(true);
        const contestsRes = await getRequest(path);
        if (contestsRes && contestsRes.data) {
            if (contestsRes.data.length > 0) {
                let contRes: any[] = [];
                for (const c of contestsRes.data) {
                    const res = await getRequest(`/candidates/qr?contestCode=${c.contestCode}&precinctCode=${locationState.precinctCode}`);
                    if (res.data) {
                        const a = res.data.items.map((s: any, idx: number) => {
                            return { rank: idx + 1, ...s }
                        });
                        c.candidates = a;
                        contRes.push(c);
                    }
                }

                setPrvLoading(false);
                if (localContent.length < 2) {
                    const exists = localContent.some((e: any) => e.title === 'Provincial');
                    if (!exists) {

                        await awaitTimeout(100);

                        setLocalContent(prev => [
                            {
                                title: "Provincial",
                                content: <div key={'provincial'} className="grid">
                                    {contRes.map((c: any, idx: number) => {
                                        let cColumns = [
                                            {
                                                header: 'Candidate',
                                                accessorKey: 'rank',
                                                cell: (info: any) => {
                                                    return <div className="flex flex-row items-center gap-2 m-1">
                                                        <div className="p-1 size-7 bg-slate-700 rounded-full">
                                                            <p className="text-sm font-medium text-center text-white">{`${c.candidates[info - 1].totalizationOrder}`}</p>
                                                        </div>
                                                        <p className="text-sm font-medium capitalize">{c.candidates[info - 1].candidateName}</p>
                                                    </div>
                                                },
                                            },
                                            {
                                                header: 'Total Votes',
                                                accessorKey: 'totalVotes',
                                                cell: (info: any) => `${info ?? 0}`,
                                            },
                                        ];

                                        if (user.role === "Administrator") {
                                            if (cColumns.length < 4) cColumns = [...cColumns, ...adminAdditionalColumns];
                                        }

                                        return <EmptyCard key={`prov-${idx}`}>
                                            <div>
                                                <p className="text-sm font-medium">{
                                                    c.contestName
                                                        .replace(`PROVINCIAL`, '')
                                                        .replace(`OF ${locationState.prvName}`, '')
                                                }</p>
                                            </div>
                                            <TableCheckbox data={c.candidates} columns={cColumns} rowsPerPage={12} showActionButton={false} />
                                        </EmptyCard>
                                    })}
                                </div>
                            },
                            ...prev,
                        ]);
                    }
                }
            }
        }

        setPrvLoading(false);
    }

    const getMunicipalContestsAndCandidates = async (selectedRegion: string, selectedProvince: string, selectedCityMuns: string) => {

        let path = '/contests?contestType=local';
        path += `&regName=${selectedRegion}`;
        if (selectedProvince.toLowerCase().includes("national capital region")) {
            path += `&prvName=NCR`;
        } else {
            path += `&prvName=${selectedProvince}`;
        }
        path += `&munName=${selectedCityMuns}`;

        setMunLoading(true);
        const contestsRes = await getRequest(path);
        if (contestsRes && contestsRes.data) {
            if (contestsRes.data.length > 0) {
                let contRes: any[] = [];
                for (const c of contestsRes.data) {
                    const res = await getRequest(`/candidates/qr?contestCode=${c.contestCode}&precinctCode=${locationState.precinctCode}`);
                    if (res.data) {
                        const a = res.data.items.map((s: any, idx: number) => {
                            return { rank: idx + 1, ...s }
                        });
                        c.candidates = a;
                        contRes.push(c);
                    }
                }

                setMunLoading(false);
                console.log(localContent.length);
                if (localContent.length < 2) {
                    const exists = localContent.some((e: any) => e.title === 'City / Municipal');
                    if (!exists) {

                        await awaitTimeout(200);

                        setLocalContent(prev => [
                            ...prev,
                            {
                                title: "City / Municipal",
                                content: <div key={'citymun'} className="grid">
                                    {contRes.map((c: any, idx: number) => {
                                        let cColumns = [
                                            {
                                                header: 'Candidate',
                                                accessorKey: 'rank',
                                                cell: (info: any) => {
                                                    return <div className="flex flex-row items-center gap-2 m-1">
                                                        <div className="p-1 size-7 bg-slate-700 rounded-full">
                                                            <p className="text-sm font-medium text-center text-white">{`${c.candidates[info - 1].totalizationOrder}`}</p>
                                                        </div>
                                                        <p className="text-sm font-medium capitalize">{c.candidates[info - 1].candidateName}</p>
                                                    </div>
                                                },
                                            },
                                            {
                                                header: 'Total Votes',
                                                accessorKey: 'totalVotes',
                                                cell: (info: any) => `${info ?? 0}`,
                                            },
                                        ];
                                        if (user.role === "Administrator") {
                                            if (cColumns.length < 4) cColumns = [...cColumns, ...adminAdditionalColumns];
                                        }
                                        return <EmptyCard key={`mun-${idx}`}>
                                            <div>
                                                <p className="text-sm font-medium">{
                                                    c.contestName
                                                        .replace(`OF ${locationState.prvName}`, '')
                                                        .replace(`- ${locationState.munName}`, '')
                                                }</p>
                                            </div>
                                            <TableCheckbox data={c.candidates} columns={cColumns} rowsPerPage={12} showActionButton={false} />
                                        </EmptyCard>
                                    })}
                                </div>
                            },
                        ]);

                        console.log("Municipality contests set");

                    }
                }
            }
        }
        setMunLoading(false);
    }

    const handleBack = () => {
        let session = getUserSession();
        console.log(session.user.role);

        if (session.user.role === "Administrator") {
            navigate('/validations/');
        } else {
            if (locationState.headerLabel === 'For Validations') {
                navigate('/validations/for-validations');
            } else {
                navigate('/validations/my-validations');
            }
        }
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
    }

    let senColumns: any = [
        {
            header: 'Candidate',
            accessorKey: 'rank',
            cell: (info: any) => {
                return <div className="flex flex-row items-center gap-2 m-1">
                    <div className="p-1 size-7 bg-slate-700 rounded-full">
                        <p className="text-sm font-medium text-center text-white">{`${senators[info - 1].totalizationOrder}`}</p>
                    </div>
                    <p className="text-sm font-medium capitalize">{senators[info - 1].candidateName}</p>
                </div>
            },
        },
        {
            header: 'Total Votes',
            accessorKey: 'totalVotes',
            cell: (info: any) => `${info ?? 0}`,
        },
    ];

    let plColumns: any = [
        {
            header: 'Candidate',
            accessorKey: 'rank',
            cell: (info: any) => {
                return <div className="flex flex-row items-center gap-2 m-1">
                    <div className="p-1 size-7 bg-slate-700 rounded-full">
                        <p className="text-sm font-medium text-center text-white">{`${partyLists[info - 1].totalizationOrder}`}</p>
                    </div>
                    <p className="text-sm font-medium capitalize">{partyLists[info - 1].candidateName}</p>
                </div>
            },
        },
        {
            header: 'Total Votes',
            accessorKey: 'totalVotes',
            cell: (info: any) => `${info ?? 0}`,
        },
    ];

    const initialValidatorCols = [
        {
            header: '1st Validation',
            accessorKey: 'firstPassFlag',
            cell: (info: any) => {
                switch (info) {
                    case true: return <FlagIcon className="size-4 text-red-600" />;
                    case false: return <FlagIcon className="size-4 text-green-600" />;
                    default: return <FlagIcon className="size-4 text-gray-400" />;
                }
            },
        },
        {
            header: '2nd Validation',
            accessorKey: 'secondPassFlag',
            cell: (info: any) => {
                switch (info) {
                    case true: return <FlagIcon className="size-4 text-red-600" />;
                    case false: return <FlagIcon className="size-4 text-green-600" />;
                    default: return <FlagIcon className="size-4 text-gray-400" />;
                }
            },
        },
    ];

    console.log({ senators });


    const toggleFlag = (data: string, accessorKey: string, index1: number, index2?: number) => {
        console.log(data, accessorKey, index1, index2);
        if (data === 'senators') {
            let arr = [...senators];
            const value = arr[index1][accessorKey];
            arr[index1][accessorKey] = value ? false : true;
            setSenators([...arr]);
        } else if (data === 'partylist') {
            let arr = [...partyLists];
            const value = arr[index1][accessorKey];
            arr[index1][accessorKey] = value ? false : true;
            setPartyLists([...arr]);
        } else {

        }
    }

    if (user.role === "Administrator") {
        if (senColumns.length < 4) senColumns = [...senColumns, ...adminAdditionalColumns];
        if (plColumns.length < 4) plColumns = [...plColumns, ...adminAdditionalColumns];
    } else if (user.role === "Final Validator") {
        if (locationState.headerLabel === "For Validations") {
            if (senColumns.length < 4) senColumns = [...senColumns, ...initialValidatorCols];
            if (plColumns.length < 4) plColumns = [...plColumns, ...initialValidatorCols];
        } else {
            const col = [{
                header: 'My Validation',
                accessorKey: 'finalPassFlag',
                cell: (info: any) => {
                    switch (info) {
                        case true: return <FlagIcon className="size-4 text-red-600" />;
                        case false: return <FlagIcon className="size-4 text-green-600" />;
                        default: return <FlagIcon className="size-4 text-gray-400" />;
                    }
                },
            }];
            if (senColumns.length < 4) senColumns = [...senColumns, ...initialValidatorCols, ...col];
            if (plColumns.length < 4) plColumns = [...plColumns, ...initialValidatorCols, ...col];
        }
    } else {
        if (locationState.headerLabel === "For Validations") {
            let accessorKey = 'firstPassFlag';
            if (locationState.firstValidator !== null) {
                accessorKey = 'secondPassFlag'
            }
            const sencol = [{
                header: 'For Validation',
                accessorKey: 'rank',
                cell: (info: any) => {
                    if (senators && senators.length > 0) {
                        return <button onClick={() => toggleFlag('senators', accessorKey, info - 1, undefined)}>
                            {senators[info - 1][accessorKey] && <FlagIcon className="size-4 text-red-600" />}
                            {!(senators[info - 1][accessorKey]) && <FlagIcon className="size-4 text-gray-600" />}
                        </button>
                    } else {
                        return '';
                    }
                },
            }];
            const plcol = [{
                header: 'For Validation',
                accessorKey: 'rank',
                cell: (info: any) => {
                    if (partyLists && partyLists.length > 0) {
                        return <button onClick={() => toggleFlag('partylist', accessorKey, info - 1, undefined)}>
                            {partyLists[info - 1][accessorKey] && <FlagIcon className="size-4 text-red-600" />}
                            {!(partyLists[info - 1][accessorKey]) && <FlagIcon className="size-4 text-gray-600" />}
                        </button>
                    } else {
                        return '';
                    }
                },
            }];

            if (senColumns.length < 4) senColumns = [...senColumns, ...sencol];
            if (plColumns.length < 4) plColumns = [...plColumns, ...plcol];
        } else {
            let accessorKey = 'firstPassFlag';
            if (locationState.firstValidator !== user.id) {
                accessorKey = 'secondPassFlag'
            }
            const col = [{
                header: 'My Validation',
                accessorKey: accessorKey,
                cell: (info: any) => {
                    switch (info) {
                        case true: return <FlagIcon className="size-4 text-red-600" />;
                        case false: return <FlagIcon className="size-4 text-green-600" />;
                        default: return <FlagIcon className="size-4 text-gray-400" />;
                    }
                },
            }];
            if (senColumns.length < 4) senColumns = [...senColumns, ...col];
            if (plColumns.length < 4) plColumns = [...plColumns, ...col];
        }
    }

    const items = [
        {
            title: "National Elections",
            content: <Accordion items={[
                {
                    title: "Senators",
                    content: <div className="grid">
                        {senators && <TableCheckbox data={senators} columns={senColumns} rowsPerPage={12} showActionButton={false} />}
                    </div>
                },
                {
                    title: "Party List",
                    content: <div className="grid">
                        {partyLists && <TableCheckbox data={partyLists} columns={plColumns} rowsPerPage={12} showActionButton={false} />}
                    </div>
                }
            ]} />,
        },
        {
            title: "Local Elections",
            content: <Accordion items={localContent} />,
        },
    ];

    return (
        <div>
            {(loading || prvLoading || munLoading) && <Loader />}
            <span className="flex text-sm font-medium text-gray-500">
                ER Validations <ChevronRightIcon className="size-4 self-center" />
                {locationState.headerLabel && <p className="flex">{locationState.headerLabel} <ChevronRightIcon className="size-4 self-center" /></p>}
                <p className="text-black">{locationState.precinctCode}</p>
            </span>
            <div className="mt-4 flex justify-between px-2">
                <div className="">
                    <button type="button" onClick={handleBack} className="flex text-sm/6 font-semibold text-gray-900">
                        <ChevronLeftIcon className="w-6 h-6" />
                        Back
                    </button>
                </div>
                <div className="flex items-center justify-end gap-x-3"></div>
            </div>
            <div className="px-2 mt-4 lg:mb-4 flex flex-col gap-2 lg:gap-4 lg:flex-row lg:items-center">
                <div className="">
                    <label htmlFor="selectedRegion" className="block text-sm/6 font-medium text-gray-900">
                        ACM ID
                    </label>
                    <div className="mt-1">
                        {locationState.precinctCode}
                    </div>
                </div>
                <div className="">
                    <label htmlFor="selectedRegion" className="block text-sm/6 font-medium text-gray-900">
                        Region
                    </label>
                    <div className="mt-1">
                        {locationState.regName}
                    </div>
                </div>
                <div className="">
                    <label htmlFor="selectedProvince" className="block text-sm/6 font-medium text-gray-900">
                        Province
                    </label>
                    <div className="mt-1">
                        {locationState.prvName}
                    </div>
                </div>
                <div className="">
                    <label htmlFor="selectedCityMuns" className="block text-sm/6 font-medium text-gray-900">
                        City/Municipality
                    </label>
                    <div className="mt-1">
                        {locationState.munName}
                    </div>
                </div>
                <div className="">
                    <label htmlFor="selectedBarangay" className="block text-sm/6 font-medium text-gray-900">
                        Barangay
                    </label>
                    <div className="mt-1">
                        {locationState.brgyName}
                    </div>
                </div>
            </div>

            {(!locationState.headerLabel || locationState.headerLabel !== "For Validations") && <div className="justify-between px-2 mt-4">
                <div className="">
                    Legend:
                </div>
                <div className="flex gap-4">
                    <span className="flex text-end">
                        <FlagIcon className="size-4 text-red-600" /> mismatched
                    </span>
                    <span className="flex">
                        <FlagIcon className="size-4 text-green-600" /> - matched
                    </span>
                    <span className="flex">
                        <FlagIcon className="size-4 text-gray-400" /> - unvalidated
                    </span>
                </div>
            </div>}
            <Accordion items={items} />
            {locationState.headerLabel === "For Validations" && <div className="flex justify-between px-2 mt-4">
                <div className="">
                </div>
                <div className="flex items-center justify-end gap-x-6">
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-green-500 rounded-md hover:bg-green-400 disabled:opacity-50 self-end text-white font-medium"
                    >
                        Submit Validation
                    </button>
                </div>
            </div>}
        </div>
    );
}


const AccordionItem = ({ title, content }: { title: string, content: any }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border rounded-xl mb-2">
            <button
                className="w-full flex justify-between items-center px-4 py-3 text-left font-medium focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{title}</span>
                <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    ▼
                </span>
            </button>
            {isOpen && (
                <div className="px-4 pb-4 text-sm text-gray-600">
                    {content}
                </div>
            )}
        </div>
    );
};

const Accordion = ({ items }: { items: any }) => {
    return (
        <div className="mt-2">
            {items.map((item: any, idx: number) => (
                <AccordionItem key={idx} title={item.title} content={item.content} />
            ))}
        </div>
    );
};

