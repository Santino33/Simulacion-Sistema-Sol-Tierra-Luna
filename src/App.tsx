import { motion } from 'framer-motion';
import { Canvas3D } from '@/components/simulation/Canvas3D';
import { ControlPanel } from '@/components/controls/ControlPanel';
import { Comparator } from '@/components/controls/Comparator';
import { EnergyChart } from '@/components/metrics/EnergyChart';
import { MetricsGrid } from '@/components/metrics/MetricsGrid';
import { Switch } from '@/components/ui/switch';
import { useSimulationStore } from '@/stores/simulationStore';
import { Sun, Moon } from 'lucide-react';

export default function App() {
  const isDarkMode = useSimulationStore((state) => state.isDarkMode);
  const setDarkMode = useSimulationStore((state) => state.setDarkMode);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-background text-foreground">
        <motion.header
          className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <motion.h1
              className="text-2xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Simulación Sistema Sol-Tierra-Luna
            </motion.h1>

            <div className="flex items-center gap-3">
              <Sun className="h-5 w-5 text-yellow-500" />
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={setDarkMode}
              />
              <Moon className="h-5 w-5 text-slate-400" />
            </div>
          </div>
        </motion.header>

        <main className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <motion.div
              className="lg:col-span-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="rounded-xl border bg-card overflow-hidden" style={{ height: '600px' }}>
                <Canvas3D className="w-full h-full" />
              </div>
            </motion.div>

            <motion.div
              className="lg:col-span-4 space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <ControlPanel />
            </motion.div>

            <motion.div
              className="lg:col-span-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <EnergyChart />
            </motion.div>

            <motion.div
              className="lg:col-span-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <MetricsGrid />
            </motion.div>

            <motion.div
              className="lg:col-span-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <Comparator />
            </motion.div>
          </div>
        </main>

        <footer className="border-t mt-12 py-6">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>Integrador: Runge-Kutta 4to orden (RK4) | Gravedad: Ley de gravitación universal</p>
            <p className="mt-1">Sistema de tres cuerpos (Sol-Tierra-Luna)</p>
          </div>
        </footer>
      </div>
    </div>
  );
}