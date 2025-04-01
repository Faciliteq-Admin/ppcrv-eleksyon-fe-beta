import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postRequest } from "../../../../utils/apiHelpers";
import Alert from "../../../../components/Alert";
import Loader from "../../../../components/Loader";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import ActionButton from "../../../../components/ActionButton";
import AdministratorEditForm from "./AdministratorEditForm";
import { getUserSession } from "../../../../utils/functions";

export default function AdministratorFormPage(props: any) {
    const navigate = useNavigate();

    const [admin, setAdmin] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [alerts, setAlerts] = useState<any[]>([]);

    function handleInput(e: any) {
        if (e.target.name === 'cityMunName' && !admin.provId) {
            addAlert("warning", "Please select province first", 2000);
        } else if (e.target.name === 'barangayName' && !admin.cityMunId) {
            addAlert("warning", "Please select city / municipality first", 2000);
        } else {
            setAdmin({ ...admin, [e.target.name]: e.target.value });
        }
    }

    const handleBack = () => {
        navigate('/user-management/administrators');
    }

    const addAlert = (type: "info" | "success" | "warning" | "error", message: string, duration: number) => {
        const id = Date.now();
        setAlerts((prev) => [...prev, { id, type, message, duration }]);

    };

    const removeAlert = (id: any) => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        let errMsg = "";
        if (!admin.firstName || !admin.firstName || !admin.email || !admin.mobile) {
            errMsg = "Missing required fields!"
        }

        if (errMsg) {
            addAlert("error", errMsg, 1500);
        } else {

            let session = getUserSession();
            if (session && session.user && session.user.lguId) {
                admin.lguId = session.user.lguId;
            }

            setLoading(true);
            try {
                const res = await postRequest(`/administrators`, admin);
                setLoading(false);
                // console.log({ res });
                if (window.confirm("Successfully created data.\nGo back to list?")) {
                    handleBack();
                } else {
                    setAdmin({});
                }
            } catch (e) {
                setLoading(false);
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
            <span className="flex text-sm font-medium text-gray-500">User Management <ChevronRightIcon className="size-4 self-center" /> Administrators <ChevronRightIcon className="size-4 self-center" /> <p className="text-black">Create Administrator</p> </span>
            <div className="flex justify-between px-2 mt-4">
                <div className="">
                    <button type="button" onClick={handleBack} className="flex text-sm/6 font-semibold text-gray-900">
                        <ChevronLeftIcon className="w-6 h-6" />
                        Back
                    </button>
                </div>
                <div className="flex items-center justify-end gap-x-6">
                    <ActionButton type="Save" handleClick={handleSubmit} />
                </div>
            </div>

            <div className="mt-3 p-4 md:p-8 border shadow-lg rounded-lg md:mx-4">
                <AdministratorEditForm admin={admin} setAdmin={setAdmin} handleInput={handleInput} handleSubmit={handleSubmit} edit={true} />
            </div>

        </div>
    );
}