import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { useSimulationStore } from '@/stores/simulationStore';
import { useSimulation } from '@/hooks/useSimulation';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';

export function Playback() {
  const status = useSimulationStore((state) => state.status);
  const play = useSimulationStore((state) => state.play);
  const pause = useSimulationStore((state) => state.pause);
  const reset = useSimulationStore((state) => state.reset);
  const step = useSimulationStore((state) => state.step);

  useSimulation();

  return (
    <TooltipProvider>
      <motion.div 
        className="flex gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {status === 'running' ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={pause}>
                <Pause className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Pausar simulación</TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="default" size="icon" onClick={play}>
                <Play className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Iniciar simulación</TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={step}
              disabled={status === 'running'}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Avanzar un paso</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="destructive" size="icon" onClick={reset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reiniciar simulación</TooltipContent>
        </Tooltip>
      </motion.div>
    </TooltipProvider>
  );
}