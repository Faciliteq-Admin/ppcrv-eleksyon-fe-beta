import { useEffect, useState } from "react";
import { getRequest } from "../../../../utils/apiHelpers";
import { Combobox, ComboboxInput } from "@headlessui/react";
import { LocationCombobox } from "../../../../components/LocationSelect";
import ActionButton from "../../../../components/ActionButton";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";

export default function ContractorEditForm({ contractor, handleInput, setContractor, edit, handleCancel, handleSubmit, showCancel, showPassword }: any) {

    const [provs, setProvs] = useState<any[]>([]);
    const [cityMuns, setCityMuns] = useState<any[]>([]);
    const [barangays, setBarangays] = useState<any[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState("");
    const [query, setQuery] = useState<any>();
    let processing = false;


    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query) {
                await handleSearchLocation(query.e, query.type);
            }
        }, 500); // 1000ms debounce delay

        return () => clearTimeout(delayDebounceFn);
    }, [query])

    const handleSelectLocation = (option: any, type: "barangay" | "cityMun" | "prov") => {

        setIsDropdownOpen("");
        if (option) {
            if (type === "prov") {
                setContractor((prevData: any) => ({
                    ...prevData,
                    provId: option.id,
                    provName: option.name,
                    provCode: option.code,
                    cityMunId: "",
                    cityMunName: "",
                    cityMunCode: "",
                    barangayId: "",
                    barangayName: "",
                }));

            } else if (type === "cityMun") {
                setContractor((prevData: any) => ({
                    ...prevData,
                    cityMunId: option.id,
                    cityMunName: option.name,
                    cityMunCode: option.code,
                    barangayId: "",
                    barangayName: "",
                }));
            } else if (type === "barangay") {
                setContractor((prevData: any) => ({
                    ...prevData,
                    barangayId: option.id,
                    barangayName: option.name,
                }));
            }
        }
    };

    const handleSearchLocation = async (e: any, type: "barangay" | "citymun" | "province") => {

        handleInput(e);

        let parent = "";
        if (type === 'barangay') {
            if (e.target.value === "") setBarangays([]);
            parent = `&parent=${contractor.cityMunCode}`;
        } else if (type === 'citymun') {
            if (e.target.value === "") setCityMuns([]);
            parent = `&parent=${contractor.provCode}`;
        } else {
            if (e.target.value === "") setProvs([]);
        }

        if (e.target.value !== "") {
            setIsDropdownOpen(type);
            if (!processing) {

                processing = true;
                let response = await getRequest(`/locations/${type}s?name=${e.target.value}` + parent);
                processing = false;

                if (response.data) {
                    if (type === 'barangay') {
                        setBarangays(response.data.items);
                    } else if (type === 'citymun') {
                        setCityMuns(response.data.items);
                    } else {
                        setProvs(response.data.items);
                    }
                }

                setQuery(null);
            }
        }
    }

    const hidePassword = () => {
        handleInput({target: {
            name: 'temporaryPassword',
            value: null,
        }});
    }

    return (
        <form className="">
            <div className="space-y-8">
                <div className="border-b border-gray-900/10 pb-12 md:border md:rounded-lg md:border-gray-300 md:p-4">
                    <h2 className="text-base/7 font-semibold text-gray-900">Personal Information</h2>
                    <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-6">
                        <div className="sm:col-span-2">
                            <label htmlFor="firstName" className="flex text-sm/6 font-medium text-gray-900">
                                First name
                                {edit && <p className="text-red-500 ml-1">*</p>}
                            </label>
                            <div className="mt-2">
                                {!edit && <p>{contractor.firstName ? contractor.firstName : "Not set"}</p>}
                                {edit && <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    onChange={handleInput}
                                    autoComplete="firstName"
                                    value={contractor.firstName ?? ""}
                                    className="block w-full rounded-md border border-gray-400 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                                />}
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="middleName" className="block text-sm/6 font-medium text-gray-900">
                                Middle name
                            </label>
                            <div className="mt-2">
                                {!edit && <p>{contractor.middleName ? contractor.middleName : "Not set"}</p>}
                                {edit && <input
                                    id="middleName"
                                    name="middleName"
                                    type="text"
                                    onChange={handleInput}
                                    autoComplete="middleName"
                                    value={contractor.middleName ?? ""}
                                    className="block w-full rounded-md border border-gray-400 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                                />}
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="lastName" className="flex text-sm/6 font-medium text-gray-900">
                                Last name
                                {edit && <p className="text-red-500 ml-1">*</p>}
                            </label>
                            <div className="mt-2">
                                {!edit && <p>{contractor.lastName ? contractor.lastName : "Not set"}</p>}
                                {edit && <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    onChange={handleInput}
                                    autoComplete="lastName"
                                    value={contractor.lastName ?? ""}
                                    className="block w-full rounded-md border border-gray-400 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                                />}
                            </div>
                        </div>

                        <div className="sm:col-span-4 lg:col-span-2">
                            <label htmlFor="email" className="flex text-sm/6 font-medium text-gray-900">
                                Email address
                                {edit && <p className="text-red-500 ml-1">*</p>}
                            </label>
                            <div className="mt-2">
                                {!edit && <p>{contractor.email ? contractor.email : "Not set"}</p>}
                                {edit && <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    onChange={handleInput}
                                    autoComplete="email"
                                    value={contractor.email ?? ""}
                                    className="block w-full rounded-md border border-gray-400 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                                />}
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="mobile" className="flex text-sm/6 font-medium text-gray-900">
                                Mobile Number
                                {edit && <p className="text-red-500 ml-1">*</p>}
                            </label>
                            <div className="mt-2">
                                {!edit && <p>{contractor.mobile ? contractor.mobile : "Not set"}</p>}
                                {edit && <input
                                    id="mobile"
                                    name="mobile"
                                    type="number"
                                    onChange={handleInput}
                                    autoComplete="mobile"
                                    value={contractor.mobile ?? ""}
                                    className="block w-full rounded-md border border-gray-400 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                                />}
                            </div>
                        </div>

                        {contractor.tempPassword && !edit &&
                            <div className="sm:col-span-2">
                                <label htmlFor="tempPassword" className="flex text-sm/6 font-medium text-gray-900">
                                    Password
                                </label>
                                <div className="mt-2 flex gap-2">
                                    <p>{contractor.temporaryPassword ? atob(contractor.temporaryPassword) : "*".repeat(6)}</p>
                                    {!contractor.temporaryPassword && <button onClick={showPassword}>
                                        <EyeIcon className="size-5 text-blue-500" />
                                    </button>}
                                    {contractor.temporaryPassword && <button onClick={hidePassword}>
                                        <EyeSlashIcon className="size-5 text-blue-500" />
                                    </button>}
                                </div>
                            </div>
                        }
                    </div>
                </div>

                <div className="grid gap-x-6 gap-y-6 lg:grid-cols-2">
                    <div className="border-b pb-6 md:border md:rounded-lg md:border-gray-300 md:p-4">
                        <h2 className="text-base/7 font-semibold text-gray-900">Location Information</h2>

                        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-6">
                            <div className="sm:col-span-6">
                                <label htmlFor="provName" className="flex text-sm/6 font-medium text-gray-900">
                                    Province
                                    {edit && <p className="text-red-500 ml-1">*</p>}
                                </label>
                                <div className="mt-2">
                                    {!edit && <p>{contractor.provName ? contractor.provName : "Not set"}</p>}
                                    {edit &&
                                        <Combobox value={contractor.provName ?? ""} onChange={(value) => handleSelectLocation(value, "prov")} >
                                            <ComboboxInput
                                                placeholder="province"
                                                displayValue={contractor.provName ?? ""}
                                                onChange={(e) => setQuery({ e, type: "province" })}
                                                className="block w-full rounded-md border border-gray-400 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                                            />
                                            {provs.length > 0 && <LocationCombobox data={provs} />}
                                        </Combobox>
                                    }
                                </div>
                            </div>

                            <div className="sm:col-span-6">
                                <label htmlFor="cityMunName" className="flex text-sm/6 font-medium text-gray-900">
                                    City / Municipality
                                    {edit && <p className="text-red-500 ml-1">*</p>}
                                </label>
                                <div className="mt-2">
                                    {!edit && <p>{contractor.cityMunName ? contractor.cityMunName : "Not set"}</p>}
                                    {edit &&
                                        <Combobox value={contractor.cityMunName ?? ""} onChange={(value) => handleSelectLocation(value, "cityMun")} >
                                            <ComboboxInput
                                                placeholder="city / municipality"
                                                displayValue={contractor.cityMunName ?? ""}
                                                onChange={(e) => setQuery({ e, type: "citymun" })}
                                                className="block w-full rounded-md border border-gray-400 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                                            />
                                            {cityMuns.length > 0 && <LocationCombobox data={cityMuns} />}
                                        </Combobox>
                                    }
                                </div>
                            </div>
                            <div className="sm:col-span-6">
                                <label htmlFor="barangayName" className="flex text-sm/6 font-medium text-gray-900">
                                    Barangay
                                    {edit && <p className="text-red-500 ml-1">*</p>}
                                </label>
                                <div className="mt-2">
                                    {!edit && <p>{contractor.barangayName ? contractor.barangayName : "Not set"}</p>}
                                    {edit &&
                                        <Combobox value={contractor.barangayName ?? ""} onChange={(value) => handleSelectLocation(value, "barangay")} >
                                            <ComboboxInput
                                                placeholder="barangay"
                                                displayValue={contractor.barangayName ?? ""}
                                                onChange={(e) => setQuery({ e, type: "barangay" })}
                                                className="block w-full rounded-md border border-gray-400 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                                            />
                                            {barangays.length > 0 && <LocationCombobox data={barangays} />}
                                        </Combobox>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:border md:rounded-lg md:border-gray-300 md:p-4">
                        <h2 className="text-base/7 font-semibold text-gray-900">Organization Information</h2>

                        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-6">
                            <div className="sm:col-span-6">
                                <label htmlFor="organizationName" className="block text-sm/6 font-medium text-gray-900">
                                    Organization Name
                                </label>
                                <div className="mt-2">
                                    {!edit && <p>{contractor.organizationName ? contractor.organizationName : "Not set"}</p>}
                                    {edit && <input
                                        id="organizationName"
                                        name="organizationName"
                                        type="text"
                                        onChange={handleInput}
                                        autoComplete="organizationName"
                                        placeholder="organization / company / group"
                                        value={contractor.organizationName ?? ""}
                                        className="block w-full rounded-md border border-gray-400 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />}
                                </div>
                            </div>

                            <div className="sm:col-span-6">
                                <label htmlFor="organizationEmail" className="block text-sm/6 font-medium text-gray-900">
                                    Organization Email Address
                                </label>
                                <div className="mt-2">
                                    {!edit && <p>{contractor.organizationEmail ? contractor.organizationEmail : "Not set"}</p>}
                                    {edit && <input
                                        id="organizationEmail"
                                        name="organizationEmail"
                                        type="email"
                                        onChange={handleInput}
                                        autoComplete="organizationEmail"
                                        placeholder="email address"
                                        value={contractor.organizationEmail ?? ""}
                                        className="block w-full rounded-md border border-gray-400 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />}
                                </div>
                            </div>
                            <div className="sm:col-span-6">
                                <label htmlFor="organizationContactNumber" className="block text-sm/6 font-medium text-gray-900">
                                    Organization Contact Number
                                </label>
                                <div className="mt-2">
                                    {!edit && <p>{contractor.organizationContactNumber ? contractor.organizationContactNumber : "Not set"}</p>}
                                    {edit && <input
                                        id="organizationContactNumber"
                                        name="organizationContactNumber"
                                        type="tel"
                                        onChange={handleInput}
                                        autoComplete="organizationContactNumber"
                                        placeholder="phone number / mobile number"
                                        value={contractor.organizationContactNumber ?? ""}
                                        className="block w-full rounded-md border border-gray-400 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {edit && <div className="lg:hidden mt-6 flex items-center justify-end gap-x-6">
                {showCancel &&
                    <ActionButton handleClick={handleCancel} type={"Custom"} custom={{ label: 'Cancel', bgColor: 'bg-transparent', textColor: 'text-gray-900' }} />
                }
                <ActionButton handleClick={handleSubmit} type={"Save"} />
            </div>}
        </form>
    );
}