import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Playback } from './Playback';
import { useSimulationStore } from '@/stores/simulationStore';
import { BODY_NAMES, DT_LIMITS } from '@/lib/physics/constants';
import type { BodyName } from '@/types/physics';

function formatDt(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}min`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)}h`;
  return `${Math.round(seconds / 86400)}d`;
}

export function ControlPanel() {
  const dt = useSimulationStore((state) => state.dt);
  const setDt = useSimulationStore((state) => state.setDt);
  const bodies = useSimulationStore((state) => state.bodies);
  const setBodyMass = useSimulationStore((state) => state.setBodyMass);
  const setBodyVelocity = useSimulationStore((state) => state.setBodyVelocity);
  const viewMode = useSimulationStore((state) => state.viewMode);
  const setViewMode = useSimulationStore((state) => state.setViewMode);

  const [localDt, setLocalDt] = useState(dt);

  useEffect(() => {
    setLocalDt(dt);
  }, [dt]);

  const handleDtChange = (value: number[]) => {
    const newDt = value[0];
    setLocalDt(newDt);
    setDt(newDt);
  };

  const handleMassChange = (body: BodyName, value: string) => {
    const mass = parseFloat(value);
    if (!isNaN(mass) && mass > 0) {
      setBodyMass(body, mass);
    }
  };

  const handleVelocityChange = (body: BodyName, axis: 'x' | 'y' | 'z', value: string) => {
    const velocity = parseFloat(value);
    if (!isNaN(velocity)) {
      const currentBody = bodies.find((b) => b.name === body);
      if (currentBody) {
        setBodyVelocity(body, {
          ...currentBody.velocity,
          [axis]: velocity,
        });
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="w-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Panel de Control</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="dt-slider">Paso de tiempo (dt)</Label>
              <span className="text-sm font-mono bg-secondary px-2 py-1 rounded">
                {formatDt(localDt)}
              </span>
            </div>
            <Slider
              id="dt-slider"
              min={DT_LIMITS.MIN}
              max={DT_LIMITS.MAX}
              step={1}
              value={[localDt]}
              onValueChange={handleDtChange}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1s</span>
              <span>30 días</span>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <Label className="text-sm font-medium">Masas (kg)</Label>
            {bodies.map((body) => (
              <div key={body.name} className="grid grid-cols-3 gap-2 items-center">
                <span className="text-sm col-span-1">{body.name}</span>
                <Input
                  type="number"
                  value={body.mass}
                  onChange={(e) => handleMassChange(body.name, e.target.value)}
                  className="col-span-2 text-xs font-mono"
                  step={body.mass * 0.1}
                />
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-4">
            <Label className="text-sm font-medium">Velocidad inicial Tierra (m/s)</Label>
            {bodies
              .filter((b) => b.name === BODY_NAMES.EARTH)
              .map((body) => (
                <div key={body.name} className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Vx</Label>
                    <Input
                      type="number"
                      value={body.velocity.x}
                      onChange={(e) => handleVelocityChange(body.name, 'x', e.target.value)}
                      className="text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Vy</Label>
                    <Input
                      type="number"
                      value={body.velocity.y}
                      onChange={(e) => handleVelocityChange(body.name, 'y', e.target.value)}
                      className="text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Vz</Label>
                    <Input
                      type="number"
                      value={body.velocity.z}
                      onChange={(e) => handleVelocityChange(body.name, 'z', e.target.value)}
                      className="text-xs font-mono"
                    />
                  </div>
                </div>
              ))}
          </div>

          <Separator />

          <div className="space-y-4">
            <Label className="text-sm font-medium">Velocidad inicial Luna (m/s)</Label>
            {bodies
              .filter((b) => b.name === BODY_NAMES.MOON)
              .map((body) => (
                <div key={body.name} className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Vx</Label>
                    <Input
                      type="number"
                      value={body.velocity.x}
                      onChange={(e) => handleVelocityChange(body.name, 'x', e.target.value)}
                      className="text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Vy</Label>
                    <Input
                      type="number"
                      value={body.velocity.y}
                      onChange={(e) => handleVelocityChange(body.name, 'y', e.target.value)}
                      className="text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Vz</Label>
                    <Input
                      type="number"
                      value={body.velocity.z}
                      onChange={(e) => handleVelocityChange(body.name, 'z', e.target.value)}
                      className="text-xs font-mono"
                    />
                  </div>
                </div>
              ))}
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <Label htmlFor="view-mode">Vista 2D (eje Z)</Label>
            <Switch
              id="view-mode"
              checked={viewMode === '2d'}
              onCheckedChange={(checked) => setViewMode(checked ? '2d' : '3d')}
            />
          </div>

          <Separator />

          <div className="flex justify-center py-2">
            <Playback />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}