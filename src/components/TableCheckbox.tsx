import { PlusIcon, TrashIcon } from '@heroicons/react/20/solid';
import { useEffect, useMemo, useState } from 'react';
import arrowUpDown from './../assets/arrowUpDown.svg';
import down from './../assets/down.svg';
import up from './../assets/up.svg';
import { useNavigate } from 'react-router-dom';

const TableCheckbox = (props: any) => {
    const navigate = useNavigate();

    const tCols = props.columns;

    const [data, setData] = useState(props.data);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [filterQuery, setFilterQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(props.rowsPerPage ?? 10);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);

    useEffect(() => {
        setData(props.data);
    }, [props.data]);

    const sortData = (key: any) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }

        const sortedData = [...data].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === 'ascending' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });

        setData(sortedData);
        setSortConfig({ key, direction });
    };

    // Filter logic
    const filteredData = useMemo(() => {
        return (!data || data.length === 0) ? [] : filterQuery === '' ? data : data.filter((row: any) => {
            if (props.filterFields) {
                let boolValue = false;
                for (let key of props.filterFields) {
                    boolValue = boolValue || row[key].toLowerCase().includes(filterQuery.toLowerCase());
                }
                return boolValue;
            } else if (row.name) {
                return row.name.toLowerCase().includes(filterQuery.toLowerCase());
            } else {
                return true;
            }
        });
    },
        [data, filterQuery.toLocaleLowerCase()]
    );

    // Pagination logic
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Row selection logic
    const handleSelectRow = (id: any) => {
        setSelectedRows((prevSelectedRows: any) => {
            if (prevSelectedRows.includes(id)) {
                return prevSelectedRows.filter((rowId: any) => rowId !== id);
            } else {
                return [...prevSelectedRows, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedRows.length === currentRows.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(currentRows.map((row: any) => row.code));
        }
    };

    // Bulk delete logic
    const handleBulkDelete = () => {
        const newData = data.filter((row: any) => !selectedRows.includes(row.code));
        setData(newData);
        setSelectedRows([]);
    };

    // Handle rows per page selection
    const handleRowsPerPageChange = (e: any) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to first page after changing rows per page
    };

    // console.log({data, filteredData, propsdata: props.data});

    return (
        <div className="flex flex-col">
            <div className="grid gap-2 my-2 lg:flex lg:justify-between">
                {props.showFilter && <input
                    type="text"
                    placeholder="Search keyword"
                    className="px-4 py-2 border border-gray-300 rounded-md"
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                />}
                <div>
                    {props.leftWidget}
                </div>
                <p></p>
                <div className="flex justify-between">
                    {data.length > 10 && <select
                        className="px-4 py-2 border border-gray-300 rounded-md"
                        value={rowsPerPage}
                        onChange={handleRowsPerPageChange}
                    >
                        {props.rowsPerPage && <option value={props.rowsPerPage}>{props.rowsPerPage} rows</option>}
                        <option value={10}>10 rows</option>
                        <option value={25}>25 rows</option>
                        <option value={50}>50 rows</option>
                        <option value={100}>100 rows</option>
                    </select>}
                    {props.showActionButton &&
                        <button
                            onClick={props.handleAdd}
                            className={`px-4 py-2 ml-4 bg-green-700 text-white rounded-md`}
                        >
                            <PlusIcon className="w-6 h-6" />
                        </button>
                    }
                </div>
            </div>

            {/* Table */}
            <div className="shadow overflow-auto">
                <table className="min-w-full shadow-md rounded-lg">
                    <thead className="bg-gray-100">
                        <tr>
                            {props.selectable && <th className="px-4 py-4 text-left">
                                <input
                                    type="checkbox"
                                    checked={selectedRows.length === currentRows.length && currentRows.length > 0}
                                    onChange={handleSelectAll}
                                />
                            </th>}
                            {tCols.map((h: any) => {
                                return (
                                    <th key={h.header}
                                        scope="col"
                                        className="cursor-pointer text-sm font-medium text-gray-900 px-4 py-4 text-left"
                                        onClick={() => h.sort && sortData(h.accessorKey)}
                                    >
                                        <b className='flex'>
                                            {h.header}
                                            {h.sort && sortConfig.key === h.accessorKey && (sortConfig.direction === 'ascending' ? <img className={`ml-2 w-4 h-4 self-center`} src={up} /> : <img className={`ml-2 w-4 h-4 self-center`} src={down} />)}
                                            {h.sort && sortConfig.key !== h.accessorKey && (<img className={`ml-2 w-4 h-4 self-center`} src={arrowUpDown} />)}
                                        </b>
                                    </th>

                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.map((row: any, idx: number) => (
                            <tr key={idx} className="bg-white border-b">
                                {props.selectable && <td className="px-4 py-2 ">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.includes(row.code)}
                                        onChange={() => handleSelectRow(row.code)}
                                    />
                                </td>}
                                {tCols.map((h: any) => {
                                    return <td key={`${row.id}-${h.header}`} className="px-4 py-2  whitespace-nowrap text-sm font-medium text-gray-900">
                                        {h.cell(h.accessorKey ? row[h.accessorKey] : idx)}
                                    </td>
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls  md:flex-col justify-between  */}
            <div className={`mt-4 ${rowsPerPage > 20 ? 'grid grid-cols-1 gap-2 md:flex' : 'flex'}  justify-between`}>

                <div className='flex justify-between space-x-2'>
                    {props.selectable && <button
                        onClick={handleBulkDelete}
                        disabled={selectedRows.length === 0}
                        className={`w-10 h-10 bg-red-500 text-white rounded-md hover:bg-red-600 ${selectedRows.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <TrashIcon className="mx-2 w-6 h-6" />
                    </button>}
                    {rowsPerPage > 20 &&
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-md"
                            value={rowsPerPage}
                            onChange={handleRowsPerPageChange}
                        >
                            {props.rowsPerPage && <option value={props.rowsPerPage}>{props.rowsPerPage} rows</option>}
                            <option value={10}>10 rows</option>
                            <option value={25}>25 rows</option>
                            <option value={50}>50 rows</option>
                            <option value={100}>100 rows</option>
                        </select>
                    }
                </div>
                {data.length > 10 && <div className="flex justify-between space-x-2">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className='mt-1.5'>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>}
            </div>
        </div>
    );
};

export default TableCheckbox;