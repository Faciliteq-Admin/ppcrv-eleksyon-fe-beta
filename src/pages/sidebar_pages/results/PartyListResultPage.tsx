import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../../../components/Loader";
import EmptyCard from "../../../components/EmptyCard";
import { formatNumber } from "../../../utils/functions";
import { getRequest } from "../../../utils/apiHelpers";
import TableCheckbox from "../../../components/TableCheckbox";

export default function PartyListResultPage(props: any) {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any[]>([]);
    let processing = false;

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        if (processing) return;

        let path = '/partylists';
        if (search) path += `?candidate_name=${search}`;

        processing = true;
        setLoading(true);

        let senatorContestRes = await getRequest(path);
        if (senatorContestRes.data) {
            const c = senatorContestRes.data.items.map((s: any, idx: number) => {
                return { rank: idx + 1, ...s }
            });
            setData(c);
            console.log(c);
        }

        setLoading(false);
        processing = false;
    }

    const tColumns = [
        {
            header: 'Rank',
            accessorKey: 'rank',
            cell: (info: any) => `${info}`,
        },
        {
            header: 'Candidate Name',
            accessorKey: 'rank',
            cell: (info: any) => info ?
                <div key={info} className="flex flex-row justify-between items-center">
                    <div className="flex flex-row items-center gap-2 m-1">
                        <div className="p-1 size-7 bg-slate-700 rounded-full">
                            <p className="text-sm font-medium text-center text-white">{`${data.length > 0 ? data[info-1].totalization_order : ''}`}</p>
                        </div>
                        <p className="text-sm font-medium">{data.length > 0 ? data[info-1].candidate_name : ''}</p>
                        {/* <span className="text-sm font-medium">({party})</span> */}
                    </div>
                </div>
                : "",
        },
        {
            header: 'Total Votes',
            accessorKey: 'total_votes',
            cell: (info: any) => `${info ? formatNumber(info) : 'N/A'}`,
        },
    ];

    const handleFilter = async (e: any) => {
        await getData();
    }

    return (
        <div>
            {loading && <Loader />}
            <span className="text-sm font-medium">Results by Senators</span>
            <div className="mt-4 flex flex-col">
                <div className="flex gap-2 w-full lg:w-1/2">
                    <input
                        type="text"
                        placeholder="Candidate"
                        className="px-4 py-2 border border-gray-300 rounded-md w-full"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <button
                        onClick={handleFilter}
                        className="px-4 py-2 bg-blue-300 rounded-md hover:bg-gray-400 disabled:opacity-50 self-end"
                    >
                        Filter
                    </button>
                </div>
                <div className="grid gap-2 my-2 lg:flex lg:justify-between py-1">
                    <p className="self-end">Total: {data.length}</p>
                </div>
                {data && data.length > 0 && <TableCheckbox data={data} columns={tColumns} showActionButton={true} handleAdd={() => { }} />}
                {!data || data.length === 0 && <EmptyCard>
                    <div className="place-self-center">
                        <p className="">
                            No data
                        </p>
                    </div>
                </EmptyCard>}
            </div>
        </div>
    );
}