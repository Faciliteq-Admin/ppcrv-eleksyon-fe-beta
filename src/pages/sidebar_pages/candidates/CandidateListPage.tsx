import { useLoaderData, useNavigate } from "react-router-dom";
import TableCheckbox from "../../../components/TableCheckbox";
import { useEffect, useMemo, useState } from "react";
import Loader from "../../../components/Loader";
import { getRequest } from "../../../utils/apiHelpers";
import EmptyCard from "../../../components/EmptyCard";
import { toDate } from "../../../utils/functions";

export default function CandidateListPage(props: any) {
    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
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
            header: 'Candidate Name',
            accessorKey: 'candidateName',
            cell: (info: any) => `${info ?? 'N/A'}`,
            sort: true,
        },
        {
            header: 'Candidate Code',
            accessorKey: 'candidateCode',
            cell: (info: any) => `${info ?? 'N/A'}`,
            sort: true,
        },
        {
            header: 'Contest Code',
            accessorKey: 'contestCode',
            cell: (info: any) => `${info ?? 'N/A'}`,
            sort: true,
        },
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
        let response = await getRequest('/candidates');
        console.log(response.data);
        if (response && response.data) {
            
            setData(response.data.items);
        }
        setLoading(false);
        processing = false;
    }

    const handleView = (e: any, index: any) => {
        navigate(`/candidates/${(data as any[])[index].id}`, { state: data[index] });
    }

    const handleAddNew = () => {
        navigate('/candidates/new');
    }

    return (
        <div>
            {loading && <Loader />}
            <span className="text-sm font-medium">Candidates</span>
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