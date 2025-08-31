import { useQuery } from "@tanstack/react-query";
import { Sun, Wind } from "lucide-react";

export default function RenewableStatus() {
  const { data: energyData } = useQuery({
    queryKey: ["/api/energy/current"],
    refetchInterval: 5000,
  });

  if (!energyData) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Renewable Sources</h3>
        <div className="space-y-4 animate-pulse">
          <div className="h-16 bg-muted rounded-lg"></div>
          <div className="h-16 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  const maxSolar = 15.2; // Peak capacity
  const maxWind = 12.0; // Peak capacity

  return (
    <div className="bg-card border border-border rounded-lg p-6" data-testid="card-renewable-status">
      <h3 className="text-lg font-semibold mb-4">Renewable Sources</h3>
      <div className="space-y-4">
        {/* Solar Status */}
        <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg">
          <div className="flex items-center">
            <Sun className="w-8 h-8 text-yellow-500 mr-3" />
            <div>
              <p className="text-sm font-medium">Solar Panels</p>
              <p className="text-xs text-muted-foreground">4 panels active</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-yellow-500" data-testid="text-solar-current">
              {energyData.solarGeneration.toFixed(1)} kW
            </p>
            <p className="text-xs text-muted-foreground">Peak: {maxSolar} kW</p>
          </div>
        </div>
        
        {/* Wind Status */}
        <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg">
          <div className="flex items-center">
            <Wind className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium">Wind Turbine</p>
              <p className="text-xs text-muted-foreground">Wind: 12.5 mph</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-blue-500" data-testid="text-wind-current">
              {energyData.windGeneration.toFixed(1)} kW
            </p>
            <p className="text-xs text-muted-foreground">Avg: 6.8 kW</p>
          </div>
        </div>
      </div>
    </div>
  );
}
