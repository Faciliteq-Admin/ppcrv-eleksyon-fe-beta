import { useDraggable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export default function DraggablePieChart({ chart }: any) {
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
                <PieChart data={chart.data}>
                    <Pie data={chart.data} dataKey="value" nameKey="name" fill="#8884d8" />
                    {/* <Pie data={chart.data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#82ca9d" label /> */}
                    <Legend />
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}