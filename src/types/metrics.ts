

export interface CpuInfo {
    usage_percent: number;
    per_core_percent: number[];
    freq_current_mhz?: number | null;
    freq_min_mhz?: number | null;
    freq_max_mhz?: number | null;
    cores_physical?: number | null;
    cores_logical: number;
    load_avg_1?: number | null;
    load_avg_5?: number | null;
    load_avg_15?: number | null;
}

export interface MemoryInfo {
    total: number;
    available: number;
    used: number;
    percent: number;
    swap_total: number;
    swap_used: number;
    swap_percent: number;
}

export interface DiskPartitionInfo {
    device: string;
    mountpoint: string;
    fstype: string;
    total: number;
    used: number;
    free: number;
    percent: number;
}

export interface TemperatureReading {
    name: string;
    label: string;
    current: number;
    high?: number | null;
    critical?: number | null;
}

export interface NetworkInfo {
    bytes_sent: number;
    bytes_recv: number;
    packets_sent: number;
    packets_recv: number;
    errin: number;
    errout: number;
    dropin: number;
    dropout: number;
}

export interface SystemMetricsSnapshot {
    ts: number;
    cpu: CpuInfo;
    memory: MemoryInfo;
    disks: DiskPartitionInfo[];
    disk_io: Record<string, any>;
    temps: TemperatureReading[];
    network: NetworkInfo;
}

export interface CpuHistoryPoint {
    timestamp: number;
    usagePercent: number | null
}

export interface RamHistoryPoint {
    timestamp: number;
    used: number | null
    total: number
    percent: number | null
}