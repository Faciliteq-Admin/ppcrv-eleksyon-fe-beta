import { useContext, useState } from "react";
import { useProjectSetup } from "../contexts/ProjectSetupContext";
import Alert from "./Alert";

// const steps = [
//   { id: 1, label: "Step 1", content: "This is Step 1 content." },
//   { id: 2, label: "Step 2", content: "This is Step 2 content." },
//   { id: 3, label: "Step 3", content: "This is Step 3 content." },
// ];

export default function MultiStepForm(props: any) {
    const [currentStep, setCurrentStep] = useState(0);
    const { projectData } = useProjectSetup();
    const [alerts, setAlerts] = useState<any[]>([]);


    const checkData = () => {
        let proceed = true;
        if (currentStep === 0 && (!projectData || !projectData.project || !projectData.project.name)) {
            addAlert("error", "Missing required field", 1500);
            return false;
        }

        if (currentStep === 1) {
            if (!projectData.structures || projectData.structures === 0) {
                addAlert("error", "Missing required field", 1500);
                return false;
            }

            for (const s of projectData.structures) {
                if (!s.name) {
                    proceed = false;
                    addAlert("error", "Missing required field", 1500);
                    break;
                }
            };
            return proceed;
        }

        return proceed;
    }

    const nextStep = () => {
        console.log(projectData);
        if (currentStep < props.steps.length - 1) {
            // if (checkData()) {
            setCurrentStep((prev) => prev + 1);
            // }
        }

    };

    const prevStep = () => {
        console.log(projectData);
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const setStep = (idx: number) => {
        console.log(projectData);
        // if (currentStep < idx) {
        //     if (checkData()) {
        //         setCurrentStep((prev) => prev + 1);
        //     } 
        // } else {
        setCurrentStep(idx);
        // }
    }

    const addAlert = (type: "info" | "success" | "warning" | "error", message: string, duration: number) => {
        const id = Date.now();
        setAlerts((prev) => [...prev, { id, type, message, duration }]);
        console.log("add ", alerts);

    };

    const removeAlert = (id: any) => {
        console.log(id);
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));

    };

    return (
        <div className="mx-auto">
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
            <div className="grid grid-cols-4 gap-4">
                {props.steps && props.steps.map((step: any, index: number) => (
                    <div
                        key={index}
                        onClick={() => setStep(index)}
                        className={`h-10 flex items-center justify-center text-white border rounded-sm font-bold text-sm ${index === currentStep ? "bg-blue-500" : "bg-gray-500"}`}
                    >
                        {step.label}
                    </div>
                ))}
            </div>

            <div className="my-6 text-center shadow-lg rounded-xl">
                {props.steps && <div className="mt-4">
                    {/* <h2 className="text-xl font-semibold">{props.steps[currentStep].label}</h2> */}
                    {props.steps[currentStep].form}
                </div>}
            </div>

            <div className="flex justify-between">
                <button onClick={prevStep} disabled={currentStep === 0} className="px-4 py-2 rounded-md text-white bg-blue-700 disabled:opacity-50">
                    Previous
                </button>
                {currentStep !== props.steps.length - 1 &&
                    <button onClick={nextStep} className="px-4 py-2 rounded-md text-white bg-blue-700 disabled:opacity-50">
                        Next
                    </button>
                }
                {currentStep === props.steps.length - 1 &&
                    <button onClick={props.handleSave} className="px-4 py-2 rounded-md text-white bg-green-700 disabled:opacity-50">
                        Save
                    </button>
                }
            </div>
        </div>
    );
}
