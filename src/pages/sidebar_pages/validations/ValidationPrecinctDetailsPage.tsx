import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../../../components/Loader";
import EmptyCard from "../../../components/EmptyCard";
import { ChevronLeftIcon, ChevronRightIcon, FlagIcon } from "@heroicons/react/20/solid";
import { getRequest, putRequest } from "../../../utils/apiHelpers";
import { awaitTimeout, getActiveBatchNumber, getUserSession } from "../../../utils/functions";
import TableCheckbox from "../../../components/TableCheckbox";
import ActionButton from "../../../components/ActionButton";
import ModalDialog from "../../../components/ModalDialog";
import Alert from "../../../components/Alert";

export default function ValidationPrecinctDetailsPage(props: any) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [prvLoading, setPrvLoading] = useState(false);
    const [munLoading, setMunLoading] = useState(false);
    const [senators, setSenators] = useState<any>();
    const [partyLists, setPartyLists] = useState<any>();
    const [provContest, setProvContest] = useState<any[]>([]);
    const [munContest, setMunContest] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [showSubmit, setShowSubmit] = useState(false);
    const [payload, setPayload] = useState<any>();

    const locationState = useLocation().state;

    let processing = false;

    const session = getUserSession();
    const user = session ? session.user : {};
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
        if (locationState.headerLabel === "For Validations") {
            setShowSubmit(true);
        }
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
                setProvContest(contRes);
                setPrvLoading(false);
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
                setMunContest(contRes)
            }
        }
        setMunLoading(false);
    }

    const handleBack = () => {
        if (user.role === "Administrator") {
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

        const precinctCode = locationState.precinctCode;
        let validatorType = 'firstValidator';
        let accessorKey = 'firstPassFlag';
        let withFlag = false;
        let data: any = [];

        if (locationState.headerLabel === 'For Validations') {

            if (user.role === "Final Validator") {
                validatorType = 'finalValidator';
                accessorKey = 'finalPassFlag';
            } else {
                if (locationState.firstValidator !== null) {
                    validatorType = 'secondValidator';
                    accessorKey = 'secondPassFlag';
                }
            }

            let senFlags: any = {
                contest: senators[0].contestName.replace(`OF PHILIPPINES`, '').trim(),
                contestCode: senators[0].contestCode,
                candidates: [],
            }
            for (const s of senators) {
                if (s[accessorKey]) {
                    withFlag = true;
                    senFlags.candidates.push({
                        candidateCode: s.candidateCode,
                        candidateName: s.candidateName,
                        [accessorKey]: s[accessorKey],
                    });
                }
            }

            let plFlags: any = {
                contest: partyLists[0].contestName.replace(`OF PHILIPPINES`, '').trim(),
                contestCode: partyLists[0].contestCode,
                candidates: [],
            }
            for (const pl of partyLists) {
                if (pl[accessorKey]) {
                    withFlag = true;
                    plFlags.candidates.push({
                        candidateCode: pl.candidateCode,
                        candidateName: pl.candidateName,
                        [accessorKey]: pl[accessorKey],
                    });
                }
            }

            data.push(senFlags);
            data.push(plFlags);

            for (const pc of provContest) {
                const contest = pc.contestName.replace(`PROVINCIAL`, '').replace(` OF ${locationState.prvName}`, '').trim();
                let provFlags: any = {
                    contest: contest,
                    contestCode: pc.contestCode,
                    candidates: [],
                }
                for (const cand of pc.candidates) {
                    if (cand[accessorKey]) {
                        withFlag = true;
                        provFlags.candidates.push({
                            candidateCode: cand.candidateCode,
                            candidateName: cand.candidateName,
                            [accessorKey]: cand[accessorKey],
                        });
                    }
                }
                data.push(provFlags);
            }

            for (const mc of munContest) {
                const contest = mc.contestName.replace(` OF ${locationState.prvName}`, '').replace(` - ${locationState.munName}`, '').trim();
                let munFlags: any = {
                    contest: contest,
                    contestCode: mc.contestCode,
                    candidates: [],
                }
                for (const cand of mc.candidates) {
                    if (cand[accessorKey]) {
                        withFlag = true;
                        munFlags.candidates.push({
                            candidateCode: cand.candidateCode,
                            candidateName: cand.candidateName,
                            [accessorKey]: cand[accessorKey],
                        });
                    }
                }
                data.push(munFlags);
            }

            setPayload({
                withFlag,
                accessorKey,
                precinctCode,
                validatorType,
                validator: user.id,
                validationData: data,
            });
            setIsOpen(true);
        }
    }

    const handleModalCancel = async () => {
        setIsOpen(false);
    }

    const handleModalSubmit = async (e: any) => {
        e.preventDefault();


        console.log(payload);

        if (processing) return;
        processing = true;
        setLoading(true);
        let response = await putRequest(`/qr/validation`, payload);
        processing = false;
        setLoading(false);

        if (response.data) {
            setShowSubmit(false);
            setIsOpen(false);
            addAlert("success", response.data.message, 1500);
            await awaitTimeout(2000);
            handleBack();
        } else {
            addAlert("error", "Unable to process validation", 1500);
        }
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
            header: 'Scanned Votes',
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
            header: 'Scanned Votes',
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

    const toggleFlag = (data: string, accessorKey: string, index1: number, index2: number) => {
        // console.log(data, accessorKey, index1, index2);

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
        } else if (data === 'prov') {
            const value = provContest[index1].candidates[index2][accessorKey];
            setProvContest((prev: any) =>
                prev.map((parent: any) =>
                    parent._id !== provContest[index1]._id
                        ? parent
                        : {
                            ...parent,
                            candidates: parent.candidates.map((child: any) =>
                                child._id !== provContest[index1].candidates[index2]._id
                                    ? child
                                    : {
                                        ...child,
                                        [accessorKey]: value ? false : true,
                                    }
                            )
                        }
                )
            );

        } else if (data === 'mun') {
            const value = munContest[index1].candidates[index2][accessorKey];
            setMunContest((prev: any) =>
                prev.map((parent: any) =>
                    parent._id !== munContest[index1]._id
                        ? parent
                        : {
                            ...parent,
                            candidates: parent.candidates.map((child: any) =>
                                child._id !== munContest[index1].candidates[index2]._id
                                    ? child
                                    : {
                                        ...child,
                                        [accessorKey]: value ? false : true,
                                    }
                            )
                        }
                )
            );
        }
    }

    if (user.role === "Administrator") {
        if (senColumns.length < 4) senColumns = [...senColumns, ...adminAdditionalColumns];
        if (plColumns.length < 4) plColumns = [...plColumns, ...adminAdditionalColumns];
    } else if (user.role === "Final Validator") {
        if (locationState.headerLabel === "For Validations") {
            const sencol = [{
                header: 'Status',
                accessorKey: 'rank',
                cell: (info: any) => {
                    if (senators && senators.length > 0) {
                        return <button onClick={() => toggleFlag('senators', 'finalPassFlag', info - 1, -1)}>
                            {senators[info - 1]['finalPassFlag'] && <FlagIcon className="size-4 text-red-600" />}
                            {!(senators[info - 1]['finalPassFlag']) && <FlagIcon className="size-4 text-gray-600" />}
                        </button>
                    } else {
                        return '';
                    }
                },
            }];
            const plcol = [{
                header: 'Status',
                accessorKey: 'rank',
                cell: (info: any) => {
                    if (partyLists && partyLists.length > 0) {
                        return <button onClick={() => toggleFlag('partylist', 'finalPassFlag', info - 1, -1)}>
                            {partyLists[info - 1]['finalPassFlag'] && <FlagIcon className="size-4 text-red-600" />}
                            {!(partyLists[info - 1]['finalPassFlag']) && <FlagIcon className="size-4 text-gray-600" />}
                        </button>
                    } else {
                        return '';
                    }
                },
            }];
            if (senColumns.length < 4) senColumns = [...senColumns, ...initialValidatorCols, ...sencol];
            if (plColumns.length < 4) plColumns = [...plColumns, ...initialValidatorCols, ...plcol];
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
                header: 'Status',
                accessorKey: 'rank',
                cell: (info: any) => {
                    if (senators && senators.length > 0) {
                        return <button onClick={() => toggleFlag('senators', accessorKey, info - 1, -1)}>
                            {senators[info - 1][accessorKey] && <FlagIcon className="size-4 text-red-600" />}
                            {!(senators[info - 1][accessorKey]) && <FlagIcon className="size-4 text-gray-600" />}
                        </button>
                    } else {
                        return '';
                    }
                },
            }];
            const plcol = [{
                header: 'Status',
                accessorKey: 'rank',
                cell: (info: any) => {
                    if (partyLists && partyLists.length > 0) {
                        return <button onClick={() => toggleFlag('partylist', accessorKey, info - 1, -1)}>
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
            content: <Accordion items={[
                provContest.length > 0 && {
                    title: "Provincial",
                    content: <div key={'provincial'} className="grid">
                        {provContest.map((c: any, idx: number) => {
                            let cColumns: any = [
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
                                    header: 'Scanned Votes',
                                    accessorKey: 'totalVotes',
                                    cell: (info: any) => `${info ?? 0}`,
                                },
                            ];

                            if (user.role === "Administrator") {
                                if (cColumns.length < 4) cColumns = [...cColumns, ...adminAdditionalColumns];
                            } else if (user.role === "Final Validator") {
                                if (locationState.headerLabel === "For Validations") {
                                    const addcol = [{
                                        header: 'Status',
                                        accessorKey: 'rank',
                                        cell: (info: any) => {
                                            if (provContest && provContest.length > 0) {
                                                return <button onClick={() => toggleFlag('prov', 'finalPassFlag', idx, info - 1)}>
                                                    {provContest[idx].candidates[info - 1]['finalPassFlag'] && <FlagIcon className="size-4 text-red-600" />}
                                                    {!(provContest[idx].candidates[info - 1]['finalPassFlag']) && <FlagIcon className="size-4 text-gray-600" />}
                                                </button>
                                            } else {
                                                return '';
                                            }
                                        },
                                    }];
                                    if (cColumns.length < 4) cColumns = [...cColumns, ...initialValidatorCols, ...addcol];
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
                                    if (cColumns.length < 4) cColumns = [...cColumns, ...initialValidatorCols, ...col];
                                }
                            } else {
                                if (locationState.headerLabel === "For Validations") {
                                    let accessorKey = 'firstPassFlag';
                                    if (locationState.firstValidator !== null) {
                                        accessorKey = 'secondPassFlag'
                                    }
                                    const addcol = [{
                                        header: 'Status',
                                        accessorKey: 'rank',
                                        cell: (info: any) => {
                                            if (provContest && provContest.length > 0) {
                                                return <button onClick={() => toggleFlag('prov', accessorKey, idx, info - 1)}>
                                                    {provContest[idx].candidates[info - 1][accessorKey] && <FlagIcon className="size-4 text-red-600" />}
                                                    {!(provContest[idx].candidates[info - 1][accessorKey]) && <FlagIcon className="size-4 text-gray-600" />}
                                                </button>
                                            } else {
                                                return '';
                                            }
                                        },
                                    }];
                                    if (cColumns.length < 4) cColumns = [...cColumns, ...addcol];
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
                                    if (cColumns.length < 4) cColumns = [...cColumns, ...col];
                                }
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
                munContest.length > 0 && {
                    title: "City / Municipal",
                    content: <div key={'citymun'} className="grid">
                        {munContest.map((c: any, idx: number) => {
                            let cColumns: any = [
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
                                    header: 'Scanned Votes',
                                    accessorKey: 'totalVotes',
                                    cell: (info: any) => `${info ?? 0}`,
                                },
                            ];
                            if (user.role === "Administrator") {
                                if (cColumns.length < 4) cColumns = [...cColumns, ...adminAdditionalColumns];
                            } else if (user.role === "Final Validator") {
                                if (locationState.headerLabel === "For Validations") {
                                    const addcol = [{
                                        header: 'Status',
                                        accessorKey: 'rank',
                                        cell: (info: any) => {
                                            if (munContest && munContest.length > 0) {
                                                return <button onClick={() => toggleFlag('mun', 'finalPassFlag', idx, info - 1)}>
                                                    {munContest[idx].candidates[info - 1]['finalPassFlag'] && <FlagIcon className="size-4 text-red-600" />}
                                                    {!(munContest[idx].candidates[info - 1]['finalPassFlag']) && <FlagIcon className="size-4 text-gray-600" />}
                                                </button>
                                            } else {
                                                return '';
                                            }
                                        },
                                    }];
                                    if (cColumns.length < 4) cColumns = [...cColumns, ...initialValidatorCols, ...addcol];
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
                                    if (cColumns.length < 4) cColumns = [...cColumns, ...initialValidatorCols, ...col];
                                }
                            } else {
                                if (locationState.headerLabel === "For Validations") {
                                    let accessorKey = 'firstPassFlag';
                                    if (locationState.firstValidator !== null) {
                                        accessorKey = 'secondPassFlag'
                                    }
                                    const addcol = [{
                                        header: 'Status',
                                        accessorKey: 'rank',
                                        cell: (info: any) => {
                                            if (munContest && munContest.length > 0) {
                                                return <button onClick={() => toggleFlag('mun', accessorKey, idx, info - 1)}>
                                                    {munContest[idx].candidates[info - 1][accessorKey] && <FlagIcon className="size-4 text-red-600" />}
                                                    {!(munContest[idx].candidates[info - 1][accessorKey]) && <FlagIcon className="size-4 text-gray-600" />}
                                                </button>
                                            } else {
                                                return '';
                                            }
                                        },
                                    }];
                                    if (cColumns.length < 4) cColumns = [...cColumns, ...addcol];
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
                                    if (cColumns.length < 4) cColumns = [...cColumns, ...col];
                                }
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
            ].filter(Boolean)} />,
        },
    ];

    const [alerts, setAlerts] = useState<any[]>([]);
    const addAlert = (type: "info" | "success" | "warning" | "error", message: string, duration: number) => {
        const id = Date.now();
        setAlerts((prev) => [...prev, { id, type, message, duration }]);
        console.log("add ", alerts);

    };

    const removeAlert = (id: any) => {
        console.log(id);
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));

    };

    return (
        <div>
            {(loading || prvLoading || munLoading) && <Loader />}
            <div className="fixed top-20 right-20">
                {alerts.map((alert) =>
                    <Alert
                        key={alert.id}
                        type={alert.type}
                        message={alert.message}
                        duration={alert.duration} // 3 seconds
                        onClose={() => removeAlert(alert.id)}
                    />
                )}
            </div>
            {isOpen && <ModalDialog
                title={"Submit Validation?"}
                description={"Are you sure you want to submit this validation?"}
                submitButtonTitle={"Proceed"}
                submitButtonBGColor={'blue'}
                isOpen={true}
                handleCancel={handleModalCancel}
                handleSubmit={handleModalSubmit}
            >
                <div className="grid overflow-y-auto">
                    {payload && payload.withFlag && <span className="mt-4 text-red-500 place-self-center">With Discrepancy</span>}
                    {payload && payload.validationData && <div>
                        {payload.validationData.map((d: any) => {
                            if (d.candidates.length > 0) {
                                return <div key={d.contest} className="mb-2 mt-2">
                                    <div className="font-semibold text-sm">{d.contest}</div>
                                    <div>
                                        {d.candidates.map((c: any) =>
                                            <p key={`${d.contest}-${c.candidateName}`} className="text-xs">{c.candidateName}</p>
                                        )}
                                    </div>
                                </div>
                            }
                        })}
                    </div>}
                </div>
            </ModalDialog>}
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
                <div className="gap-4 ml-4 lg:flex lg:gap-10">
                    <span className="flex gap-4">
                        <FlagIcon className="size-4 text-red-600" />
                        <>Mismatched</>
                    </span>
                    <span className="flex gap-4">
                        <FlagIcon className="size-4 text-green-600" />
                        <>Matched</>
                    </span>
                    {user.role === "Administrator" && <span className="flex gap-4">
                        <FlagIcon className="size-4 text-gray-400" />
                        <>Unvalidated</>
                    </span>}
                </div>
            </div>}
            <Accordion items={items} />
            {showSubmit && <div className="flex justify-between px-2 mt-4">
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

