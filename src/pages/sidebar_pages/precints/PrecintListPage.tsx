import { useLoaderData, useNavigate } from "react-router-dom";
import TableCheckbox from "../../../components/TableCheckbox";
import { useEffect, useMemo, useState } from "react";
import Loader from "../../../components/Loader";
import { getRequest } from "../../../utils/apiHelpers";
import EmptyCard from "../../../components/EmptyCard";
import { toDate } from "../../../utils/functions";

export default function PrecintListPage(props: any) {
    const navigate = useNavigate();

    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [totaPrecincts, setTotalPrecincts] = useState(0);
    let processing = false;

    useEffect(() => {

        let mounted = false;
        getData();

        return () => {
            mounted = true;
        };
    }, []);

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
        {
            header: 'Actions',
            accessorKey: null,
            cell: (info: any) => {
                return <span className="">
                    <a className="text-blue-500" onClick={(e) => handleView(e, info)}>View</a>
                </span>
            }
        }
    ];


    const getData = async () => {
        if (processing) return;

        processing = true;
        setLoading(true);
        let response = await getRequest('/precints');
        console.log(response.data);
        if (response && response.data) {

            setData(response.data.items);
            setTotalPrecincts(response.data.total);
        }
        setLoading(false);
        processing = false;
    }

    const handleView = (e: any, index: any) => {
        navigate(`/precints/${(data as any[])[index].id}`, { state: data[index] });
    }

    const handleAddNew = () => {
        navigate('/precints/new');
    }

    return (
        <div>
            {loading && <Loader />}
            <span className="text-sm font-medium">Precints</span>
            <div className="text-sm font-medium mt-6">Total Precints: {totaPrecincts}</div>
            {data && data.length > 0 && <TableCheckbox data={data} columns={tColumns} showActionButton={true} handleAdd={handleAddNew} />}
            {!data || data.length === 0 && <EmptyCard>
                <div className="place-self-center">
                    <p className="">
                        No data
                    </p>
                    <button
                        onClick={handleAddNew}
                        className={`px-4 py-2 mt-4 bg-green-700 text-white rounded-md self-center`}
                    >
                        Add
                    </button>
                </div>
            </EmptyCard>}
        </div>
    );
}