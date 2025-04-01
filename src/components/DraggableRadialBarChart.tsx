import { useDraggable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { Legend, RadialBar, RadialBarChart, ResponsiveContainer, Tooltip } from "recharts";

export default function DraggableRadialBarChart({ chart }: any) {
    const { attributes, listeners, setNodeRef, transform } = useSortable({ id: chart.id });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className="cursor-move bg-white p-4 rounded-lg shadow-lg"
            style={{ transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : 'none' }}
        >
            <ResponsiveContainer width="100%">
                <RadialBarChart
                    data={chart.data}
                    startAngle={180}
                    endAngle={0}
                    outerRadius={90}
                    innerRadius={'25%'}
                // cy={'80%'}
                >
                    {/* <RadialBar label={{ fill: '#666', position: 'insideStart' }} background dataKey='uv' /> */}
                    <RadialBar background dataKey='pv' />
                    <Legend />
                    <Tooltip />
                </RadialBarChart>
            </ResponsiveContainer>
        </div>
    );
}