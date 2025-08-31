import { useState, useEffect } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Download, TrendingUp, TrendingDown, DollarSign, Leaf } from "lucide-react";

export default function Reports() {
  const [timeRange, setTimeRange] = useState("week");

  // Dummy data generator
  const generateDummyData = (range) => {
    let points = range === "day" ? 24 : range === "week" ? 7 : 30;
    let data = [];
    for (let i = 0; i < points; i++) {
      const timestamp = Date.now() - (points - i) * 3600 * 1000;
      data.push({
        timestamp,
        totalGeneration: Math.random() * 100 + 200,
        totalConsumption: Math.random() * 80 + 180,
        solarGeneration: Math.random() * 60 + 80,
        windGeneration: Math.random() * 40 + 60,
        batteryLevel: Math.random() * 100,
        efficiency: Math.random() * 20 + 80,
      });
    }
    return data;
  };

  const [historyData, setHistoryData] = useState(generateDummyData(timeRange));

  useEffect(() => {
    setHistoryData(generateDummyData(timeRange));
    const interval = setInterval(() => {
      setHistoryData(generateDummyData(timeRange));
    }, 5000);
    return () => clearInterval(interval);
  }, [timeRange]);

  // Process data for charts
  const processedData = historyData?.map((data, index) => ({
    time: timeRange === "day" 
      ? new Date(data.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      : timeRange === "week"
      ? new Date(data.timestamp).toLocaleDateString('en-US', { weekday: 'short' })
      : new Date(data.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    generation: data.totalGeneration,
    consumption: data.totalConsumption,
    solar: data.solarGeneration,
    wind: data.windGeneration,
    battery: data.batteryLevel,
    efficiency: data.efficiency,
    savings: data.totalGeneration * 0.68, // $0.68 per kWh saved
  })) || [];

  // Calculate summary metrics
  const totalGeneration = processedData.reduce((sum, item) => sum + item.generation, 0);
  const totalConsumption = processedData.reduce((sum, item) => sum + item.consumption, 0);
  const totalSavings = processedData.reduce((sum, item) => sum + item.savings, 0);
  const avgEfficiency = processedData.length > 0 
    ? processedData.reduce((sum, item) => sum + item.efficiency, 0) / processedData.length 
    : 0;

  const carbonSaved = totalGeneration * 1.35; // kg CO2 per kWh

  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{`${timeRange === 'day' ? 'Time' : 'Period'}: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${
                entry.dataKey === 'savings' 
                  ? `$${entry.value.toFixed(2)}` 
                  : entry.dataKey === 'battery'
                  ? `${entry.value.toFixed(0)}%`
                  : `${entry.value.toFixed(1)} kW`
              }`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6" data-testid="page-reports">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            {["day", "week", "month"].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(range)}
                data-testid={`button-timerange-${range}`}
                className="capitalize"
              >
                {range}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm" data-testid="button-export">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card data-testid="card-total-generation">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Generation</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-generation">
              {totalGeneration.toFixed(1)} kWh
            </div>
            <p className="text-xs text-green-400">
              +15.2% from last {timeRange}
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-total-consumption">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Consumption</CardTitle>
            <TrendingDown className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-consumption">
              {totalConsumption.toFixed(1)} kWh
            </div>
            <p className="text-xs text-blue-400">
              -8.3% from last {timeRange}
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-cost-savings">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary" data-testid="text-cost-savings">
              ₹{(totalSavings*80).toFixed(2)}
            </div>
            <p className="text-xs text-primary">
              ₹{((totalSavings / processedData.length)*80).toFixed(2)} avg per {timeRange === 'day' ? 'hour' : 'day'}
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-carbon-saved">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carbon Saved</CardTitle>
            <Leaf className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400" data-testid="text-carbon-saved">
              {carbonSaved.toFixed(1)} kg
            </div>
            <p className="text-xs text-green-400">
              CO₂ emissions avoided
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generation vs Consumption */}
        <Card data-testid="chart-generation-vs-consumption">
          <CardHeader>
            <CardTitle>Generation vs Consumption</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={processedData}>
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
                  />
                  <Tooltip content={customTooltip} />
                  <Legend wrapperStyle={{ color: 'hsl(215 20% 65%)' }} />
                  <Area 
                    type="monotone" 
                    dataKey="generation" 
                    stackId="1" 
                    stroke="hsl(217 91% 60%)" 
                    fill="hsl(217 91% 60%)"
                    fillOpacity={0.3}
                    name="Generation"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="consumption" 
                    stackId="2" 
                    stroke="hsl(0 84% 60%)" 
                    fill="hsl(0 84% 60%)"
                    fillOpacity={0.3}
                    name="Consumption"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Energy Sources Breakdown */}
        <Card data-testid="chart-energy-sources">
          <CardHeader>
            <CardTitle>Energy Sources Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={processedData}>
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
                  />
                  <Tooltip content={customTooltip} />
                  <Legend wrapperStyle={{ color: 'hsl(215 20% 65%)' }} />
                  <Area 
                    type="monotone" 
                    dataKey="solar" 
                    stackId="1" 
                    stroke="hsl(45 93% 58%)" 
                    fill="hsl(45 93% 58%)"
                    fillOpacity={0.6}
                    name="Solar"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="wind" 
                    stackId="1" 
                    stroke="hsl(201 96% 32%)" 
                    fill="hsl(201 96% 32%)"
                    fillOpacity={0.6}
                    name="Wind"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Battery Performance */}
        <Card data-testid="chart-battery-performance">
          <CardHeader>
            <CardTitle>Battery Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={processedData}>
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
                    domain={[0, 100]}
                  />
                  <Tooltip content={customTooltip} />
                  <Legend wrapperStyle={{ color: 'hsl(215 20% 65%)' }} />
                  <Line 
                    type="monotone" 
                    dataKey="battery" 
                    stroke="hsl(142 76% 36%)" 
                    strokeWidth={2}
                    name="Battery Level"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Cost Savings Over Time */}
        <Card data-testid="chart-cost-savings">
          <CardHeader>
            <CardTitle>Cost Savings Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={processedData}>
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
                  />
                  <Tooltip content={customTooltip} />
                  <Legend wrapperStyle={{ color: 'hsl(215 20% 65%)' }} />
                  <Bar 
                    dataKey="savings" 
                    fill="hsl(217 91% 60%)"
                    name="Savings"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Efficiency Metrics */}
      <Card data-testid="card-efficiency-metrics">
        <CardHeader>
          <CardTitle>Efficiency Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary" data-testid="text-average-efficiency">
                {avgEfficiency.toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">Average Efficiency</p>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400" data-testid="text-self-sufficiency">
                {totalConsumption > 0 ? ((totalGeneration / totalConsumption) * 100).toFixed(1) : '0'}%
              </p>
              <p className="text-sm text-muted-foreground">Self-Sufficiency</p>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-500" data-testid="text-peak-efficiency">
                {Math.max(...processedData.map(d => d.efficiency), 0).toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">Peak Efficiency</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
