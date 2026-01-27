import { 
  Users, 
  Mail, 
  MessageSquare, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  MousePointerClick,
  Eye,
  Send,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  change?: {
    value: string;
    positive: boolean;
  };
  icon: React.ReactNode;
  iconColor?: string;
}

const MetricCard = ({ title, value, change, icon, iconColor = "bg-primary/10 text-primary" }: MetricCardProps) => {
  return (
    <div className="metric-card hover-lift animate-slide-up">
      <div className="flex items-start justify-between">
        <div>
          <p className="stat-label">{title}</p>
          <p className="stat-value mt-1">{value}</p>
          {change && (
            <div className={cn(
              "flex items-center gap-1 mt-2 text-sm font-medium",
              change.positive ? "text-success" : "text-destructive"
            )}>
              {change.positive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              <span>{change.value}</span>
              <span className="text-muted-foreground font-normal">vs last week</span>
            </div>
          )}
        </div>
        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", iconColor)}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export const MetricCards = () => {
  const metrics = [
    {
      title: "Total Leads",
      value: "12,847",
      change: { value: "+12.5%", positive: true },
      icon: <Users size={22} />,
      iconColor: "bg-accent/15 text-accent",
    },
    {
      title: "Emails Sent",
      value: "48,392",
      change: { value: "+8.2%", positive: true },
      icon: <Mail size={22} />,
      iconColor: "bg-primary/15 text-primary",
    },
    {
      title: "Open Rate",
      value: "42.8%",
      change: { value: "+3.1%", positive: true },
      icon: <Eye size={22} />,
      iconColor: "bg-success/15 text-success",
    },
    {
      title: "Reply Rate",
      value: "18.4%",
      change: { value: "-1.2%", positive: false },
      icon: <MessageSquare size={22} />,
      iconColor: "bg-warning/15 text-warning",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {metrics.map((metric, i) => (
        <div key={metric.title} style={{ animationDelay: `${i * 0.1}s` }}>
          <MetricCard {...metric} />
        </div>
      ))}
    </div>
  );
};

export const CampaignMetrics = () => {
  const campaigns = [
    { name: "Q1 Outreach", sent: 2450, opened: 1089, clicked: 234, replied: 87, status: "active" },
    { name: "Product Launch", sent: 5200, opened: 2340, clicked: 567, replied: 203, status: "active" },
    { name: "Follow-up Series", sent: 1890, opened: 756, clicked: 145, replied: 52, status: "paused" },
    { name: "Re-engagement", sent: 3100, opened: 1023, clicked: 198, replied: 71, status: "completed" },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "active": return "badge-success";
      case "paused": return "badge-warning";
      case "completed": return "badge-accent";
      default: return "";
    }
  };

  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Recent Campaigns</h3>
        <button className="text-sm text-accent hover:underline font-medium">View All</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="table-header text-left pb-3">Campaign</th>
              <th className="table-header text-right pb-3">Sent</th>
              <th className="table-header text-right pb-3">Opened</th>
              <th className="table-header text-right pb-3">Clicked</th>
              <th className="table-header text-right pb-3">Replied</th>
              <th className="table-header text-right pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr key={campaign.name} className="table-row">
                <td className="py-4">
                  <span className="font-medium">{campaign.name}</span>
                </td>
                <td className="text-right py-4 text-muted-foreground">{campaign.sent.toLocaleString()}</td>
                <td className="text-right py-4">
                  <span className="text-foreground">{campaign.opened.toLocaleString()}</span>
                  <span className="text-muted-foreground text-xs ml-1">
                    ({((campaign.opened / campaign.sent) * 100).toFixed(1)}%)
                  </span>
                </td>
                <td className="text-right py-4">
                  <span className="text-foreground">{campaign.clicked.toLocaleString()}</span>
                  <span className="text-muted-foreground text-xs ml-1">
                    ({((campaign.clicked / campaign.sent) * 100).toFixed(1)}%)
                  </span>
                </td>
                <td className="text-right py-4">
                  <span className="text-foreground">{campaign.replied}</span>
                  <span className="text-muted-foreground text-xs ml-1">
                    ({((campaign.replied / campaign.sent) * 100).toFixed(1)}%)
                  </span>
                </td>
                <td className="text-right py-4">
                  <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium capitalize", getStatusStyle(campaign.status))}>
                    {campaign.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
