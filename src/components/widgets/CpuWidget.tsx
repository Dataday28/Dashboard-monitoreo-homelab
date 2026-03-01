import type { CpuHistoryPoint, CpuInfo } from "../../types/metrics";



interface CpuWidgetProps {
    cpuData: CpuInfo
    cpuHistory: CpuHistoryPoint[]
}

const CpuWidget = ({cpuData, cpuHistory}: CpuWidgetProps) => {
    const usage = Math.round(cpuData.usage_percent);

    console.log(cpuHistory)

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
                <div className="h-3 rounded-full transition-all duration-500" style={{width: `${usage}%`, backgroundColor: usage < 50 ? "#22c55e" : usage < 80 ? "#facc15" : "#ef4444"}}/>
            </div>
        </div>
    );
}

export default CpuWidget;