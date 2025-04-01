import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsonData from './../../../../mockdata/city-municipality.json';
import TableCheckbox from "../../../../components/TableCheckbox";

export default function MunicipalityListPage(props: any) {
    const navigate = useNavigate();

    const cityMunListData = loadData().sort((a, b) => {
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
            header: 'City / Municipality Name',
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
        <TableCheckbox data={cityMunListData} columns={tColumns} />
    );
}

function loadData() {
    return jsonData;
}

export async function loader() {
    return {
        cityMunListData: loadData(),
    };
}
