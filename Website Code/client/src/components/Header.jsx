import { useState, useEffect } from "react";
import { Menu, Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function Header({ toggleMobileNav }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  const { data: alerts } = useQuery({
    queryKey: ["/api/alerts"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const unreadAlertsCount = alerts?.filter(alert => !alert.isRead).length || 0;

  return (
    <header className="bg-card border-b border-border p-4 flex items-center justify-between">
      <div className="flex items-center">
        <button 
          onClick={toggleMobileNav} 
          className="lg:hidden p-2 hover:bg-accent rounded-lg mr-4"
          data-testid="button-toggle-mobile-nav"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-semibold" data-testid="text-page-title">
          Dashboard
        </h2>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="text-sm text-muted-foreground" data-testid="text-current-time">
          {currentTime.toLocaleString()}
        </div>
        <button 
          className="p-2 hover:bg-accent rounded-lg relative"
          data-testid="button-notifications"
        >
          <Bell className="w-6 h-6" />
          {unreadAlertsCount > 0 && (
            <span 
              className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center"
              data-testid="text-notification-count"
            >
              {unreadAlertsCount}
            </span>
          )}
        </button>
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-primary-foreground" data-testid="text-user-initials">
            JD
          </span>
        </div>
      </div>
    </header>
  );
}
