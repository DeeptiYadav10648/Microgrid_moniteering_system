import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Home, Zap, TrendingUp, TrendingDown } from "lucide-react";

export default function Household() {
  const { data: energyData } = useQuery({
    queryKey: ["/api/energy/current"],
    refetchInterval: 5000,
  });

  const { data: historyData } = useQuery({
    queryKey: ["/api/energy/history"],
    select: (data) => data?.slice(-24) || [],
  });

  // Mock appliance consumption data
  const applianceData = [
    { name: 'HVAC', consumption: 2.8, percentage: 41, color: '#3B82F6' },
    { name: 'Water Heater', consumption: 1.2, percentage: 18, color: '#EF4444' },
    { name: 'Lighting', consumption: 0.8, percentage: 12, color: '#F59E0B' },
    { name: 'Kitchen', consumption: 0.9, percentage: 13, color: '#10B981' },
    { name: 'Electronics', consumption: 0.7, percentage: 10, color: '#8B5CF6' },
    { name: 'Other', consumption: 0.4, percentage: 6, color: '#6B7280' },
  ];

  const hourlyUsage = historyData?.map((data, index) => ({
    time: new Date(data.timestamp).getHours(),
    consumption: data.householdConsumption,
  })) || [];

  const totalConsumption = energyData?.householdConsumption || 0;
  const averageUsage = hourlyUsage.length > 0 
    ? hourlyUsage.reduce((acc, curr) => acc + curr.consumption, 0) / hourlyUsage.length 
    : 0;

  const trend = totalConsumption > averageUsage ? 'up' : 'down';
  const trendPercentage = averageUsage > 0 
    ? Math.abs(((totalConsumption - averageUsage) / averageUsage) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-6" data-testid="page-household">
      <h1 className="text-3xl font-bold">Household Usage</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-lg p-6" data-testid="card-current-usage">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Usage</p>
              <p className="text-2xl font-bold text-primary" data-testid="text-current-usage">
                {totalConsumption.toFixed(1)} kW
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            {trend === 'up' ? (
              <TrendingUp className="w-4 h-4 text-red-400 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-green-400 mr-1" />
            )}
            <p className={`text-sm ${trend === 'up' ? 'text-red-400' : 'text-green-400'}`}>
              {trendPercentage}% from average
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6" data-testid="card-daily-total">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Daily Total</p>
              <p className="text-2xl font-bold text-green-400" data-testid="text-daily-total">
                {(totalConsumption * 24).toFixed(1)} kWh
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Home className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">Projected consumption</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6" data-testid="card-efficiency-rating">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Efficiency Rating</p>
              <p className="text-2xl font-bold text-primary" data-testid="text-efficiency-rating">
                {energyData ? (Math.min(100, (15 / totalConsumption) * 100).toFixed(0)) : '85'}%
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
          <p className="text-sm text-green-400 mt-2">Good efficiency</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appliance Breakdown */}
        <div className="bg-card border border-border rounded-lg p-6" data-testid="chart-appliance-breakdown">
          <h3 className="text-lg font-semibold mb-4">Appliance Consumption Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={applianceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="consumption"
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                >
                  {applianceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} kW`, 'Consumption']}
                  labelStyle={{ color: 'hsl(215 20% 65%)' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(222 84% 8%)', 
                    border: '1px solid hsl(217 32% 17%)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Usage Pattern */}
        <div className="bg-card border border-border rounded-lg p-6" data-testid="chart-hourly-usage">
          <h3 className="text-lg font-semibold mb-4">Hourly Usage Pattern</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 32% 17%)" />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(215 20% 65%)"
                  fontSize={12}
                  tick={{ fill: 'hsl(215 20% 65%)' }}
                  tickFormatter={(hour) => `${hour}:00`}
                />
                <YAxis 
                  stroke="hsl(215 20% 65%)"
                  fontSize={12}
                  tick={{ fill: 'hsl(215 20% 65%)' }}
                  label={{ value: 'kW', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: 'hsl(215 20% 65%)' } }}
                />
                <Tooltip 
                  formatter={(value) => [`${value.toFixed(1)} kW`, 'Consumption']}
                  labelFormatter={(hour) => `Time: ${hour}:00`}
                  labelStyle={{ color: 'hsl(215 20% 65%)' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(222 84% 8%)', 
                    border: '1px solid hsl(217 32% 17%)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="consumption" fill="hsl(217 91% 60%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Appliance Details */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Appliance Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {applianceData.map((appliance) => (
            <div 
              key={appliance.name} 
              className="p-4 border border-border rounded-lg"
              data-testid={`appliance-${appliance.name.toLowerCase().replace(' ', '-')}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{appliance.name}</h4>
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: appliance.color }}
                ></div>
              </div>
              <p className="text-2xl font-bold" data-testid={`text-${appliance.name.toLowerCase().replace(' ', '-')}-consumption`}>
                {appliance.consumption} kW
              </p>
              <p className="text-sm text-muted-foreground">
                {appliance.percentage}% of total usage
              </p>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div 
                  className="h-2 rounded-full" 
                  style={{ 
                    width: `${appliance.percentage}%`,
                    backgroundColor: appliance.color 
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
