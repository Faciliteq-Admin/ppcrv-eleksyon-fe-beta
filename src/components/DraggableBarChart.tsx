import { useDraggable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function DraggableBarChart({ chart }: any) {
    const { attributes, listeners, setNodeRef, transform } = useSortable({ id: chart.id });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className="cursor-move bg-white p-4 rounded-lg shadow-lg"
            style={{ transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : 'none' }}
        >
            {chart.layout === "horizontal" &&
                <HorizontalBarChart chart={chart} />
            }
            {chart.layout !== "horizontal" &&
                <VerticalBarChart chart={chart} />
            }
        </div>
    );
}

const VerticalBarChart = ({ chart }: any) => {
    return (
        <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chart.data}>
                <XAxis dataKey="name"  />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pv" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>

    );
}

const HorizontalBarChart = ({ chart }: any) => {
    return (
        <ResponsiveContainer width="100%" height={200}>
            <BarChart
                layout="vertical"
                data={chart.data}
                // margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" interval={0} />
                <Tooltip />
                <Bar dataKey="pv" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    );
}