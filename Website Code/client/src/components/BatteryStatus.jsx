import { useQuery } from "@tanstack/react-query";

export default function BatteryStatus() {
  const { data: energyData } = useQuery({
    queryKey: ["/api/energy/current"],
    refetchInterval: 5000,
  });

  if (!energyData) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Battery Status & Health</h3>
        <div className="space-y-4 animate-pulse">
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const getHealthColor = (health) => {
    if (health >= 90) return "bg-green-500";
    if (health >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getHealthText = (health) => {
    if (health >= 90) return "Excellent";
    if (health >= 70) return "Good";
    return "Fair";
  };

  const estimatedRuntime = (energyData.batteryLevel * 0.18 / energyData.householdConsumption).toFixed(1);

  return (
    <div className="bg-card border border-border rounded-lg p-6" data-testid="card-battery-status">
      <h3 className="text-lg font-semibold mb-4">Battery Status & Health</h3>
      <div className="space-y-4">
        {/* Battery Level Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Current Level</span>
            <span data-testid="text-battery-percentage">{energyData.batteryLevel.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div 
              className="bg-green-500 h-3 rounded-full transition-all duration-300" 
              style={{ width: `${energyData.batteryLevel}%` }}
            ></div>
          </div>
        </div>
        
        {/* Battery Health */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Health Status</span>
            <span className="text-green-400" data-testid="text-battery-health">
              {getHealthText(energyData.batteryHealth)}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div 
              className={`${getHealthColor(energyData.batteryHealth)} h-3 rounded-full transition-all duration-300`}
              style={{ width: `${energyData.batteryHealth}%` }}
            ></div>
          </div>
        </div>
        
        {/* Temperature */}
        <div className="flex justify-between py-2 border-t border-border">
          <span className="text-sm text-muted-foreground">Temperature</span>
          <span className="text-sm" data-testid="text-battery-temperature">
            {energyData.batteryTemperature.toFixed(1)}°C
          </span>
        </div>
        
        {/* Cycles */}
        <div className="flex justify-between py-2">
          <span className="text-sm text-muted-foreground">Charge Cycles</span>
          <span className="text-sm" data-testid="text-battery-cycles">
            {energyData.batteryCycles.toLocaleString()}
          </span>
        </div>
        
        {/* Estimated Runtime */}
        <div className="flex justify-between py-2">
          <span className="text-sm text-muted-foreground">Est. Runtime</span>
          <span className="text-sm" data-testid="text-battery-runtime">
            {estimatedRuntime} hours
          </span>
        </div>
      </div>
    </div>
  );
}
