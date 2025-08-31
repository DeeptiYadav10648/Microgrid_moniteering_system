import { useQuery } from "@tanstack/react-query";
import { Sun, Zap, Battery, TrendingUp } from "lucide-react";

export default function SummaryCards() {
  const { data: energyData } = useQuery({
    queryKey: ["/api/energy/current"],
    refetchInterval: 5000,
  });

  if (!energyData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Energy Generated Today",
      value: `${energyData.totalGeneration.toFixed(1)} kWh`,
      change: "+12% from yesterday",
      changeType: "positive",
      icon: Sun,
      bgColor: "bg-yellow-500/20",
      iconColor: "text-yellow-500",
      testId: "card-energy-generated"
    },
    {
      title: "Energy Consumed Today", 
      value: `${energyData.totalConsumption.toFixed(1)} kWh`,
      change: "+8% from yesterday",
      changeType: "negative",
      icon: Zap,
      bgColor: "bg-red-500/20",
      iconColor: "text-red-500",
      testId: "card-energy-consumed"
    },
    {
      title: "Battery Level",
      value: `${energyData.batteryLevel.toFixed(0)}%`,
      change: "Excellent Health",
      changeType: "positive",
      icon: Battery,
      bgColor: "bg-green-500/20", 
      iconColor: "text-green-500",
      testId: "card-battery-level"
    },
    {
      title: "Efficiency",
      value: `${energyData.efficiency.toFixed(1)}%`,
      change: "Above target",
      changeType: "positive",
      icon: TrendingUp,
      bgColor: "bg-blue-500/20",
      iconColor: "text-blue-500",
      testId: "card-efficiency"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.title} className="bg-card border border-border rounded-lg p-6" data-testid={card.testId}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p 
                  className={`text-2xl font-bold ${
                    card.changeType === 'positive' ? 'text-primary' : 'text-destructive'
                  }`}
                  data-testid={`text-${card.testId}-value`}
                >
                  {card.value}
                </p>
              </div>
              <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
            </div>
            <p 
              className={`text-sm mt-2 ${
                card.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
              }`}
              data-testid={`text-${card.testId}-change`}
            >
              {card.change}
            </p>
          </div>
        );
      })}
    </div>
  );
}
