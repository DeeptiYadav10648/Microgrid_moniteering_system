import { useQuery } from "@tanstack/react-query";

export default function GridStatus() {
  const { data: energyData } = useQuery({
    queryKey: ["/api/energy/current"],
    refetchInterval: 5000,
  });

  if (!energyData) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Grid Status</h3>
        <div className="space-y-4 animate-pulse">
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6" data-testid="card-grid-status">
      <h3 className="text-lg font-semibold mb-4">Grid Status</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Connection Status</span>
          <div className="flex items-center">
            <span 
              className={`w-3 h-3 rounded-full mr-2 ${
                energyData.gridStatus ? 'bg-green-500' : 'bg-red-500'
              }`}
            ></span>
            <span 
              className={`text-sm ${
                energyData.gridStatus ? 'text-green-400' : 'text-red-400'
              }`}
              data-testid="text-grid-connection-status"
            >
              {energyData.gridStatus ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Load Percentage</span>
          <span className="text-sm font-medium" data-testid="text-grid-load-percentage">
            {energyData.gridLoad.toFixed(0)}%
          </span>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Grid Load</span>
            <span data-testid="text-grid-load">{energyData.gridLoad.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${energyData.gridLoad}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-sm text-muted-foreground">Frequency</span>
          <span className="text-sm" data-testid="text-grid-frequency">
            {energyData.gridFrequency.toFixed(2)} Hz
          </span>
        </div>
      </div>
    </div>
  );
}
