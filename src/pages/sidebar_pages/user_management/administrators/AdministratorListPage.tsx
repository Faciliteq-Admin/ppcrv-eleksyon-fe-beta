import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRequest } from "../../../../utils/apiHelpers";
import { getUserSession, toDate } from "../../../../utils/functions";
import Loader from "../../../../components/Loader";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import TableCheckbox from "../../../../components/TableCheckbox";
import EmptyCard from "../../../../components/EmptyCard";

export default function AdministratorListPage(props: any) {
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
            header: 'Email',
            accessorKey: 'email',
            cell: (info: any) => `${info ?? 'N/A'}`,
            sort: true,
        },
        {
            header: 'Mobile Number',
            accessorKey: 'mobile',
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

        let lguId = '';
        let session = getUserSession();
        if (session && session.user && session.user.lguId) {
            lguId = `?lguId=${session.user.lguId}`;
        }
        processing = true;
        setLoading(true);
        let response = await getRequest('/administrators' + lguId );
        if (response && response.data) {
            setData(response.data.items);
        }
        setLoading(false);
        processing = false;
    }

    const handleView = (e: any, index: any) => {
        // console.log({ e, index });

        navigate(`/user-management/administrators/${(data as any[])[index].id}`, { state: data[index] });
    }

    const handleReject = (e: any, index: any) => {
        // console.log({ e, index });
    }

    const handleAddNew = () => {
        navigate('/user-management/administrators/new');
    }

    return (
        <div>
            {loading && <Loader />}
            <span className="flex text-sm font-medium text-gray-500">User Management <ChevronRightIcon className="size-4 self-center" /> <p className="text-black">Administrators</p> </span>
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


const Table = () => {
    const [search, setSearch] = useState("");
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);

    const data = [
        { id: 1, name: "Alice", age: 25, country: "USA" },
        { id: 2, name: "Bob", age: 30, country: "UK" },
        { id: 3, name: "Charlie", age: 28, country: "Canada" },
        { id: 4, name: "David", age: 35, country: "Germany" },
    ];

    const filteredData = useMemo(() => {
        return data
            .filter((item) =>
                Object.values(item).some((val) =>
                    String(val).toLowerCase().includes(search.toLowerCase())
                )
            )
            .sort((a: any, b: any) => {
                if (!sortConfig) return 0;
                const { key, direction } = sortConfig;
                const order = direction === "asc" ? 1 : -1;
                return a[key] > b[key] ? order : a[key] < b[key] ? -order : 0;
            });
    }, [search, sortConfig, data]);

    const handleSort = (key: string) => {
        setSortConfig((prev) => ({
            key,
            direction: prev?.key === key && prev.direction === "asc" ? "desc" : "asc",
        }));
    };

    return (
        <div className="p-4">
            <input
                type="text"
                placeholder="Search..."
                className="mb-4 p-2 border border-gray-300 rounded w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <table className="min-w-full bg-white border border-gray-200 shadow-md">
                <thead className="bg-gray-100">
                    <tr>
                        {["ID", "Name", "Age", "Country"].map((header, index) => (
                            <th
                                key={index}
                                className="p-3 text-left cursor-pointer"
                                onClick={() => handleSort(header.toLowerCase())}
                            >
                                {header} {sortConfig?.key === header.toLowerCase() ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((row) => (
                        <tr key={row.id} className="border-t border-gray-200 hover:bg-gray-50">
                            <td className="p-3">{row.id}</td>
                            <td className="p-3">{row.name}</td>
                            <td className="p-3">{row.age}</td>
                            <td className="p-3">{row.country}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export {
    Table
}