import type React from "react";
import type { MemoryInfo, RamHistoryPoint } from "../../types/metrics";
import { useMemo } from "react";
import type { TooltipProps } from "recharts";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

interface RamWidgetProps {
    ramData: MemoryInfo
    ramHistory: RamHistoryPoint[]
}

type ChartPoint = {
    timestamp: number;
    timeLabel: string;
    usagePercent: number;
    usedBytes: number | null;
    totalBytes: number;
};

const bytesToGB = (bytes: number) => bytes / (1024 ** 3);

const formatGB = (bytes: number) => {
    const gb = bytesToGB(bytes);
    return gb >= 10 ? `${gb.toFixed(0)}GB` : `${gb.toFixed(1)}GB`;
};

const safePercent = (usedBytes: number, totalBytes: number) => {
    if (!Number.isFinite(usedBytes) || !Number.isFinite(totalBytes) || totalBytes <= 0) return 0;
    const p = (usedBytes / totalBytes) * 100;
    return Math.max(0, Math.min(100, p));
};

// Si ya tienes tu formatTime(ts), úsalo. Aquí dejo uno simple:
const formatTime = (ts: number) => {
    const ms = ts > 1e12 ? ts : ts * 1000; // acepta seconds o ms
    const d = new Date(ms);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const RamWidget: React.FC<RamWidgetProps> = ({ ramData, ramHistory }) => {

    const chartData: ChartPoint[] = useMemo(() => {
        const history = (ramHistory ?? []).filter(Boolean);

        return history.map((p) => {
            const percent = typeof p.percent === "number" ? p.percent : safePercent(p.used ?? 0, p.total);

            return {
                timestamp: p.timestamp,
                timeLabel: formatTime(p.timestamp),
                usagePercent: percent,
                usedBytes: p.used,
                totalBytes: p.total
            };
        });
    }, [ramHistory]);

    const current = useMemo(() => {
        if (chartData.length > 0) {
            const last = chartData[chartData.length - 1];

            return {
                percent: last.usagePercent,
                usedBytes: last.usedBytes,
                totalBytes: last.totalBytes
            };
        }

        if (ramData) {
            const percent = typeof ramData.percent === "number" ? ramData.percent : safePercent(ramData.used, ramData.total);

            return {
                percent,
                usedBytes: ramData.used,
                totalBytes: ramData.total
            };
        }

        return { percent: 0, usedBytes: 0, totalBytes: 0 }
    }, [chartData, ramData])

    const ramFormatter: TooltipProps<number, string>["formatter"] = (value, name, item) => {
        const n = typeof value === "number" ? value : Number(value);

        if (!Number.isFinite(n)) return ["-", name ?? "RAM"];

        const used = item?.payload?.usedBytes;
        const total = item?.payload.totalBytes;

        const extra = typeof used === "number" && typeof total === "number" ? ` (${formatGB(used)} / ${formatGB(total)})` : "";

        return [`${Math.round(n)}%${extra}`, name ?? "RAM"]
    };

    const ramStroke = "#7c3aed"
    const ramFill = "#7c3aed"

    return (
        <div className="bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-800 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="text-sm font-medium text-gray-400">
                        RAM
                    </div>

                    <div className="mt-1 flex items-end gap-2">
                        <div className="text-4xl font-semibold text-white">
                            {Math.round(current.percent)}%
                        </div>
                        <div className="pb-1 text-sm text-gray-300">uso</div>
                    </div>

                    <div className="mt-1 text-sm text-gray-400">
                        <span className="font-medium">Usado:</span> {formatGB(current.usedBytes ?? 0)}{" "}
                        <span className="text-gray-400">/</span>{" "}
                        <span className="font-medium">Total:</span> {formatGB(current.totalBytes)}
                    </div>
                </div>

                {/* Badge opcional */}
                <div className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-violet-700">
                    Memory
                </div>
            </div>

            <div className="mt-4 h-36">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <XAxis dataKey="timeLabel" tickLine={false} axisLine={false} minTickGap={20} />
                        <YAxis domain={[0, 100]} tickLine={false} axisLine={false} width={30} />
                        <Tooltip
                            labelFormatter={(_, payload) => {
                                const ts = payload?.[0]?.payload?.timestamp;
                                return typeof ts === "number" ? formatTime(ts) : "";
                            }}
                            formatter={ramFormatter}
                        />
                        <Area
                            type="monotone"
                            dataKey="usagePercent"
                            stroke={ramStroke}
                            strokeWidth={2}
                            fill={ramFill}
                            fillOpacity={0.18}
                            dot={false}
                            isAnimationActive={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>

                {chartData.length === 0 && (
                    <div className="mt-2 text-xs text-gray-400">
                        Sin historial aún (mostrando solo datos actuales).
                    </div>
                )}
            </div>
        </div>
    )
}

export default RamWidget;