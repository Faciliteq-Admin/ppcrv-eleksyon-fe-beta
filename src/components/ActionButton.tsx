export default function ({ handleClick, type, custom }: { handleClick: any, custom?: any, type: "Save" | "Edit" | "Cancel" | "Custom" }) {

    let label = type;
    let textColor = "text-white";
    let bgColor = "bg-indigo-600";
    let bgColorHover = "bg-indigo-500";
    let bgColorFocus = "outline-indigo-600";

    if (type === "Custom") {
        if (custom && custom.label) label = custom.label;
        if (custom && custom.bgColor) bgColor = custom.bgColor;
        if (custom && custom.textColor) textColor = custom.textColor;
        if (custom && custom.bgColorHover) bgColorHover = custom.bgColorHover;
        if (custom && custom.bgColorFocus) bgColorFocus = custom.bgColorFocus;
    } else if (type === "Cancel") {
        bgColor = "bg-gray-600";
        bgColorHover = "bg-gray-500";
        bgColorFocus = "outline-gray-600";
    }

    return (
        <div className="flex space-x-3">
            <button
                type="submit"
                onClick={handleClick}
                className={`rounded-md ${bgColor} px-3 py-2 max-md:text-xs text-sm font-semibold ${textColor} shadow-sm hover:${bgColorHover} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:${bgColorFocus}`}
            >
                {label}
            </button>
        </div>
    );
}