import { useState } from "react";

type AlertType = "info" | "success" | "warning" | "error";

interface AlertProps {
    type: AlertType;
    message: string;
    duration?: number;
    onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ type = "info", message = "", duration = 3000, onClose = () => { } }) => {
    const [isVisible, setIsVisible] = useState(true);

    const runTimer = () => {
        let timer: NodeJS.Timeout | null = null;

        if (duration > 0) {
            timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => onClose?.(), 300);
            }, duration);

            return () => {
                if (timer) clearTimeout(timer);
            };
        }
    };

    runTimer();

    const typeStyles: Record<AlertType, String> = {
        info: "bg-blue-100 text-blue-700 border-blue-500",
        success: "bg-green-100 text-green-700 border-green-500",
        warning: "bg-yellow-100 text-yellow-700 border-yellow-500",
        error: "bg-red-100 text-red-700 border-red-500",
    };

    return (
        <div className={`flex items-center border-l-4 p-4 rounded mb-4 shadow-md transition-opacity duration-300 ` +
            `${isVisible ? "opacity-100" : "opacity-0"} ${typeStyles[type]}`} role="alert">
            <span className="flex-1">{message}</span>
            <button
                onClick={onClose}
                className="ml-4 text-lg font-bold text-gray-500 hover:text-gray-800 focus:outline-none"
            >
                &times;
            </button>
        </div>
    );
};

export default Alert;