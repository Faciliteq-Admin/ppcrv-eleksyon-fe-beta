import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import jsonData from '../../../mockdata/userAccounts.json';
import TableCheckbox from "../../../components/TableCheckbox";
import Loader from "../../../components/Loader";
import { getRequest } from "../../../utils/apiHelpers";
import EmptyCard from "../../../components/EmptyCard";
import { formatDateString } from "../../../utils/functions";

export default function UserAccountListPage(props: any) {
    const navigate = useNavigate();

    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {

        let mounted = false;
        const getData = async () => {
            setLoading(true);
            let response = await getRequest('/users');
            if (response && response.data) {
                if (response.data.length > 0) {
                    const d = response.data.map((u: any) => {
                        return {
                            ...u, fullName: [u.firstName, u.middleName, u.lastName].join(' ')
                        }
                    })
                    if (!mounted) setData(d);
                }
            }
            setLoading(false);
        }
        getData();

        return () => {
            mounted = true;
        };
    }, []);

    const tColumns = [
        {
            header: 'User ID',
            accessorKey: 'userId',
            cell: (info: any) => `${info ?? 'N/A'}`,
            sort: true,
        },
        {
            header: 'Full name',
            accessorKey: 'fullName',
            cell: (info: any) => info,
            sort: false,
        },
        {
            header: 'Email',
            accessorKey: 'email',
            cell: (info: any) => `${info ?? 'N/A'}`,
            sort: false,
        },
        {
            header: 'Mobile',
            accessorKey: 'mobile',
            cell: (info: any) => `${info ?? 'N/A'}`,
            sort: false,
        },
        {
            header: 'Role',
            accessorKey: 'role',
            cell: (info: any) => `${info ?? 'N/A'}`,
            sort: false,
        },
        // {
        //     header: 'Status',
        //     accessorKey: 'status',
        //     cell: (info: any) => {
        //         let color = 'bg-gray-200 text-gray-600';
        //         switch(info.toLowerCase()) {
        //             case 'ongoing': 
        //                 color = 'bg-blue-200 text-blue-600'; break;
        //             case 'resolved': 
        //                 color = 'bg-green-200 text-green-600'; break;
        //             case 'rejected': 
        //                 color = 'bg-red-200 text-red-600'; break;
        //         };
        //         console.log({color, info});
                
        //         return <p className={`px-2 py-0.5 inline-flex text-sm rounded-full ${color}`}>{info}</p>;
        //     },
        //     sort: true,
        // },
        {
            header: 'Date Created',
            accessorKey: 'createdAt',
            cell: (info: any) => `${info ? formatDateString(info, 'MMM DD, YYYY') || '' : ''}`,
            sort: false,
        },
        // {
        //     header: 'Actions',
        //     accessorKey: null,
        //     cell: (info: any) => {
        //         if ((data as any[])[info].status.toLowerCase() === "pending") {
        //             return <span className="space-x-4">
        //                 <a className="text-blue-500" onClick={(e)=> handleView(e, info)}>View</a>
        //                 <a className="text-red-500" onClick={(e)=> handleReject(e, info)}>Reject</a>
        //             </span>
        //         } else {
        //             return <span className="">
        //                 <a className="text-blue-500" onClick={(e)=> handleView(e, info)}>View</a>
        //             </span>
        //         }
        //     }
        // }
    ];

    const handleView = (e:any, index: any) => {
        console.log({ e, index });

        // navigate(`/citizen-reports/${(data as any[] )[index].code}`, { state: data[index] });
    }

    const handleReject = (e:any, index: any) => {
        console.log({ e, index });
    }

    const handleAddNew = () => {
        // navigate('/citizen-reports/new');
    }

    return (
        <div>
            {loading && <Loader />}
            <span className="text-sm font-medium">User Accounts</span>
            {data && data.length > 0 && <TableCheckbox data={data} columns={tColumns} showActionButton={false} handleAdd={handleAddNew} />}
            {!data || data.length === 0 && <EmptyCard><p className="text-center">No data</p></EmptyCard>}
        </div>
    );
}

function loadData() {    
    return jsonData;
}

export async function loader() {    
    return {
        userAccountListData: loadData(),
    };
}
