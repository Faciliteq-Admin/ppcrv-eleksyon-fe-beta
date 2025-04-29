import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../../../components/Loader";
import EmptyCard from "../../../components/EmptyCard";
import Table from "../../../components/Table";
import { useCandidates } from "../../../hooks/useCandidates";

export default function CandidateListPage(props: any) {
    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(50);
    const [text, setText] = useState("");
    const [search, setSearch] = useState("");
    const { data, total, loading, getCandidates } = useCandidates(page, limit);

    useEffect(() => {
        getCandidates(search);
    }, [page, limit, search]);

    const totalPages = Math.ceil(total / limit);
    const filterFields = ['candidateName', 'candidateCode', 'contestCode', 'contestName'];
    const tColumns = [
        {
            header: 'Candidate Name',
            accessorKey: 'candidateName',
            cell: (info: any) => `${info ?? 'N/A'}`,
            sort: true,
        },
        {
            header: 'Contest Name',
            accessorKey: 'contestName',
            cell: (info: any) => `${info ?? 'N/A'}`,
            sort: true,
        },
    ];

    const handleRowsPerPageChange = (e: any) => {
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

    const handleSearch = (e: any) => {
        setPage(1);
        setSearch(text);
    }

    const handleRowClick = async (e: any, row: any) => {
    }

    return (
        <div>
            {loading && <Loader />}
            <span className="text-sm font-medium">Candidates</span>
            <div className="mt-4 flex flex-col">

                <div className="flex gap-2 py-1">
                    <input
                        type="text"
                        placeholder="Search Candidate"
                        className="px-4 py-2 border border-gray-300 rounded-md"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <button
                        onClick={handleSearch}
                        className="px-4 py-2 bg-blue-300 rounded-md hover:bg-gray-400 disabled:opacity-50 self-end"
                    >
                        Search
                    </button>
                </div>
                <div className="grid gap-2 my-2 lg:flex lg:justify-between">
                    <p className="self-end">Total Candidates: {total}</p>
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
                    <Table data={data} columns={tColumns} handleRowClick={handleRowClick} />
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
        </div >
    );
}