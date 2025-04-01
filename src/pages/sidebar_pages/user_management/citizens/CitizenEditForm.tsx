import { useState } from "react";
import { getRequest } from "../../../../utils/apiHelpers";
import { formatDateString } from "../../../../utils/functions";
import LocationSelect from "../../../../components/LocationSelect";
import ActionButton from "../../../../components/ActionButton";

export default function CitizenEditForm({ citizen, setCitizen, edit, handleInput, handleSubmit, handleSelect, handleCancel, showCancel }: any) {

    const [provs, setProvs] = useState<any[]>([]);
    const [cityMuns, setCityMuns] = useState<any[]>([]);
    const [barangays, setBarangays] = useState<any[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState("");
    let processing = false;

    const handleSelectLocation = (option: any, type: "barangay" | "cityMun" | "prov") => {
        setIsDropdownOpen("");
        if (option) {
            if (type === "prov") {
                if (citizen.provName === option.name) return;
                setCitizen((prevData: any) => ({
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
                if (citizen.cityMunName === option.name) return;
                setCitizen((prevData: any) => ({
                    ...prevData,
                    cityMunId: option.id,
                    cityMunName: option.name,
                    cityMunCode: option.code,
                    barangayId: "",
                    barangayName: "",
                }));
            } else {
                if (citizen.barangayName === option.name) return;
                setCitizen((prevData: any) => ({
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
            parent = `&parent=${citizen.cityMunCode}`;
        } else if (type === 'citymun') {
            if (e.target.value === "") setCityMuns([]);
            parent = `&parent=${citizen.provCode}`;
        } else {
            if (e.target.value === "") setProvs([]);
        }

        if (e.target.value !== "") {
            setIsDropdownOpen(type);
            if (!processing) {
                let response = await getRequest(`/locations/${type}s?name=${e.target.value}` + parent);
                // console.log(response);

                if (response.data) {
                    if (type === 'barangay') {
                        setBarangays(response.data.items);
                    } else if (type === 'citymun') {
                        setCityMuns(response.data.items);
                    } else {
                        setProvs(response.data.items);
                    }
                }
            }
        }
    }

    return (
        <form className="">
            <div className="space-y-8">
                <div className="border-b border-gray-900/10 pb-12 md:border md:rounded-lg md:border-gray-300 md:p-4">
                    <h2 className="text-base/7 font-semibold text-gray-900">Personal Information</h2>
                    <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                        <div className="sm:col-span-2">
                            <label htmlFor="firstName" className="flex text-sm/6 font-medium text-gray-900">
                                First name
                                {edit && <p className="text-red-500 ml-1">*</p>}
                            </label>
                            <div className="mt-2">
                                {!edit && <p>{citizen.firstName ? citizen.firstName : "Not set"}</p>}
                                {edit && <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    onChange={handleInput}
                                    autoComplete="firstName"
                                    value={citizen.firstName ?? ""}
                                    className="block w-full rounded-md border border-gray-400 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                                />}
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="middleName" className="block text-sm/6 font-medium text-gray-900">
                                Middle name
                            </label>
                            <div className="mt-2">
                                {!edit && <p>{citizen.middleName ? citizen.middleName : "Not set"}</p>}
                                {edit && <input
                                    id="middleName"
                                    name="middleName"
                                    type="text"
                                    onChange={handleInput}
                                    autoComplete="middleName"
                                    value={citizen.middleName ?? ""}
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
                                {!edit && <p>{citizen.lastName ? citizen.lastName : "Not set"}</p>}
                                {edit && <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    onChange={handleInput}
                                    autoComplete="lastName"
                                    value={citizen.lastName ?? ""}
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
                                {!edit && <p>{citizen.email ? citizen.email : "Not set"}</p>}
                                {edit && <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    onChange={handleInput}
                                    autoComplete="email"
                                    value={citizen.email ?? ""}
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
                                {!edit && <p>{citizen.mobile ? citizen.mobile : "Not set"}</p>}
                                {edit && <input
                                    id="mobile"
                                    name="mobile"
                                    type="number"
                                    onChange={handleInput}
                                    autoComplete="mobile"
                                    value={citizen.mobile ?? ""}
                                    className="block w-full rounded-md border border-gray-400 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                                />}
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="birthdate" className="flex text-sm/6 font-medium text-gray-900">
                                Birthdate
                            </label>
                            <div className="mt-2">
                                {!edit && <p>{citizen.birthdate ? formatDateString(citizen.birthdate, 'MMM DD, YYYY') : "Not set"}</p>}
                                {edit && <input
                                    id="birthdate"
                                    name="birthdate"
                                    type="date"
                                    onChange={handleInput}
                                    autoComplete="birthdate"
                                    value={citizen.birthdate ? formatDateString(citizen.birthdate, 'YYYY-MM-DD') : ""}
                                    className="block w-full rounded-md border border-gray-400 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                                />}
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="gender" className="flex text-sm/6 font-medium text-gray-900">
                                Gender
                            </label>
                            <div className="mt-2">
                                {!edit && <p>{citizen.gender ? citizen.gender : "Not set"}</p>}
                                {edit && <select
                                    id="gender"
                                    name="gender"
                                    value={citizen.gender ?? ""}
                                    onChange={handleSelect}
                                    className="px-2 py-2 w-full border border-indigo-300 rounded-md text-gray-900 shadow-sm ring-1 ring-inset ring-indigo-300 focus:ring-2 focus:ring-inset focus:ring-indigo-300"
                                // className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6"
                                >
                                    <option></option>
                                    <option>Male</option>
                                    <option>Female</option>
                                </select>}
                            </div>
                        </div>

                    </div>
                </div>

                <div className="grid gap-x-6 gap-y-6">
                    <div className="md:border md:rounded-lg md:border-gray-300 md:p-4">
                        <h2 className="text-base/7 font-semibold text-gray-900">Location Information</h2>

                        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-6">
                            <div className="sm:col-span-6">
                                <label htmlFor="provName" className="flex text-sm/6 font-medium text-gray-900">
                                    Province
                                    {edit && <p className="text-red-500 ml-1">*</p>}
                                </label>
                                <div className="relative mt-2">
                                    {!edit && <p>{citizen.provName ? citizen.provName : "Not set"}</p>}
                                    {edit && <input
                                        id="provName"
                                        name="provName"
                                        type="text"
                                        autoCapitalize="words"
                                        placeholder="province"
                                        value={citizen.provName ?? ""}
                                        onChange={(e) => handleSearchLocation(e, "province")}
                                        className="block w-full rounded-md border border-gray-400 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />}
                                    {isDropdownOpen === 'province' && (
                                        <LocationSelect type={'prov'} data={provs} handleSelectLocation={handleSelectLocation} setIsDropdownOpen={setIsDropdownOpen} />
                                    )}
                                </div>
                            </div>

                            <div className="sm:col-span-6">
                                <label htmlFor="cityMunName" className="flex text-sm/6 font-medium text-gray-900">
                                    City / Municipality
                                    {edit && <p className="text-red-500 ml-1">*</p>}
                                </label>
                                <div className="relative mt-2">
                                    {!edit && <p>{citizen.cityMunName ? citizen.cityMunName : "Not set"}</p>}
                                    {edit && <input
                                        id="cityMunName"
                                        name="cityMunName"
                                        type="text"
                                        autoCapitalize="words"
                                        placeholder="city / municipality"
                                        value={citizen.cityMunName ?? ""}
                                        onChange={(e) => handleSearchLocation(e, "citymun")}
                                        className="block w-full rounded-md border border-gray-400 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />}
                                    {isDropdownOpen === 'citymun' && citizen.provId && (
                                        <LocationSelect type={'cityMun'} data={cityMuns} handleSelectLocation={handleSelectLocation} setIsDropdownOpen={setIsDropdownOpen} />
                                    )}
                                </div>
                            </div>
                            <div className="sm:col-span-6">
                                <label htmlFor="barangayName" className="flex text-sm/6 font-medium text-gray-900">
                                    Barangay
                                    {edit && <p className="text-red-500 ml-1">*</p>}
                                </label>
                                <div className="relative mt-2">
                                    {!edit && <p>{citizen.barangayName ? citizen.barangayName : "Not set"}</p>}
                                    {edit && <input
                                        id="barangayName"
                                        name="barangayName"
                                        type="text"
                                        autoCapitalize="words"
                                        placeholder="barangay"
                                        value={citizen.barangayName ?? ""}
                                        onChange={(e) => handleSearchLocation(e, "barangay")}
                                        className={`block w-full rounded-md border border-gray-400 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6`}
                                    />}
                                    {isDropdownOpen === 'barangay' && citizen.cityMunId && (
                                        <LocationSelect type={'barangay'} data={barangays} handleSelectLocation={handleSelectLocation} setIsDropdownOpen={setIsDropdownOpen} />
                                    )}
                                </div>
                            </div>
                            <div className="sm:col-span-6">
                                <label htmlFor="address1" className="flex text-sm/6 font-medium text-gray-900">
                                    Address 1
                                    {edit && <p className="text-red-500 ml-1">*</p>}
                                </label>
                                <div className="relative mt-2">
                                    {!edit && <p>{citizen.address1 ? citizen.address1 : "Not set"}</p>}
                                    {edit && <input
                                        id="address1"
                                        name="address1"
                                        type="text"
                                        autoCapitalize="words"
                                        placeholder="village / subdivision / street"
                                        value={citizen.address1 ?? ""}
                                        onChange={handleInput}
                                        className={`block w-full rounded-md border border-gray-400 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6`}
                                    />}
                                </div>
                            </div>
                            <div className="sm:col-span-6">
                                <label htmlFor="address2" className="flex text-sm/6 font-medium text-gray-900">
                                    Address 2
                                </label>
                                <div className="relative mt-2">
                                    {!edit && <p>{citizen.address2 ? citizen.address2 : "Not set"}</p>}
                                    {edit && <input
                                        id="address2"
                                        name="address2"
                                        type="text"
                                        autoCapitalize="words"
                                        placeholder="lot # / block # / house #"
                                        value={citizen.address2 ?? ""}
                                        onChange={handleInput}
                                        className={`block w-full rounded-md border border-gray-400 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6`}
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