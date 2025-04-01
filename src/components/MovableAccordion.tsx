import { ReactNode } from "react";
import { useAccordion } from "../contexts/AccordionContext";

const MovableAccordion = ({ children }: { children: ReactNode }) => {
    return (
        <div className="w-full bg-white rounded-lg">
            {children}
        </div>
    );
}

function AccordionItem({ index, children }: any) {
    const { moveItem } = useAccordion();

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData("text/plain", index.toString());
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const fromIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
        moveItem(fromIndex, index);
    };

    return (
        <div
            className="border rounded-md mb-2 p-3 w-full bg-gray-200 shadow-sm cursor-grab"
            draggable
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragStart={handleDragStart}
        >
            {children}
        </div>
    );
}

export {
    AccordionItem,
    MovableAccordion,
}