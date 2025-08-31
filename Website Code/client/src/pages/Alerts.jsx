import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "../lib/queryClient";
import { AlertTriangle, Info, CheckCircle, AlertCircle } from "lucide-react";

export default function Alerts() {
  const { data: alerts, isLoading } = useQuery({
    queryKey: ["/api/alerts"],
    refetchInterval: 10000,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (alertId) => apiRequest("PATCH", `/api/alerts/${alertId}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
    },
  });

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return AlertTriangle;
      case 'info':
        return Info;
      case 'success':
        return CheckCircle;
      case 'error':
        return AlertCircle;
      default:
        return Info;
    }
  };

  const getAlertStyles = (type) => {
    switch (type) {
      case 'warning':
        return 'border-yellow-500 bg-yellow-500/10';
      case 'info':
        return 'border-blue-500 bg-blue-500/10';
      case 'success':
        return 'border-green-500 bg-green-500/10';
      case 'error':
        return 'border-red-500 bg-red-500/10';
      default:
        return 'border-blue-500 bg-blue-500/10';
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

  if (isLoading) {
    return (
      <div className="space-y-6" data-testid="page-alerts">
        <h1 className="text-3xl font-bold">Alerts & Notifications</h1>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="page-alerts">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Alerts & Notifications</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {alerts?.filter(alert => !alert.isRead).length || 0} unread
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {alerts && alerts.length > 0 ? (
          alerts.map((alert) => {
            const Icon = getAlertIcon(alert.type);
            const alertStyles = getAlertStyles(alert.type);
            
            return (
              <div 
                key={alert.id}
                className={`border rounded-lg p-6 ${alertStyles} ${
                  alert.isRead ? 'opacity-60' : ''
                }`}
                data-testid={`alert-item-${alert.type}`}
              >
                <div className="flex items-start space-x-4">
                  <Icon className={`w-6 h-6 mt-1 ${
                    alert.type === 'warning' ? 'text-yellow-500' :
                    alert.type === 'info' ? 'text-blue-500' :
                    alert.type === 'success' ? 'text-green-500' :
                    alert.type === 'error' ? 'text-red-500' : 'text-blue-500'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold" data-testid="text-alert-title">
                        {alert.title}
                      </h3>
                      <span className="text-sm text-muted-foreground" data-testid="text-alert-time">
                        {getTimeAgo(alert.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2" data-testid="text-alert-message">
                      {alert.message}
                    </p>
                    {!alert.isRead && (
                      <button
                        onClick={() => markAsReadMutation.mutate(alert.id)}
                        disabled={markAsReadMutation.isPending}
                        className="mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/80 disabled:opacity-50"
                        data-testid="button-mark-read"
                      >
                        {markAsReadMutation.isPending ? 'Marking...' : 'Mark as Read'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <Info className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No alerts</h3>
            <p className="text-muted-foreground">
              All systems are running normally. New alerts will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
