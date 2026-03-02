import { useEffect, useRef, useState } from "react";
import type { CpuHistoryPoint, RamHistoryPoint, SystemMetricsSnapshot } from "../types/metrics";


const useMetricsSocket = () => {
    const [data, setData] = useState<SystemMetricsSnapshot | null>(null);
    const [connected, setconnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cpuHistory, setCpuHistory] = useState<CpuHistoryPoint[]>([]);
    const [ramHistory, setRamHistory] = useState<RamHistoryPoint[]>([]);

    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        let isMounted = true;
        
        const connect = () => {
            const ws = new WebSocket("ws://localhost:8000/ws/metrics");
            wsRef.current = ws;

            ws.onopen = () => {
                if (isMounted) {
                    console.log("Websocket conectado");
                    setconnected(true);
                    setError(null)
                }
            };

            ws.onmessage = (event) => {
                if (!isMounted) return;

                try {
                    const parsed: SystemMetricsSnapshot = JSON.parse(event.data)
                    setData(parsed)

                    const point: CpuHistoryPoint = {
                        timestamp: parsed.ts,
                        usagePercent:
                            typeof parsed.cpu?.usage_percent === "number"
                                ? parsed.cpu.usage_percent
                                : null
                    }

                    setCpuHistory((prev) => [...prev, point].slice(-30))

                    const pointRam: RamHistoryPoint = {
                        timestamp: parsed.ts,
                        used: 
                            typeof parsed.memory?.used === "number"
                                ? parsed.memory.used
                                : null,
                        total: typeof parsed.memory?.total === "number" ? parsed.memory.total : 0,
                        percent: 
                            typeof parsed.memory?.percent === "number"
                                ? parsed.memory.percent
                                : null
                    }

                    setRamHistory((prev) => [...prev, pointRam].slice(-30))
                } catch (err) {
                    console.log("Error parsing metrics", err)
                }
            };

            ws.onerror = () => {
                if (isMounted) {
                    setError("Error en Websocket");
                }
            }

            ws.onclose = () => {
                if (isMounted) {
                    console.log("Websocket cerrado");
                    setconnected(false);

                    setTimeout(() => {
                        connect();
                    }, 3000);
                }
            };
        };

        connect();

        return () => {
            isMounted = false;
            if (wsRef.current) {
                wsRef.current?.close();
            }
        }
        
    }, [])

    return {
        data,
        connected,
        cpuHistory,
        ramHistory,
        error
    }
}

export default useMetricsSocket;