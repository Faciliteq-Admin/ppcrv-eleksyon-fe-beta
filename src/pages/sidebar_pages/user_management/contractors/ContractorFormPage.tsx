import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postRequest } from "../../../../utils/apiHelpers";
import Alert from "../../../../components/Alert";
import Loader from "../../../../components/Loader";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import ContractorEditForm from "./ContractorEditForm";
import { getUserSession } from "../../../../utils/functions";

export default function ContractorFormPage(props: any) {
    const navigate = useNavigate();

    const [contractor, setContractor] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [alerts, setAlerts] = useState<any[]>([]);

    function handleInput(e: any) {
        if (e.target.name === 'cityMunName' && !contractor.provId) {
            addAlert("warning", "Please select province first", 2000);
        } else if (e.target.name === 'barangayName' && !contractor.cityMunId) {
            addAlert("warning", "Please select city / municipality first", 2000);
        } else {
            setContractor({ ...contractor, [e.target.name]: e.target.value });
        }
    }

    const handleBack = () => {
        navigate('/user-management/contractors');
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
        if (!contractor.firstName || !contractor.firstName || !contractor.email || !contractor.mobile) {
            errMsg = "Missing required fields!"
        }

        if (errMsg) {
            addAlert("error", errMsg, 1500);
        } else {

            let session = getUserSession();
            if (session && session.user && session.user.lguId) {
                contractor.lguId = session.user.lguId;
            }

            setLoading(true);
            try {
                const res = await postRequest(`/contractors`, contractor);
                setLoading(false);
                if (res.data) {
                    console.log({ res });
                    if (window.confirm("Successfully created data.\nGo back to list?")) {
                        handleBack();
                    } else {
                        setContractor({});
                    }
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
            <span className="flex text-sm font-medium text-gray-500">User Management <ChevronRightIcon className="size-4 self-center" /> Contractors <ChevronRightIcon className="size-4 self-center" /> <p className="text-black">Create Contractor</p> </span>
            <div className="flex justify-between px-2 mt-4">
                <div className="">
                    <button type="button" onClick={handleBack} className="flex text-sm/6 font-semibold text-gray-900">
                        <ChevronLeftIcon className="w-6 h-6" />
                        Back
                    </button>
                </div>
                <div className="flex items-center justify-end gap-x-6">
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Save
                    </button>
                </div>
            </div>

            <div className="mt-3 p-4 md:p-8 border shadow-lg rounded-lg md:mx-4">
                <ContractorEditForm contractor={contractor} setContractor={setContractor} edit={true} handleInput={handleInput} handleSubmit={handleSubmit} />
            </div>

        </div>
    );
}