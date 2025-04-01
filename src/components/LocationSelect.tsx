import { ComboboxOption, ComboboxOptions, Select } from "@headlessui/react";
export default function LocationSelect({ data, handleSelectLocation, setIsDropdownOpen, type }: any) {
    return (
        <ul className="absolute z-10 mt-1 w-64 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
            {data.map((option: any, index: number) => (
                <li
                    key={index}
                    onClick={() => handleSelectLocation(option, type)}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                >
                    {option.name}
                </li>
            ))}
        </ul>
    );
}


function LocationCombobox({ data }: any) {
    return (
        <ComboboxOptions
            anchor={"bottom start"}
            className="absolute z-10 mt-1 w-64 bg-white border border-gray-300 rounded shadow-lg max-h-40 overflow-y-auto"
        >
            {data.map((option: any, index: number) => (
                <ComboboxOption
                    key={index}
                    value={option}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                >
                    {option.name}
                </ComboboxOption>
            ))}
        </ComboboxOptions>
    );
}

export { LocationCombobox }