import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "../lib/queryClient";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Power, Battery, Zap, Sun, Wind } from "lucide-react";

export default function Control() {
  const [batteryMode, setBatteryMode] = useState("auto");
  const [maxChargeLevel, setMaxChargeLevel] = useState([90]);
  const [minDischargeLevel, setMinDischargeLevel] = useState([20]);
  const [gridConnection, setGridConnection] = useState(true);
  const [autoOptimization, setAutoOptimization] = useState(true);

  const { data: energyData } = useQuery({
    queryKey: ["/api/energy/current"],
    refetchInterval: 5000,
  });

  const emergencyShutdownMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/system/emergency-shutdown"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/energy/current"] });
    },
  });

  const systemRestartMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/system/restart"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/energy/current"] });
    },
  });

  return (
    <div className="space-y-6" data-testid="page-control">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Control Panel</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">System Status:</span>
          <span className="text-sm text-green-400 font-medium">
            {energyData?.gridStatus ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* System Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Battery Management */}
        <Card data-testid="card-battery-management">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Battery className="w-5 h-5 mr-2" />
              Home Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">

            <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">House 1</span>
              <Switch defaultChecked data-testid="switch-solar-panel-1" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">House 2</span>
              <Switch defaultChecked data-testid="switch-solar-panel-2" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">House 3</span>
              <Switch defaultChecked data-testid="switch-solar-panel-3" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">House 4</span>
              <Switch defaultChecked data-testid="switch-solar-panel-4" />
            </div>
            
            
          </CardContent>
            
          </CardContent>
        </Card>

        {/* Grid Management */}
        <Card data-testid="card-grid-management">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Grid Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Grid Connection</label>
                <p className="text-xs text-muted-foreground">
                  Enable/disable grid connection
                </p>
              </div>
              <Switch
                checked={gridConnection}
                onCheckedChange={setGridConnection}
                data-testid="switch-grid-connection"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Auto Optimization</label>
                <p className="text-xs text-muted-foreground">
                  Automatically optimize energy flow
                </p>
              </div>
              <Switch
                checked={autoOptimization}
                onCheckedChange={setAutoOptimization}
                data-testid="switch-auto-optimization"
              />
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">Grid Status</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <span className={`ml-2 font-medium ${
                    energyData?.gridStatus ? 'text-green-400' : 'text-red-400'
                  }`} data-testid="text-grid-status">
                    {energyData?.gridStatus ? 'Online' : 'Offline'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Load:</span>
                  <span className="ml-2 font-medium" data-testid="text-grid-load">
                    {energyData?.gridLoad.toFixed(0) || '67'}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generation Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Solar Controls */}
        <Card data-testid="card-solar-controls">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sun className="w-5 h-5 mr-2" />
              Solar Panel Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Panel 1</span>
              <Switch defaultChecked data-testid="switch-solar-panel-1" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Panel 2</span>
              <Switch defaultChecked data-testid="switch-solar-panel-2" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Panel 3</span>
              <Switch defaultChecked data-testid="switch-solar-panel-3" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Panel 4</span>
              <Switch defaultChecked data-testid="switch-solar-panel-4" />
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Current Output</span>
                <span className="text-lg font-bold text-yellow-500" data-testid="text-solar-output">
                  {energyData?.solarGeneration.toFixed(1) || '12.3'} kW
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wind Controls */}
        <Card data-testid="card-wind-controls">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wind className="w-5 h-5 mr-2" />
              Wind Turbine Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Turbine Active</span>
              <Switch defaultChecked data-testid="switch-wind-turbine" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Auto Orientation</span>
              <Switch defaultChecked data-testid="switch-wind-orientation" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Brake System</span>
              <Switch data-testid="switch-wind-brake" />
            </div>
            
            <div className="pt-4 border-t space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Current Output</span>
                <span className="text-lg font-bold text-blue-500" data-testid="text-wind-output">
                  {energyData?.windGeneration.toFixed(1) || '8.7'} kW
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Wind Speed</span>
                <span className="text-sm" data-testid="text-wind-speed">12.5 mph</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Controls */}
      <Card data-testid="card-emergency-controls">
        <CardHeader>
          <CardTitle className="flex items-center text-red-400">
            <Power className="w-5 h-5 mr-2" />
            Emergency Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="destructive"
              onClick={() => emergencyShutdownMutation.mutate()}
              disabled={emergencyShutdownMutation.isPending}
              data-testid="button-emergency-shutdown"
              className="h-12"
            >
              <Power className="w-4 h-4 mr-2" />
              {emergencyShutdownMutation.isPending ? 'Shutting Down...' : 'Emergency Shutdown'}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => systemRestartMutation.mutate()}
              disabled={systemRestartMutation.isPending}
              data-testid="button-system-restart"
              className="h-12"
            >
              <Settings className="w-4 h-4 mr-2" />
              {systemRestartMutation.isPending ? 'Restarting...' : 'System Restart'}
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-4">
            Use emergency controls only when necessary. Emergency shutdown will immediately disconnect all power sources.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
