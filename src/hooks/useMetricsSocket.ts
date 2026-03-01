import { useEffect, useRef, useState } from "react";
import type { SystemMetricsSnapshot } from "../types/metrics";


const useMetricsSocket = () => {
    const [data, setData] = useState<SystemMetricsSnapshot | null>(null);
    const [connected, setconnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
        error
    }
}

export default useMetricsSocket;