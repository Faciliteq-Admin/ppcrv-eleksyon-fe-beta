import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { postRequest, putRequest } from "../../../../utils/apiHelpers";
import Alert from "../../../../components/Alert";
import Loader from "../../../../components/Loader";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import ContractorEditForm from "./ContractorEditForm";
import ModalDialog from "../../../../components/ModalDialog";

export default function ContractorFormEditPage(props: any) {
    const navigate = useNavigate();

    const locationData = useLocation();
    const [contractor, setContractor] = useState<any>({ ...locationData.state });
    const [loading, setLoading] = useState(false);
    const [alerts, setAlerts] = useState<any[]>([]);
    const [edit, setEdit] = useState(false);
    const [password, setPassword] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    let processing = false;

    function handleInput(e: any) {
        setContractor({ ...contractor, [e.target.name]: e.target.value });
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

            if (processing) return;
            processing = true;
            setLoading(true);
            try {
                const res = await putRequest(`/contractors/${contractor.id}`, contractor);
                processing = false;
                setLoading(false);
                if (res.data) {
                    if (window.confirm("Successfully updated data.\nGo back to list?")) {
                        handleBack();
                    } else {
                        setEdit(false);
                    }
                } else {
                    addAlert("error", "Failed to update data!", 1500);
                }
            } catch (e) {
                processing = false;
                setLoading(false);
                alert("Unable to create data. Please try again");
            }
        }
    }

    const handleCancel = () => {
        setContractor({ ...locationData.state });
        setEdit(false);
    }

    const showPassword = async (e: any) => {
        e.preventDefault();
        setPassword(null);
        setIsOpen(true);
    }

    const handleModalCancel = async () => {
        setIsOpen(false);
    }

    const handleModalSubmit = async (e: any) => {
        e.preventDefault();

        if (!password) {
            addAlert("error", "Empty password", 15000);
        } else {
            if (processing) return;
            processing = true;
            setLoading(true);
            let response = await postRequest(`/auth/password/show`, { password: btoa(password), userId: contractor.userId });
            processing = false;
            setLoading(false);

            if (response.data) {
                setIsOpen(false);
                setContractor((prevData: any) => ({
                    ...prevData,
                    temporaryPassword: response.data.tempPassword,
                }));
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
            {isOpen && <ModalDialog
                title={"View Password"}
                description={""}
                submitButtonTitle={"Proceed"}
                submitButtonBGColor={'blue'}
                isOpen={true}
                handleCancel={handleModalCancel}
                handleSubmit={handleModalSubmit}
            >
                <div>
                    <div className="flex items-center justify-between">
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                            Enter your password
                        </label>
                    </div>
                    <div className="mt-2">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={password ?? ''}
                            onChange={(e: any) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 indent-2"
                        />
                    </div>
                </div>
            </ModalDialog>}
            <span className="flex text-sm font-medium text-gray-500">User Management <ChevronRightIcon className="size-4 self-center" /> Contractors <ChevronRightIcon className="size-4 self-center" /> <p className="text-black">{contractor.fullName}</p> </span>
            <div className="flex justify-between px-2 mt-4">
                <div className="">
                    <button type="button" onClick={handleBack} className="flex text-sm/6 font-semibold text-gray-900">
                        <ChevronLeftIcon className="w-6 h-6" />
                        Back
                    </button>
                </div>
                <div className="flex items-center justify-end gap-x-6">
                    {edit && <button
                        type="submit"
                        onClick={handleCancel}
                        className="rounded-md bg-gray-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Cancel
                    </button>}
                    {edit && <button
                        type="submit"
                        onClick={handleSubmit}
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Save
                    </button>}
                    {!edit && <div className="flex space-x-3">
                        <button
                            type="submit"
                            onClick={() => setEdit(true)}
                            className="rounded-md bg-indigo-600 px-3 py-2 max-md:text-xs text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Edit
                        </button>
                    </div>}
                </div>
            </div>

            <div className="mt-3 p-4 md:p-8 border shadow-lg rounded-lg md:mx-4">
                <ContractorEditForm
                    edit={edit}
                    showCancel={true}
                    contractor={contractor}
                    setContractor={setContractor}
                    handleCancel={handleCancel}
                    handleSubmit={handleSubmit}
                    handleInput={handleInput}
                    showPassword={showPassword}
                />
            </div>

        </div>
    );
}
