import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Info, CheckCircle } from "lucide-react";

export default function RecentAlerts() {
  const { data: alerts } = useQuery({
    queryKey: ["/api/alerts"],
    refetchInterval: 30000,
  });

  if (!alerts) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Alerts</h3>
        <div className="space-y-3 animate-pulse">
          <div className="h-16 bg-muted rounded-lg"></div>
          <div className="h-16 bg-muted rounded-lg"></div>
          <div className="h-16 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return AlertTriangle;
      case 'info':
        return Info;
      case 'success':
        return CheckCircle;
      default:
        return Info;
    }
  };

  const getAlertStyles = (type) => {
    switch (type) {
      case 'warning':
        return {
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/20',
          iconColor: 'text-yellow-500'
        };
      case 'info':
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/20',
          iconColor: 'text-blue-500'
        };
      case 'success':
        return {
          bg: 'bg-green-500/10',
          border: 'border-green-500/20',
          iconColor: 'text-green-500'
        };
      case 'error':
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-500/20',
          iconColor: 'text-red-500'
        };
      default:
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/20',
          iconColor: 'text-blue-500'
        };
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - alertTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6" data-testid="card-recent-alerts">
      <h3 className="text-lg font-semibold mb-4">Recent Alerts</h3>
      <div className="space-y-3">
        {alerts.slice(0, 3).map((alert) => {
          const Icon = getAlertIcon(alert.type);
          const styles = getAlertStyles(alert.type);
          
          return (
            <div 
              key={alert.id} 
              className={`flex items-start p-3 ${styles.bg} border ${styles.border} rounded-lg`}
              data-testid={`alert-${alert.type}`}
            >
              <Icon className={`w-5 h-5 ${styles.iconColor} mr-3 mt-0.5`} />
              <div className="flex-1">
                <p className="text-sm font-medium" data-testid="text-alert-title">
                  {alert.title}
                </p>
                <p className="text-xs text-muted-foreground" data-testid="text-alert-time">
                  {getTimeAgo(alert.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
        
        {alerts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No recent alerts</p>
          </div>
        )}
      </div>
    </div>
  );
}
