import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon, Globe, Bell, Moon, Sun, Database, Wifi } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [autoOptimization, setAutoOptimization] = useState(true);
  const [dataRetention, setDataRetention] = useState([30]);
  const [refreshInterval, setRefreshInterval] = useState([5]);
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("UTC");
  const [alertThresholds, setAlertThresholds] = useState({
    batteryLow: 20,
    batteryHigh: 95,
    temperatureHigh: 35,
    gridLoadHigh: 85
  });

  const { toast } = useToast();

  const handleSaveSettings = () => {
    // Simulate saving settings
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleResetSettings = () => {
    setDarkMode(true);
    setNotifications(true);
    setAutoOptimization(true);
    setDataRetention([30]);
    setRefreshInterval([5]);
    setLanguage("en");
    setTimezone("UTC");
    setAlertThresholds({
      batteryLow: 20,
      batteryHigh: 95,
      temperatureHigh: 35,
      gridLoadHigh: 85
    });
    
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values.",
    });
  };

  return (
    <div className="space-y-6" data-testid="page-settings">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings & Language</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handleResetSettings}
            data-testid="button-reset-settings"
          >
            Reset to Default
          </Button>
          <Button onClick={handleSaveSettings} data-testid="button-save-settings">
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance Settings */}
        <Card data-testid="card-appearance-settings">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Moon className="w-5 h-5 mr-2" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Dark Mode</Label>
                <p className="text-xs text-muted-foreground">
                  Switch between light and dark themes
                </p>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
                data-testid="switch-dark-mode"
              />
            </div>

            <Separator />

            <div>
              <Label className="text-sm font-medium mb-2 block">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger data-testid="select-language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger data-testid="select-timezone">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  <SelectItem value="Europe/London">London</SelectItem>
                  <SelectItem value="Europe/Paris">Paris</SelectItem>
                  <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card data-testid="card-notification-settings">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Enable Notifications</Label>
                <p className="text-xs text-muted-foreground">
                  Receive system alerts and warnings
                </p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
                data-testid="switch-notifications"
              />
            </div>

            <Separator />

            <div>
              <Label className="text-sm font-medium mb-2 block">
                Battery Low Threshold: {alertThresholds.batteryLow}%
              </Label>
              <Slider
                value={[alertThresholds.batteryLow]}
                onValueChange={([value]) => setAlertThresholds(prev => ({ ...prev, batteryLow: value }))}
                max={50}
                min={5}
                step={5}
                className="w-full"
                data-testid="slider-battery-low-threshold"
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">
                Battery High Threshold: {alertThresholds.batteryHigh}%
              </Label>
              <Slider
                value={[alertThresholds.batteryHigh]}
                onValueChange={([value]) => setAlertThresholds(prev => ({ ...prev, batteryHigh: value }))}
                max={100}
                min={80}
                step={5}
                className="w-full"
                data-testid="slider-battery-high-threshold"
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">
                Temperature Alert: {alertThresholds.temperatureHigh}°C
              </Label>
              <Slider
                value={[alertThresholds.temperatureHigh]}
                onValueChange={([value]) => setAlertThresholds(prev => ({ ...prev, temperatureHigh: value }))}
                max={50}
                min={25}
                step={1}
                className="w-full"
                data-testid="slider-temperature-threshold"
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Settings */}
        <Card data-testid="card-data-settings">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Data Retention: {dataRetention[0]} days
              </Label>
              <Slider
                value={dataRetention}
                onValueChange={setDataRetention}
                max={365}
                min={7}
                step={7}
                className="w-full"
                data-testid="slider-data-retention"
              />
              <p className="text-xs text-muted-foreground mt-1">
                How long to keep historical energy data
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">
                Refresh Interval: {refreshInterval[0]} seconds
              </Label>
              <Slider
                value={refreshInterval}
                onValueChange={setRefreshInterval}
                max={60}
                min={1}
                step={1}
                className="w-full"
                data-testid="slider-refresh-interval"
              />
              <p className="text-xs text-muted-foreground mt-1">
                How often to update dashboard data
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Auto Optimization</Label>
                <p className="text-xs text-muted-foreground">
                  Automatically optimize energy distribution
                </p>
              </div>
              <Switch
                checked={autoOptimization}
                onCheckedChange={setAutoOptimization}
                data-testid="switch-auto-optimization"
              />
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card data-testid="card-system-settings">
          <CardHeader>
            <CardTitle className="flex items-center">
              <SettingsIcon className="w-5 h-5 mr-2" />
              System Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="system-name" className="text-sm font-medium mb-2 block">
                System Name
              </Label>
              <Input
                id="system-name"
                defaultValue="EnergyFlow Home System"
                data-testid="input-system-name"
              />
            </div>

            <div>
              <Label htmlFor="location" className="text-sm font-medium mb-2 block">
                Location
              </Label>
              <Input
                id="location"
                defaultValue="Home Energy System"
                data-testid="input-location"
              />
            </div>

            <div>
              <Label htmlFor="max-power" className="text-sm font-medium mb-2 block">
                Max Power Output (kW)
              </Label>
              <Input
                id="max-power"
                type="number"
                defaultValue="25"
                data-testid="input-max-power"
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="text-sm font-medium">System Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" data-testid="button-calibrate-system">
                  Calibrate System
                </Button>
                <Button variant="outline" size="sm" data-testid="button-backup-settings">
                  Backup Settings
                </Button>
                <Button variant="outline" size="sm" data-testid="button-restore-settings">
                  Restore Settings
                </Button>
                <Button variant="outline" size="sm" data-testid="button-export-data">
                  Export Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Settings */}
      <Card data-testid="card-advanced-settings">
        <CardHeader>
          <CardTitle>Advanced Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Grid Load Alert: {alertThresholds.gridLoadHigh}%
              </Label>
              <Slider
                value={[alertThresholds.gridLoadHigh]}
                onValueChange={([value]) => setAlertThresholds(prev => ({ ...prev, gridLoadHigh: value }))}
                max={100}
                min={50}
                step={5}
                className="w-full"
                data-testid="slider-grid-load-threshold"
              />
            </div>

            <div>
              <Label htmlFor="api-endpoint" className="text-sm font-medium mb-2 block">
                API Endpoint
              </Label>
              <Input
                id="api-endpoint"
                defaultValue="/api"
                data-testid="input-api-endpoint"
              />
            </div>

            <div>
              <Label htmlFor="update-frequency" className="text-sm font-medium mb-2 block">
                Update Frequency (ms)
              </Label>
              <Input
                id="update-frequency"
                type="number"
                defaultValue="5000"
                data-testid="input-update-frequency"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
