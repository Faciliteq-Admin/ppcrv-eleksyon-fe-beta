import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";

export default function ValidatorEditForm({ admin, handleInput, edit, showPassword }: any) {

    const hidePassword = () => {
        handleInput({
            target: {
                name: 'temporaryPassword',
                value: null,
            }
        });
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
                                {!edit && <p>{admin.firstName ? admin.firstName : "Not set"}</p>}
                                {edit && <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    onChange={handleInput}
                                    autoComplete="firstName"
                                    value={admin.firstName ?? ""}
                                    className="block w-full rounded-md border border-gray-400 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                                />}
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="middleName" className="block text-sm/6 font-medium text-gray-900">
                                Middle name
                            </label>
                            <div className="mt-2">
                                {!edit && <p>{admin.middleName ? admin.middleName : "Not set"}</p>}
                                {edit && <input
                                    id="middleName"
                                    name="middleName"
                                    type="text"
                                    onChange={handleInput}
                                    autoComplete="middleName"
                                    value={admin.middleName ?? ""}
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
                                {!edit && <p>{admin.lastName ? admin.lastName : "Not set"}</p>}
                                {edit && <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    onChange={handleInput}
                                    autoComplete="lastName"
                                    value={admin.lastName ?? ""}
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
                                {!edit && <p>{admin.email ? admin.email : "Not set"}</p>}
                                {edit && <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    onChange={handleInput}
                                    autoComplete="email"
                                    value={admin.email ?? ""}
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
                                {!edit && <p>{admin.mobile ? admin.mobile : "Not set"}</p>}
                                {edit && <input
                                    id="mobile"
                                    name="mobile"
                                    type="number"
                                    onChange={handleInput}
                                    autoComplete="mobile"
                                    value={admin.mobile ?? ""}
                                    className="block w-full rounded-md border border-gray-400 px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                                />}
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="mobile" className="flex text-sm/6 font-medium text-gray-900">
                                Validator Type
                                {edit && <p className="text-red-500 ml-1">*</p>}
                            </label>
                            <div className="mt-2">
                                {!edit && <p>{admin.role ? admin.role : "Not set"}</p>}
                                {edit && <select
                                    id="role"
                                    name="role"
                                    value={admin.role}
                                    onChange={handleInput}
                                    className="px-4 py-2 border border-gray-300 rounded-md"
                                >
                                    <option value={"Initial Validator"}>Initial Validator</option>
                                    <option value={"Final Validator"}>Final Validator</option>
                                </select>}
                            </div>
                        </div>



                        {admin.tempPassword && !edit &&
                            <div className="sm:col-span-2">
                                <label htmlFor="tempPassword" className="flex text-sm/6 font-medium text-gray-900">
                                    Password
                                </label>
                                <div className="mt-2 flex gap-2">
                                    <p>{admin.temporaryPassword ? atob(admin.temporaryPassword) : "*".repeat(6)}</p>
                                    {!admin.temporaryPassword && <button onClick={showPassword}>
                                        <EyeIcon className="size-5 text-blue-500" />
                                    </button>}
                                    {admin.temporaryPassword && <button onClick={hidePassword}>
                                        <EyeSlashIcon className="size-5 text-blue-500" />
                                    </button>}
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </form>
    );
}
