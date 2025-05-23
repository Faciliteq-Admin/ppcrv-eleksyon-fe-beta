import { useLoaderData, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Loader from "../../../components/Loader";
import { getRequest } from "../../../utils/apiHelpers";
import EmptyCard from "../../../components/EmptyCard";
import TableCheckbox from "../../../components/TableCheckbox";
import moment from "moment";
import { useElectionResults } from "../../../hooks/useElectionResults";
import Table from "../../../components/Table";
import { formatNumber, getActiveBatchNumber } from "../../../utils/functions";

export default function ElectionReturnsListPage(props: any) {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(50);
    const [search, setSearch] = useState("");

    const {
        data, total, loading,
        getElectionResults,
    } = useElectionResults(page, limit);
    const totalPages = Math.ceil(total / limit);

    useEffect(() => {
        getElectionResults()
    }, [page, limit]);

    const tColumns = [
        // {
        //     header: 'Batch',
        //     accessorKey: 'uploadBatchNum',
        //     cell: (info: any) => `${info ?? 'N/A'}`,
        //     sort: false,
        // },
        {
            header: 'Precinct Code',
            accessorKey: 'precint_code',
            cell: (info: any) => `${info ?? 'N/A'}`,
            sort: false,
        },
        {
            header: 'Candidate Name',
            accessorKey: 'candidate_name',
            cell: (info: any) => `${info ?? 'N/A'}`,
            sort: true,
        },
        {
            header: 'Contest',
            accessorKey: 'contestName',
            cell: (info: any) => `${info ?? 'N/A'}`,
            sort: true,
        },
        {
            header: 'Registered Voters',
            accessorKey: 'number_voters',
            cell: (info: any) => `${info ? formatNumber(info) : 'N/A'}`,
            sort: true,
        },
        {
            header: 'Total Votes',
            accessorKey: 'votes_amount',
            cell: (info: any) => `${info ? formatNumber(info) : 'N/A'}`,
            sort: true,
        },
        {
            header: 'Under Votes',
            accessorKey: 'under_votes',
            cell: (info: any) => `${info ? formatNumber(info) : 'N/A'}`,
            sort: true,
        },
        {
            header: 'Over Votes',
            accessorKey: 'over_votes',
            cell: (info: any) => `${info ? formatNumber(info) : 'N/A'}`,
            sort: true,
        },
        {
            header: 'Reception Date',
            accessorKey: 'reception_date',
            cell: (info: any) => `${moment(info, "YYYY-MM-DD:HH:mm:ss").format('YYYY-MM-DD HH:mm:ss') ?? 'N/A'}`,
            sort: true,
        },
    ];

    const handleRowsPerPageChange = (e: any) => {
        console.log(e.target.value);

        setLimit(Number(e.target.value));
        setPage(1); // Reset to first page after changing rows per page
    };

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    async function handleSelect(e: any) {

    }

    const handleFilter = (e: any) => {
        setPage(1);
        // getPrecincts(selectedRegion, selectedProvince, selectedProvince, selectedBarangay);
    }

    return (
        <div>
            {loading && <Loader />}
            <span className="text-sm font-medium">Election Returns</span>
            <div className="flex flex-col">
                <div className="grid gap-2 my-2 lg:flex lg:justify-between lg:py-4">
                    {/* <input
                        type="text"
                        placeholder="Search candidate"
                        className="px-4 py-2 border border-gray-300 rounded-md"
                        value={search}
                        onChange={handleSearch}
                    /> */}
                    <span>
                        {/* <p>Active Batch Number: {getActiveBatchNumber()}</p> */}
                        <p>Total: {formatNumber(total)}</p>
                    </span>

                    <div className="flex justify-between">
                        {data && data.length > 0 &&
                            <select
                                className="px-4 py-2 border border-gray-300 rounded-md"
                                value={limit}
                                onChange={handleRowsPerPageChange}
                            >
                                <option value={10}>10 rows</option>
                                <option value={25}>25 rows</option>
                                <option value={50}>50 rows</option>
                                <option value={100}>100 rows</option>
                                <option value={500}>500 rows</option>
                                <option value={1000}>1000 rows</option>
                            </select>
                        }
                    </div>
                </div>
                {data && data.length > 0 &&
                    <Table data={data} columns={tColumns} handleRowClick={() => { }} />
                }
                {!data || data.length === 0 && <EmptyCard>
                    <div className="place-self-center">
                        <p className="">
                            No data
                        </p>
                    </div>
                </EmptyCard>
                }
                {/* Pagination Controls  md:flex-col justify-between  */}
                {data && data.length > 0 &&
                    < div className={`mt-4 ${limit > 20 ? 'grid grid-cols-1 gap-2 md:flex' : 'flex'}  justify-between`}>
                        <div className='flex justify-between space-x-2'>
                            {limit > 20 && data.length > 20 &&
                                <select
                                    className="px-4 py-2 border border-gray-300 rounded-md"
                                    value={limit}
                                    onChange={handleRowsPerPageChange}
                                >
                                    <option value={10}>10 rows</option>
                                    <option value={25}>25 rows</option>
                                    <option value={50}>50 rows</option>
                                    <option value={100}>100 rows</option>
                                    <option value={500}>500 rows</option>
                                    <option value={1000}>1000 rows</option>
                                </select>
                            }
                        </div>
                        <div className="flex justify-between space-x-2">
                            <button
                                onClick={handlePreviousPage}
                                disabled={page === 1}
                                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className='mt-1.5'>
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={handleNextPage}
                                disabled={page === totalPages}
                                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}