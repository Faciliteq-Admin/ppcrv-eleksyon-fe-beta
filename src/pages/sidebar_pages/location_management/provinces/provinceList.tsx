import { useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import jsonData from './../../../../mockdata/province.json';
import TableCheckbox from "../../../../components/TableCheckbox";

export default function ProvinceListPage(props: any) {
    const navigate = useNavigate();

    // const { provinceListData } = useLoaderData() as any;
    const provinceListData = loadData().sort((a, b) => {
        if (a.name < b.name) {
            return -1;
        } else if (a.name > b.name) {
            return 1;
        } else {
            return 0;
        }

    });

    const tColumns = [
        {
            header: 'Province Name',
            accessorKey: 'name',
            cell: (info: any) => `${info ?? 'N/A'}`,
        },
        {
            header: 'Status',
            accessorKey: 'isActive',
            cell: (info: any) => `${info ? 'Enabled' : 'Disabled'}`,
        },
    ]

    return (
        <TableCheckbox data={provinceListData} columns={tColumns} />
    );
}

function loadData() {
    return jsonData;
}

export async function loader() {
    return {
        provinceListData: loadData(),
    };
}
