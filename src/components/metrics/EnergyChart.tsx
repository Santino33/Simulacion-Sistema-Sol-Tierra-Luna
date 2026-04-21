import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSimulationStore } from '@/stores/simulationStore';

export function EnergyChart() {
  const energyHistory = useSimulationStore((state) => state.energyHistory);

  const chartData = useMemo(() => {
    return energyHistory.map((point, index) => ({
      step: index,
      time: point.time,
      kinetic: point.kinetic,
      potential: point.potential,
      total: point.total,
      error: point.error,
    }));
  }, [energyHistory]);

  const formatScientific = (value: number): string => {
    return value.toExponential(2);
  };

  if (energyHistory.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="w-full">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Energía vs Tiempo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Sin datos aún. Inicia la simulación.
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card className="w-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Energía vs Tiempo</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                dataKey="step"
                stroke="#666"
                fontSize={10}
                tickFormatter={(value) => `${value}`}
              />
              <YAxis
                stroke="#666"
                fontSize={10}
                tickFormatter={(value) => formatScientific(value as number)}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line
                type="monotone"
                dataKey="kinetic"
                name="Cinética"
                stroke="#22c55e"
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="potential"
                name="Potencial"
                stroke="#ef4444"
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="total"
                name="Total"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}