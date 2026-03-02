import './App.css'
import useMetricsSocket from './hooks/useMetricsSocket';
import DashboardLayout from './components/layout/dashboardLayout';
import CpuWidget from './components/widgets/CpuWidget';
import RamWidget from './components/widgets/RamWidget';

function App() {
  const {data, connected, cpuHistory, ramHistory} = useMetricsSocket();

  if (!data) return <div>Cargando...</div>

  return (
    <DashboardLayout connected={connected}>
      <CpuWidget cpuData={data.cpu} cpuHistory={cpuHistory} />
      <RamWidget ramData={data.memory} ramHistory={ramHistory} />
    </DashboardLayout>
  )
}

export default App
