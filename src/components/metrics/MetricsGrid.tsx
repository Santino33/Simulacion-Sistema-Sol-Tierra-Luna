import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSimulationStore } from '@/stores/simulationStore';

function formatVelocity(value: number): string {
  return value.toFixed(2);
}

function formatEnergy(value: number): string {
  return value.toExponential(3);
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds.toFixed(0)}s`;
  if (seconds < 3600) return `${(seconds / 60).toFixed(1)}min`;
  if (seconds < 86400) return `${(seconds / 3600).toFixed(1)}h`;
  return `${(seconds / 86400).toFixed(2)}d`;
}

export function MetricsGrid() {
  const time = useSimulationStore((state) => state.time);
  const initialEnergy = useSimulationStore((state) => state.initialEnergy);
  const currentEnergy = useSimulationStore((state) => state.currentEnergy);
  const energyError = useSimulationStore((state) => state.energyError);
  const velocities = useSimulationStore((state) => state.velocities);
  const fps = useSimulationStore((state) => state.fps);
  const status = useSimulationStore((state) => state.status);

  const errorVariant = energyError > 1 ? 'destructive' : energyError > 0.1 ? 'outline' : 'secondary';

  return (
    <motion.div
      className="grid grid-cols-2 gap-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="col-span-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Tiempo simulación</CardTitle>
            <Badge variant={status === 'running' ? 'default' : 'secondary'}>
              {status === 'running' ? 'Activa' : status === 'paused' ? 'Pausada' : 'Inactiva'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-mono">{formatTime(time)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Energía Total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-mono">{formatEnergy(currentEnergy)} J</div>
          <div className="text-xs text-muted-foreground mt-1">
            Inicial: {formatEnergy(initialEnergy)} J
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Error Energético</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant={errorVariant} className="text-lg">
            {energyError.toFixed(6)}%
          </Badge>
        </CardContent>
      </Card>

      {Object.entries(velocities).map(([bodyName, vel]) => (
        <Card key={bodyName}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{bodyName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-sm font-mono">
              |v| = {formatVelocity(vel.speed)} m/s
            </div>
            <div className="text-xs text-muted-foreground grid grid-cols-3 gap-1">
              <span>x: {formatVelocity(vel.x)}</span>
              <span>y: {formatVelocity(vel.y)}</span>
              <span>z: {formatVelocity(vel.z)}</span>
            </div>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Rendimiento</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant="outline" className="text-lg">
            {fps} FPS
          </Badge>
        </CardContent>
      </Card>
    </motion.div>
  );
}