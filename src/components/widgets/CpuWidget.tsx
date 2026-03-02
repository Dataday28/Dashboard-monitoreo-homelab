import type { CpuHistoryPoint, CpuInfo } from "../../types/metrics";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";



interface CpuWidgetProps {
    cpuData: CpuInfo
    cpuHistory: CpuHistoryPoint[]
}

function formatTime(tsSeconds: number) {
    // backend manda ts en segundos (time.time()), así que *1000
    const d = new Date(tsSeconds * 1000);
    return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

const CpuWidget = ({ cpuData, cpuHistory }: CpuWidgetProps) => {
    const usage = Math.round(cpuData.usage_percent);

    const chartData = cpuHistory.map((p) => ({
        timeStamp: p.timestamp,
        timeLabel: formatTime(p.timestamp),
        usagePercent: p.usagePercent ?? 0
    }));

    const barColor = usage < 50 ? "#22c55e" : usage < 80 ? "#facc15" : "#ef4444";

    const neonGreen = "#22c55e"

    return (
        <div className="bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-800 flex flex-col justify-between">
            <div className="text-sm text-gray-400 uppercase tracking-wider">
                CPU Usage
            </div>

            <div className="flex items-end justify-between mt-4">
                <span className="text-5xl md:text-6xl font-bold text-white">
                    {usage}
                    <span className="text-2xl ml-1 text-gray-400">%</span>
                </span>
            </div>

            <div className="mt-6 w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                <div className="h-3 rounded-full transition-all duration-500" style={{ width: `${usage}%`, backgroundColor: barColor }} />
            </div>

            <div className="mt-6 h-28">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <XAxis dataKey="timeLabel" tickLine={false} axisLine={false} minTickGap={20} />
                        <YAxis domain={[0, 100]} tickLine={false} axisLine={false} width={30} />
                        <Tooltip labelFormatter={(_, payload) => {
                            const ts = payload?.[0]?.payload?.timestamp;
                            return ts ? formatTime(ts) : "";
                            }}
                            formatter={(value) => {
                                const n = typeof value === "number" ? value : Number(value);
                                if (!Number.isFinite(n)) return ["-", "CPU"];
                                return [`${Math.round(n)}%`, "CPU"];
                            }}
                        />
                        <Line type="monotone" dataKey="usagePercent" stroke={neonGreen} strokeWidth={2} dot={false} isAnimationActive={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default CpuWidget;