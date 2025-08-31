import SummaryCards from "../components/SummaryCards";
import EnergyFlow from "../components/EnergyFlow";
import GenerationChart from "../components/GenerationChart";
import BatteryStatus from "../components/BatteryStatus";
import GridStatus from "../components/GridStatus";
import RenewableStatus from "../components/RenewableStatus";
import RecentAlerts from "../components/RecentAlerts";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";

export default function Dashboard() {
  const { data: energyData } = useQuery({
    queryKey: ["/api/energy/current"],
    refetchInterval: 5000,
  });

  // Simulate data updates every 30 seconds
  const simulateDataUpdate = async () => {
    try {
      await apiRequest("POST", "/api/energy/simulate");
    } catch (error) {
      console.error("Failed to simulate data:", error);
    }
  };

  // Set up data simulation interval
  setTimeout(() => {
    setInterval(simulateDataUpdate, 30000);
  }, 5000);

  return (
    <div className="space-y-6" data-testid="page-dashboard">
      {/* Summary Cards */}
      <SummaryCards />
      
      {/* Energy Flow Visualization */}
      <EnergyFlow />
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GenerationChart />
        <BatteryStatus />
      </div>
      
      {/* System Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GridStatus />
        <RenewableStatus />
        <RecentAlerts />
      </div>
      
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6" data-testid="card-peak-generation">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-muted-foreground">Peak Generation</h4>
            <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.25a.75.75 0 01.633.33l7.5 11.25a.75.75 0 01-.633 1.17H4.5a.75.75 0 01-.633-1.17L11.367 2.58A.75.75 0 0112 2.25z"/>
            </svg>
          </div>
          <p className="text-2xl font-bold" data-testid="text-peak-generation">
            {energyData ? (energyData.totalGeneration * 1.2).toFixed(1) : '23.7'} kW
          </p>
          <p className="text-sm text-muted-foreground">at 12:45 PM</p>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6" data-testid="card-carbon-saved">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-muted-foreground">Carbon Saved</h4>
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
            </svg>
          </div>
          <p className="text-2xl font-bold text-green-400" data-testid="text-carbon-saved">
            {energyData ? (energyData.totalGeneration * 1.35).toFixed(1) : '28.4'} kg
          </p>
          <p className="text-sm text-muted-foreground">CO₂ today</p>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6" data-testid="card-cost-savings">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-muted-foreground">Cost Savings</h4>
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
          <p className="text-2xl font-bold text-primary" data-testid="text-cost-savings">
            ₹{energyData ? (energyData.totalGeneration * 80).toFixed(2) : '14.20'}
          </p>
          <p className="text-sm text-muted-foreground">saved today</p>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6" data-testid="card-system-uptime">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-muted-foreground">System Uptime</h4>
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <p className="text-2xl font-bold text-green-400" data-testid="text-system-uptime">99.8%</p>
          <p className="text-sm text-muted-foreground">last 30 days</p>
        </div>
      </div>
    </div>
  );
}
