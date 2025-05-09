import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import jsonData from '../../../mockdata/platforms.json';
import TableCheckbox from "../../../components/TableCheckbox";
import { formatDateString, saveActiveBatchNumber } from "../../../utils/functions";
import Loader from "../../../components/Loader";
import { useElectionResults } from "../../../hooks/useElectionResults";
import EmptyCard from "../../../components/EmptyCard";
import { getRequest, putRequest } from "../../../utils/apiHelpers";
import Alert from "../../../components/Alert";

export default function SettingsPage(props: any) {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(50);
    const [loading, setLoading] = useState(false);
    const [activeBatch, setActiveBatch] = useState("");
    const [activeBatchSetting, setActiveBatchSetting] = useState<any>();
    const [uploadBatchNumSetting, setUploadBatchNumSetting] = useState<any>();
    const [alerts, setAlerts] = useState<any[]>([]);

    let uploadCount = 0;

    useEffect(() => {
        getData();
    }, [page, limit]);

    const getData = async () => {
        setLoading(true);
        let settingRes = await getRequest('/settings');
        if (settingRes && settingRes.data) {
            for (const s of settingRes.data) {
                if (s.field === "activeBatch") {
                    setActiveBatchSetting(s);
                }
                if (s.field === "uploadBatchNum") {
                    setUploadBatchNumSetting(s);
                }
            }
        }
        setLoading(false);
    }

    const handleSelect = (e: any) => {
        setActiveBatch(e.target.value);
    }

    const handleUpdateBatch = async (e: any) => {
        setLoading(true);
        let settingRes = await putRequest('/settings', { "field": "activeBatch", "value": activeBatch });
        if (settingRes && settingRes.data) {
            setActiveBatch(settingRes.data.value);
            saveActiveBatchNumber(settingRes.data.value);
        }
        if (settingRes && settingRes.error) {
            addAlert("error", settingRes.error.response.data.message, 1500);
        }
        setLoading(false);
    }

    const addAlert = (type: "info" | "success" | "warning" | "error", message: string, duration: number) => {
        const id = Date.now();
        setAlerts((prev) => [...prev, { id, type, message, duration }]);
    };

    const removeAlert = (id: any) => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    };

    return (
        <div>
            {loading && <Loader />}
            <div className="fixed top-20 right-20">
                {alerts.map((alert) =>
                    <Alert
                        key={alert.id}
                        type={alert.type}
                        message={alert.message}
                        duration={alert.duration} // 3 seconds
                        onClose={() => removeAlert(alert.id)}
                    />
                )}
            </div>
            <span className="text-sm font-medium">Settings</span>
            <div className="flex flex-col">
                <EmptyCard>
                    {uploadBatchNumSetting && <div key={"uploadBatchNum"} className="flex gap-2">
                        <label htmlFor="uploadBatchNum" className="block text-sm/6 font-medium text-gray-900">
                            Uploaded Results:
                        </label>
                        {uploadBatchNumSetting.value}
                    </div>}
                    {activeBatchSetting && <div key={"activeBatch"} className="mt-2">
                        <label htmlFor="activeBatch" className="block text-sm/6 font-medium text-gray-900">
                            Current Active Batch
                        </label>
                        <div className="flex gap-2">
                            <div className="mt-1 w-24">
                                <select
                                    id="activeBatch"
                                    name="activeBatch"
                                    value={activeBatch ? activeBatch : activeBatchSetting.value}
                                    onChange={handleSelect}
                                    className="px-2 py-2 w-full border border-gray-300 rounded-md text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                >
                                    {Array.from({ length: +uploadBatchNumSetting.value }, (_, i) => i + 1).map((v: any, i: number) =>
                                        <option key={i}>{v}</option>
                                    )}
                                </select>
                            </div>
                            {activeBatch !== "" && <div className="flex gap-2 self-end">
                                <button
                                    onClick={handleUpdateBatch}
                                    className="px-4 py-2 bg-blue-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
                                >
                                    Change
                                </button>
                            </div>}
                        </div>
                    </div>}
                </EmptyCard>

            </div>
        </div>
    );
}