import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { putRequest } from "../../../../utils/apiHelpers";
import Alert from "../../../../components/Alert";
import Loader from "../../../../components/Loader";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import ActionButton from "../../../../components/ActionButton";
import CitizenEditForm from "./CitizenEditForm";

export default function CitizenFormEditPage(props: any) {
    const navigate = useNavigate();

    const locationData = useLocation();
    const [citizen, setCitizen] = useState<any>(locationData.state);
    const [loading, setLoading] = useState(false);
    const [alerts, setAlerts] = useState<any[]>([]);
    const [edit, setEdit] = useState(false);
    let processing = false;

    function handleInput(e: any) {
        if (e.target.name === 'cityMunName' && !citizen.provId) {
            addAlert("warning", "Please select province first", 2000);
        } else if (e.target.name === 'barangayName' && !citizen.cityMunId) {
            addAlert("warning", "Please select city / municipality first", 2000);
        } else {
            setCitizen({ ...citizen, [e.target.name]: e.target.value });
        }
    }

    function handleSelect(e: any) {
        setCitizen({ ...citizen, [e.target.name]: e.target.value });
    }

    const handleBack = () => {
        navigate('/user-management/citizens');
    }

    const addAlert = (type: "info" | "success" | "warning" | "error", message: string, duration: number) => {
        const id = Date.now();
        setAlerts((prev) => [...prev, { id, type, message, duration }]);

    };

    const removeAlert = (id: any) => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    };

    const handleCancel = () => {
        setCitizen({ ...locationData.state });
        setEdit(false);
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (processing) return;

        let errMsg = "";
        if (!citizen.firstName || !citizen.firstName || !citizen.email || !citizen.mobile) {
            errMsg = "Missing required fields!"
        }

        if (errMsg) {
            addAlert("error", errMsg, 1500);
        } else {
            processing = true;
            setLoading(true);
            try {
                const res = await putRequest(`/citizens/${citizen.id}`, citizen);
                setLoading(false);
                processing = false;
                if (res.data) {
                    setEdit(false);
                    if (window.confirm("Successfully updated data.\nGo back to list?")) {
                        handleBack();
                    }
                }
            } catch (e) {
                setLoading(false);
                processing = false;
                alert("Unable to create data. Please try again");
            }
        }
    }

    return (
        <div className="">
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
            {loading && <Loader />}
            <span className="flex text-sm font-medium text-gray-500">User Management <ChevronRightIcon className="size-4 self-center" /> Citizens <ChevronRightIcon className="size-4 self-center" /> <p className="text-black">{citizen.fullName}</p> </span>
            <div className="flex justify-between px-2 mt-4">
                <div className="">
                    <button type="button" onClick={handleBack} className="flex text-sm/6 font-semibold text-gray-900">
                        <ChevronLeftIcon className="w-6 h-6" />
                        Back
                    </button>
                </div>
                <div className="flex items-center justify-end gap-x-6">
                    {edit && <ActionButton type="Cancel" handleClick={handleCancel} />}
                    {edit && <ActionButton type="Save" handleClick={handleSubmit} />}
                    {!edit && <ActionButton type="Edit" handleClick={() => setEdit(true)} />}
                </div>
            </div>

            <div className="mt-3 p-4 md:p-8 border shadow-lg rounded-lg md:mx-4">
                <CitizenEditForm citizen={citizen} setCitizen={setCitizen} handleInput={handleInput} handleSubmit={handleSubmit} handleSelect={handleSelect} handleCancel={handleCancel} edit={edit} showCancel={true} />
            </div>

        </div>
    );
}