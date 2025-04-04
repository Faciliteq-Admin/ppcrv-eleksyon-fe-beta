import { useLoaderData, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Loader from "../../../components/Loader";
import { getRequest } from "../../../utils/apiHelpers";
import EmptyCard from "../../../components/EmptyCard";
import TableCheckbox from "../../../components/TableCheckbox";
import moment from "moment";

export default function ResultListPage(props: any) {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any>();
    const [batchCount, setBatchCount] = useState(0);
    const [selectedBatch, setSelectedBatch] = useState(0);
    let processing = false;

    useEffect(() => {

        let mounted = false;
        getData();

        return () => {
            mounted = true;
        };
    }, []);

    const getData = async (batchNum?: number) => {
        if (processing) return;

        processing = true;
        setLoading(true);
        let path = '/results';
        if (batchNum) path += '?uploadBatchNum=' + batchNum;
        const res = await getRequest(path);
        if (res && res.data && res.data) {
            setResults(res.data.items);
            setBatchCount(res.data.totalBatch);
            setSelectedBatch(res.data.totalBatch);
        }
        setLoading(false);
        processing = false;
    }

    const tColumns = [
        {
            header: 'Batch',
            accessorKey: 'uploadBatchNum',
            cell: (info: any) => `${info ?? 'N/A'}`,
            sort: false,
        },
        {
            header: 'Precinct Code',
            accessorKey: 'precinctCode',
            cell: (info: any) => `${info ?? 'N/A'}`,
            sort: false,
        },
        {
            header: 'Candidate Name',
            accessorKey: 'candidateName',
            cell: (info: any) => `${info ?? 'N/A'}`,
            sort: true,
        },
        {
            header: 'Contest',
            accessorKey: 'contestName',
            cell: (info: any) => `${info ?? 'N/A'}`,
            sort: true,
        },
        {
            header: 'Registered Voters',
            accessorKey: 'numberVoters',
            cell: (info: any) => `${info ?? 'N/A'}`,
            sort: true,
        },
        {
            header: 'Total Votes',
            accessorKey: 'votesAmount',
            cell: (info: any) => `${info ?? 'N/A'}`,
            sort: true,
        },
        {
            header: 'Under Votes',
            accessorKey: 'underVotes',
            cell: (info: any) => `${info ?? 'N/A'}`,
            sort: true,
        },
        {
            header: 'Over Votes',
            accessorKey: 'overVotes',
            cell: (info: any) => `${info ?? 'N/A'}`,
            sort: true,
        },
        {
            header: 'Reception Date',
            accessorKey: 'receptionDate',
            cell: (info: any) => `${moment(info).format('YYYY-MM-DD HH:mm:ss') ?? 'N/A'}`,
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
        // navigate(`/precints/${(results as any[])[index].id}`, { state: results[index] });
    }

    const handleSelect = async (e: any) => {
        console.log(e.target.value);
        setSelectedBatch(+e.target.value);
        await getData(+e.target.value);

    }

    return (
        <div>
            {loading && <Loader />}
            <span className="text-sm font-medium">Results</span>
            {batchCount > 0 && <div className="">
                <label htmlFor="uploadBatchNum" className="mt-6 block text-sm/6 font-medium text-gray-900">
                    Upload Batch Number
                </label>
                <div className="mt-1">
                    <select
                        id="uploadBatchNum"
                        name="uploadBatchNum"
                        value={selectedBatch}
                        onChange={handleSelect}
                        autoComplete="reported-area"
                        className="px-2 py-2 w-full border border-gray-300 rounded-md text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                    // className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6"
                    >
                        {(new Array(batchCount).fill(0).map((_, idx) => idx + 1)).reverse().map((m, index) => <option key={index}>{m}</option>)}
                    </select>
                </div>
            </div>}
            {results && results.length > 0 && <TableCheckbox data={results} columns={tColumns} showActionButton={false} handleAdd={null} />}

            {!results || results.length === 0 && <EmptyCard>
                <div className="place-self-center">
                    <p className="">
                        No data
                    </p>
                </div>
            </EmptyCard>}
        </div>
    );
}