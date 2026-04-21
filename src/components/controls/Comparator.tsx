import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useSimulationStore } from '@/stores/simulationStore';
import { integrateRK4 } from '@/lib/physics/integrator';
import { computeEnergyWithError } from '@/lib/physics/energy';
import { INITIAL_CONDITIONS, BODY_NAMES } from '@/lib/physics/constants';
import type { BodyName, RunResult } from '@/types/physics';

const DT_OPTIONS = [
  { label: '1s', value: 1 },
  { label: '60s (1min)', value: 60 },
  { label: '600s (10min)', value: 600 },
  { label: '3600s (1h)', value: 3600 },
  { label: '86400s (1 día)', value: 86400 },
];

const SIMULATION_STEPS = 100;

interface BodyState {
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
  mass: number;
  name: BodyName;
}

function createInitialBodies(): BodyState[] {
  return [
    {
      position: { x: INITIAL_CONDITIONS.SUN.position.x, y: INITIAL_CONDITIONS.SUN.position.y, z: INITIAL_CONDITIONS.SUN.position.z },
      velocity: { x: INITIAL_CONDITIONS.SUN.velocity.x, y: INITIAL_CONDITIONS.SUN.velocity.y, z: INITIAL_CONDITIONS.SUN.velocity.z },
      mass: INITIAL_CONDITIONS.SUN.mass,
      name: BODY_NAMES.SUN,
    },
    {
      position: { x: INITIAL_CONDITIONS.EARTH.position.x, y: INITIAL_CONDITIONS.EARTH.position.y, z: INITIAL_CONDITIONS.EARTH.position.z },
      velocity: { x: INITIAL_CONDITIONS.EARTH.velocity.x, y: INITIAL_CONDITIONS.EARTH.velocity.y, z: INITIAL_CONDITIONS.EARTH.velocity.z },
      mass: INITIAL_CONDITIONS.EARTH.mass,
      name: BODY_NAMES.EARTH,
    },
    {
      position: { x: INITIAL_CONDITIONS.MOON.position.x, y: INITIAL_CONDITIONS.MOON.position.y, z: INITIAL_CONDITIONS.MOON.position.z },
      velocity: { x: INITIAL_CONDITIONS.MOON.velocity.x, y: INITIAL_CONDITIONS.MOON.velocity.y, z: INITIAL_CONDITIONS.MOON.velocity.z },
      mass: INITIAL_CONDITIONS.MOON.mass,
      name: BODY_NAMES.MOON,
    },
  ];
}

export function Comparator() {
  const addRunResult = useSimulationStore((state) => state.addRunResult);
  const runResults = useSimulationStore((state) => state.runResults);
  const clearRunResults = useSimulationStore((state) => state.clearRunResults);
  const initialEnergy = useSimulationStore((state) => state.initialEnergy);

  const [selectedDt, setSelectedDt] = useState<number>(3600);
  const [isRunning, setIsRunning] = useState(false);

  const runComparison = async (dt: number) => {
    const startTime = performance.now();
    let bodies = createInitialBodies();

    for (let i = 0; i < SIMULATION_STEPS; i++) {
      bodies = integrateRK4(bodies as any, dt);
    }

    const endTime = performance.now();
    const energyMetrics = computeEnergyWithError(bodies as any, initialEnergy);

    const result: RunResult = {
      id: `run-${Date.now()}-${dt}`,
      dt,
      finalEnergy: energyMetrics.total,
      energyError: energyMetrics.energyError,
      steps: SIMULATION_STEPS,
      timeElapsed: endTime - startTime,
    };

    addRunResult(result);
  };

  const runAllComparisons = async () => {
    setIsRunning(true);
    clearRunResults();

    for (const option of DT_OPTIONS) {
      await runComparison(option.value);
    }

    setIsRunning(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card className="w-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Comparador Numérico</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Select value={selectedDt.toString()} onValueChange={(v) => setSelectedDt(Number(v))}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar dt" />
              </SelectTrigger>
              <SelectContent>
                {DT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => runComparison(selectedDt)}
              disabled={isRunning}
            >
              Ejecutar
            </Button>

            <Button
              variant="default"
              onClick={runAllComparisons}
              disabled={isRunning}
            >
              {isRunning ? 'Ejecutando...' : 'Ejecutar todos'}
            </Button>
          </div>

          <Separator />

          {runResults.length > 0 && (
            <div className="space-y-2">
              <div className="grid grid-cols-4 gap-2 text-xs font-medium text-muted-foreground px-2">
                <span>dt</span>
                <span>Pasos</span>
                <span>Error %</span>
                <span>Tiempo</span>
              </div>
              {runResults.map((result) => (
                <div
                  key={result.id}
                  className="grid grid-cols-4 gap-2 text-sm px-2 py-2 bg-secondary/30 rounded"
                >
                  <Badge variant="outline">{result.dt}s</Badge>
                  <span>{result.steps}</span>
                  <Badge variant={result.energyError > 1 ? 'destructive' : 'secondary'}>
                    {result.energyError.toFixed(6)}%
                  </Badge>
                  <span className="font-mono text-xs">{result.timeElapsed.toFixed(2)}ms</span>
                </div>
              ))}
            </div>
          )}

          {runResults.length === 0 && (
            <div className="text-center text-muted-foreground py-4 text-sm">
              Sin resultados. Ejecuta una simulación para comparar.
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}