import { useLoaderData, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Loader from "../../../components/Loader";
import { getRequest, postRequest } from "../../../utils/apiHelpers";
import EmptyCard from "../../../components/EmptyCard";
import TableCheckbox from "../../../components/TableCheckbox";
import moment from "moment";

export default function UploadResultListPage(props: any) {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any>();
    const [file, setFile] = useState<any>();

    let processing = false;

    useEffect(() => {

        let mounted = false;
        getData();

        return () => {
            mounted = true;
        };
    }, []);

    const getData = async (batchNum?: number) => {
        if (processing) return;

        processing = true;
        setLoading(true);
        let path = '/results/batches';
        const res = await getRequest(path);
        if (res && res.data && res.data) {
            setResults(res.data.items);
        }
        setLoading(false);
        processing = false;
    }

    const tColumns = [
        {
            header: 'Batch',
            accessorKey: 'uploadBatchNum',
            cell: (info: any) => `${info ?? 'N/A'}`,
            sort: false,
        },
        {
            header: 'File',
            accessorKey: 'contents',
            cell: (info: any) => `${info.file.originalname ?? 'N/A'}`,
            sort: false,
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: (info: any) => `${info ?? 'N/A'}`,
            sort: true,
        },
        {
            header: 'Has Error',
            accessorKey: 'hasErrors',
            cell: (info: any) => {
                console.log(info);

                if (info === null) return '';
                else if (info) return <p className="text-red-500">Yes</p>;
                else return <p className="text-green-500">No</p>;
            },
            sort: true,
        },
        {
            header: 'Date Uploaded',
            accessorKey: 'createdAt',
            cell: (info: any) => `${moment(info).format('YYYY-MM-DD HH:mm:ss') ?? 'N/A'}`,
            sort: true,
        },
        // {
        //     header: 'City/Municipality',
        //     accessorKey: 'munName',
        //     cell: (info: any) => `${info ?? 'N/A'}`,
        //     sort: true,
        // },
        // {
        //     header: 'Barangay',
        //     accessorKey: 'brgyName',
        //     cell: (info: any) => `${info ?? 'N/A'}`,
        //     sort: true,
        // },
        {
            header: 'Actions',
            accessorKey: null,
            cell: (info: any) => {
                
                if (results && results.length > 0) {

                    if (["Ongoing","Completed"].includes(results[info].status)) {
                        return <span className="disabled">
                            <button className="text-gray-500">Ingest Data</button>
                        </span>
                    } else if (results[info].status === "Incomplete") {
                        return <span className="">
                            <button className="text-blue-500" onClick={(e) => handleIngest(e, info)}>Re-ingest Data</button>
                        </span>
                    } else {
                        return <span className="disabled">
                            <button className="text-blue-500" onClick={(e) => handleIngest(e, info)}>Ingest Data</button>
                        </span>
                    }
                } else {
                    return '';
                }

            }
        }
    ];

    const handleIngest = async (e: any, index: any) => {
        if (window.confirm("Are you sure you want to load/ingest results?")) {
            const data = results[index];
            const _id = data._id;

            processing = true;
            setLoading(true);
            let response = await postRequest('/results/ingest', { _id });
            processing = false;
            setLoading(false);

            if (response.message) {
                setResults((prevResults: any) => {
                    const newResults = [...prevResults];
                    newResults[index].status = "Ongoing";
                    // newResults[index].ingestTime = new Date().toISOString();
                    // newResults[index].ingestStatus = "Ingesting";
                    // newResults[index].ingestProgress = 0;
                    // newResults[index].ingestError = "";
                    // newResults[index].ingestSuccess = false;
                    // newResults[index].ingestSuccessMessage = "";
                    // newResults[index].ingestFailureMessage = "";
                    return newResults;
                });
                alert(response.message);
            } else {
                alert("Unable to load/ingest results. Please try again");
            }
        }
    }

    const handleSelectFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const uploadedFiles = Array.from(event.target.files);
            if (uploadedFiles.length > 0) setFile(uploadedFiles[0]);
        }
    };

    const handleUploadFile = async () => {
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            processing = true;
            setLoading(true);
            let response = await postRequest('/results/upload', formData);
            processing = false;
            setLoading(false);

            if (response.data) {
                setResults(response.data);
                setFile(null);
                alert("File has been uploaded");
            } else {
                alert("Error uploading file");
            }
        } else {
            alert("Please select a file");
        }
    }

    return (
        <div>
            {loading && <Loader />}
            <span className="text-sm font-medium">Upload Results</span>

            <div className="mb-3 mt-3 flex gap-2">
                <div>
                    {/* <label
                        htmlFor="formFile"
                        className="mb-2 inline-block text-neutral-700 dark:text-neutral-500"
                    >
                        Upload results file
                    </label> */}
                    <input
                        className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-800 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-500 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                        type="file"
                        id="formFile"
                        accept=".csv"
                        placeholder="select results file to upload"
                        onChange={handleSelectFile}
                    />
                </div>
                <button
                    type="submit"
                    onClick={handleUploadFile}
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Upload Results
                </button>
            </div>
            {results && results.length > 0 && <TableCheckbox data={results} columns={tColumns} showActionButton={false} handleAdd={null} />}
            {!results || results.length === 0 && <EmptyCard>
                <div className="place-self-center">
                    <p className="">
                        No data
                    </p>
                </div>
            </EmptyCard>}
        </div>
    );
}