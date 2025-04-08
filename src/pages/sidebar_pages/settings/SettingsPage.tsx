import { useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import jsonData from '../../../mockdata/platforms.json';
import TableCheckbox from "../../../components/TableCheckbox";
import { formatDateString } from "../../../utils/functions";

export default function SettingsPage(props: any) {
    const navigate = useNavigate();

    const settingsData = loadData();

    const tColumns = [
        {
            header: 'Platform Name',
            accessorKey: 'name',
            cell: (info: any) => `${info ?? 'N/A'}`,
            sort: true,
        },
        {
            header: 'Status',
            accessorKey: 'isEnabled',
            cell: (info: any) => {
                const text = info ? 'Active' : 'Inactive';
                const color = info ? 'green' : 'red';
                return <p className={`px-2 inline-flex text-sm rounded-full bg-${color}-100 text-${color}-800`}>{text}</p>;
            },
            sort: true,
        },
        {
            header: 'Date Created',
            accessorKey: 'createdAt',
            cell: (info: any) => `${info ? formatDateString(info, 'MMM DD, YYYY') || '' : ''}`,
            sort: false,
        },
        {
            header: 'Date Modified',
            accessorKey: 'updatedAt',
            cell: (info: any) => `${info ? formatDateString(info, 'MMM DD, YYYY') || '' : ''}`,
            sort: false,
        },
    ];

    return (
        <TableCheckbox data={settingsData} columns={tColumns} />
    );
}

function loadData() {    
    return jsonData;
}

export async function loader() {    
    return {
        settingsData: loadData(),
    };
}
