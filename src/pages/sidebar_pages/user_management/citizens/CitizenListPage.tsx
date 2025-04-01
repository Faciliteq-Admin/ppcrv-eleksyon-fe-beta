import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../../../components/Loader";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import TableCheckbox from "../../../../components/TableCheckbox";
import EmptyCard from "../../../../components/EmptyCard";
import { getRequest } from "../../../../utils/apiHelpers";
import { toDate } from "../../../../utils/functions";

export default function CitizenListPage(props: any) {
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
            header: 'Name',
            accessorKey: 'fullName',
            cell: (info: any) => `${info ?? 'N/A'}`,
            sort: true,
        },
        {
            header: 'Created At',
            accessorKey: 'createdAt',
            cell: (info: any) => toDate(info).format("MM-DD-YYYY"),
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
        let response = await getRequest('/citizens');        
        if (response && response.data) {
            setData(response.data.items);
        }
        setLoading(false);
        processing = false;
    }

    const handleView = (e: any, index: any) => {
        navigate(`/user-management/citizens/${(data as any[])[index].id}`, { state: data[index] });
    }

    const handleAddNew = () => {
        navigate('/user-management/citizens/new');
    }

    return (
        <div>
            {loading && <Loader />}
            <span className="flex text-sm font-medium text-gray-500">User Management <ChevronRightIcon className="size-4 self-center" /> <p className="text-black">Citizens</p> </span>
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