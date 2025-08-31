import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  AlertTriangle, 
  Home, 
  Settings2, 
  BarChart3, 
  Settings, 
  HelpCircle,
  Zap
} from "lucide-react";

const navigationItems = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/control", icon: Settings2, label: "Control Panel" },
  { path: "/alerts", icon: AlertTriangle, label: "Alerts & Notifications", badge: 3 },
  { path: "/household", icon: Home, label: "Household Usage" },
  
  { path: "/reports", icon: BarChart3, label: "Reports & Analytics" },
  { path: "/settings", icon: Settings, label: "Settings & Language" },
  { path: "/help", icon: HelpCircle, label: "Help & Training" },
];

export default function Sidebar({ isMobileNavOpen, toggleMobileNav }) {
  const [location] = useLocation();

  const NavLink = ({ item }) => {
    const { path, icon: Icon, label, badge } = item;
    const isActive = location === path;

    return (
      <Link
        href={path}
        data-testid={`nav-link-${path.slice(1) || 'dashboard'}`}
        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        }`}
      >
        <Icon className="w-5 h-5 mr-3" />
        {label}
        {badge && (
          <span className="ml-auto bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full">
            {badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="bg-card border-r border-border w-64 flex-shrink-0 hidden lg:flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold text-primary flex items-center">
            <Zap className="w-8 h-8 mr-3 text-primary" />
            EnergyFlow
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => (
            <NavLink key={item.path} item={item} />
          ))}
        </nav>
      </aside>

      {/* Mobile Navigation Overlay */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={toggleMobileNav}></div>
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h1 className="text-xl font-bold text-primary flex items-center">
                <Zap className="w-8 h-8 mr-3 text-primary" />
                EnergyFlow
              </h1>
              <button 
                onClick={toggleMobileNav} 
                className="p-2 hover:bg-accent rounded-lg"
                data-testid="button-close-mobile-nav"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <nav className="p-4 space-y-2" onClick={toggleMobileNav}>
              {navigationItems.map((item) => (
                <NavLink key={item.path} item={item} />
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
