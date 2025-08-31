import { useQuery } from "@tanstack/react-query";

export default function EnergyFlow() {
  const { data: energyData } = useQuery({
    queryKey: ["/api/energy/current"],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  if (!energyData) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-6">Live Energy Flow</h3>
        <div className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">Loading energy flow data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-6">Live Energy Flow</h3>
      <div className="relative">
        <svg viewBox="0 0 800 300" className="w-full h-128">
          {/* Solar Panel */}
          <g transform="translate(50, 50)">
            <rect x="0" y="0" width="80" height="60" rx="8" fill="hsl(45 93% 58%)" stroke="hsl(42 91% 50%)" strokeWidth="2"/>
            <text x="40" y="30" textAnchor="middle" fill="hsl(222 84% 5%)" fontSize="12" fontWeight="600">Solar</text>
            <text x="40" y="45" textAnchor="middle" fill="hsl(222 84% 5%)" fontSize="10" data-testid="text-solar-output">
              {energyData.solarGeneration.toFixed(1)} kW
            </text>
          </g>
          
          {/* Wind Turbine */}
          <g transform="translate(50, 150)">
            <rect x="0" y="0" width="80" height="60" rx="8" fill="hsl(201 96% 32%)" stroke="hsl(201 96% 25%)" strokeWidth="2"/>
            <text x="40" y="30" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">Wind</text>
            <text x="40" y="45" textAnchor="middle" fill="white" fontSize="10" data-testid="text-wind-output">
              {energyData.windGeneration.toFixed(1)} kW
            </text>
          </g>
          
          {/* Battery Storage */}
          <g transform="translate(350, 100)">
            <rect x="0" y="0" width="100" height="80" rx="8" fill="hsl(142 76% 36%)" stroke="hsl(142 76% 30%)" strokeWidth="2"/>
            <text x="50" y="35" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">Battery</text>
            <text x="50" y="50" textAnchor="middle" fill="white" fontSize="10" data-testid="text-battery-status">
              {energyData.batteryLevel.toFixed(0)}% | {(energyData.batteryLevel * 0.18).toFixed(1)} kWh
            </text>
            <text x="50" y="65" textAnchor="middle" fill="white" fontSize="10">
              {energyData.totalGeneration > energyData.totalConsumption ? 'Charging' : 'Discharging'}
            </text>
          </g>
          
          {/* Grid Connection */}
          <g transform="translate(600, 50)">
            <rect x="0" y="0" width="80" height="60" rx="8" fill="hsl(262 83% 58%)" stroke="hsl(262 83% 50%)" strokeWidth="2"/>
            <text x="40" y="30" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">Grid</text>
            <text x="40" y="45" textAnchor="middle" fill="white" fontSize="10" data-testid="text-grid-status">
              {energyData.gridStatus ? 'Online' : 'Offline'}
            </text>
          </g>
          
          {/* Households */}
          <g transform="translate(600, 150)">
            <rect x="0" y="0" width="80" height="60" rx="8" fill="hsl(0 84% 60%)" stroke="hsl(0 84% 50%)" strokeWidth="2"/>
            <text x="40" y="30" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">House</text>
            <text x="40" y="45" textAnchor="middle" fill="white" fontSize="10" data-testid="text-household-consumption">
              {energyData.householdConsumption.toFixed(1)} kW
            </text>
          </g>
          
          {/* Energy Flow Lines */}
          <line x1="130" y1="80" x2="350" y2="140" className="energy-flow-line"/>
          <line x1="130" y1="180" x2="350" y2="140" className="energy-flow-line"/>
          <line x1="450" y1="140" x2="600" y2="80" className="energy-flow-line"/>
          <line x1="450" y1="140" x2="600" y2="180" className="energy-flow-line"/>
          
          {/* Flow Direction Arrows */}
          <polygon points="300,135 310,140 300,145" fill="var(--primary)"/>
          <polygon points="550,135 560,140 550,145" fill="var(--primary)"/>
        </svg>
      </div>
    </div>
  );
}
