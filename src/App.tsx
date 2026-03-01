import './App.css'
import useMetricsSocket from './hooks/useMetricsSocket';
import DashboardLayout from './components/layout/dashboardLayout';
import CpuWidget from './components/widgets/CpuWidget';

function App() {
  const {data, connected, cpuHistory} = useMetricsSocket();

  if (!data) return <div>Cargando...</div>

  return (
    <DashboardLayout connected={connected}>
      <CpuWidget cpuData={data.cpu} cpuHistory={cpuHistory} />
    </DashboardLayout>
  )
}

export default App
