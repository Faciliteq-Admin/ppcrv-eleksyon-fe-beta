import { useDraggable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function DraggableLineChart({ chart }: any) {
    const { attributes, listeners, setNodeRef, transform } = useSortable({ id: chart.id });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className="cursor-move bg-white p-4 rounded-lg shadow-lg"
            style={{ transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : 'none' }}
        >
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chart.data}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}