import type { ReactNode } from "react";

interface DashboardLayoutProps {
    children: ReactNode;
    connected: boolean;
}

const DashboardLayout = ({children, connected}: DashboardLayoutProps) => {

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
            <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-amber-900">
                <h1 className="text-xl md:text-2xl font-semibold tracking-wide">
                    Homelab Dashboard
                </h1>

                <div className="flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-full transition-all duration-300 ${connected ? "bg-green-500 shadow-lg shadow-green-500/50" : "bg-red-500 shadow-lg shadow-red-500/50"}`} />
                    <span className="text-sm text-gray-400">
                        {connected ? "Conectado" : "Desconectado"}
                    </span>
                </div>
            </header>

            <main className="flex-1 p-6">
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default DashboardLayout;