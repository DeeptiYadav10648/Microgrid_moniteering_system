import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function GenerationChart() {
  const { data: historyData } = useQuery({
    queryKey: ["/api/energy/history"],
    refetchInterval: 60000, // Refresh every minute
  });

  if (!historyData || historyData.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Generation vs Consumption</h3>
        <div className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">Loading chart data...</p>
        </div>
      </div>
    );
  }

  // Format data for chart
  const chartData = historyData.slice(-24).map((data, index) => ({
    time: new Date(data.timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    generation: data.totalGeneration,
    consumption: data.totalConsumption,
    solar: data.solarGeneration,
    wind: data.windGeneration,
  }));

  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{`Time: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value.toFixed(1)} kW`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6" data-testid="chart-generation-consumption">
      <h3 className="text-lg font-semibold mb-4">Generation vs Consumption</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 32% 17%)" />
            <XAxis 
              dataKey="time" 
              stroke="hsl(215 20% 65%)"
              fontSize={12}
              tick={{ fill: 'hsl(215 20% 65%)' }}
            />
            <YAxis 
              stroke="hsl(215 20% 65%)"
              fontSize={12}
              tick={{ fill: 'hsl(215 20% 65%)' }}
              label={{ value: 'kW', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: 'hsl(215 20% 65%)' } }}
            />
            <Tooltip content={customTooltip} />
            <Legend 
              wrapperStyle={{ color: 'hsl(215 20% 65%)' }}
            />
            <Line 
              type="monotone" 
              dataKey="generation" 
              stroke="hsl(217 91% 60%)" 
              strokeWidth={2}
              name="Total Generation"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="consumption" 
              stroke="hsl(0 84% 60%)" 
              strokeWidth={2}
              name="Consumption"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="solar" 
              stroke="hsl(45 93% 58%)" 
              strokeWidth={1}
              name="Solar"
              dot={false}
              strokeDasharray="5 5"
            />
            <Line 
              type="monotone" 
              dataKey="wind" 
              stroke="hsl(201 96% 32%)" 
              strokeWidth={1}
              name="Wind"
              dot={false}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
