import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Play,
  Pause,
  Mail,
  MessageSquare,
  Calendar,
  Users,
  BarChart3,
  Copy
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Campaign {
  id: string;
  name: string;
  type: "email" | "sms" | "multi-channel";
  status: "active" | "paused" | "draft" | "completed";
  leads: number;
  sent: number;
  opened: number;
  clicked: number;
  replied: number;
  scheduledFor?: string;
  createdAt: string;
}

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Q1 2024 Product Launch",
    type: "multi-channel",
    status: "active",
    leads: 2500,
    sent: 2450,
    opened: 1089,
    clicked: 234,
    replied: 87,
    createdAt: "Jan 15, 2024"
  },
  {
    id: "2",
    name: "Enterprise Follow-up Sequence",
    type: "email",
    status: "active",
    leads: 850,
    sent: 820,
    opened: 412,
    clicked: 98,
    replied: 45,
    createdAt: "Jan 10, 2024"
  },
  {
    id: "3",
    name: "Demo Request Nurture",
    type: "email",
    status: "paused",
    leads: 320,
    sent: 280,
    opened: 145,
    clicked: 32,
    replied: 12,
    createdAt: "Jan 5, 2024"
  },
  {
    id: "4",
    name: "Re-engagement Campaign",
    type: "sms",
    status: "draft",
    leads: 1200,
    sent: 0,
    opened: 0,
    clicked: 0,
    replied: 0,
    scheduledFor: "Feb 1, 2024",
    createdAt: "Jan 20, 2024"
  },
  {
    id: "5",
    name: "Holiday Promotion",
    type: "multi-channel",
    status: "completed",
    leads: 5000,
    sent: 4980,
    opened: 2145,
    clicked: 567,
    replied: 203,
    createdAt: "Dec 15, 2023"
  },
];

const getStatusStyle = (status: Campaign["status"]) => {
  switch (status) {
    case "active":
      return { variant: "success" as const, icon: <Play size={12} /> };
    case "paused":
      return { variant: "warning" as const, icon: <Pause size={12} /> };
    case "draft":
      return { variant: "muted" as const, icon: null };
    case "completed":
      return { variant: "accent" as const, icon: null };
  }
};

const getTypeIcon = (type: Campaign["type"]) => {
  switch (type) {
    case "email":
      return <Mail size={16} className="text-primary" />;
    case "sms":
      return <MessageSquare size={16} className="text-accent" />;
    case "multi-channel":
      return (
        <div className="flex -space-x-1">
          <Mail size={14} className="text-primary" />
          <MessageSquare size={14} className="text-accent" />
        </div>
      );
  }
};

const Campaigns = () => {
  return (
    <DashboardLayout 
      title="Campaigns" 
      subtitle="Create and manage your outreach campaigns"
      actions={
        <Button variant="accent" size="sm">
          <Plus size={16} />
          New Campaign
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="metric-card">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Play size={14} />
              <span className="text-xs font-medium uppercase tracking-wide">Active</span>
            </div>
            <p className="text-2xl font-bold">2</p>
          </div>
          <div className="metric-card">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Users size={14} />
              <span className="text-xs font-medium uppercase tracking-wide">Total Leads</span>
            </div>
            <p className="text-2xl font-bold">9,870</p>
          </div>
          <div className="metric-card">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Mail size={14} />
              <span className="text-xs font-medium uppercase tracking-wide">Emails Sent</span>
            </div>
            <p className="text-2xl font-bold">8,530</p>
          </div>
          <div className="metric-card">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <BarChart3 size={14} />
              <span className="text-xs font-medium uppercase tracking-wide">Avg. Open Rate</span>
            </div>
            <p className="text-2xl font-bold">44.2%</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search campaigns..."
              className="input-field pl-9 w-full"
            />
          </div>
          <Button variant="outline">
            <Filter size={16} />
            Filter
          </Button>
        </div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockCampaigns.map((campaign) => {
            const statusInfo = getStatusStyle(campaign.status);
            const openRate = campaign.sent > 0 ? ((campaign.opened / campaign.sent) * 100).toFixed(1) : 0;
            const replyRate = campaign.sent > 0 ? ((campaign.replied / campaign.sent) * 100).toFixed(1) : 0;

            return (
              <div key={campaign.id} className="chart-container hover-lift cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(campaign.type)}
                    <Badge variant={statusInfo.variant} className="gap-1">
                      {statusInfo.icon}
                      {campaign.status}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="icon-sm">
                    <MoreHorizontal size={16} />
                  </Button>
                </div>

                <h3 className="font-semibold text-lg mb-1 line-clamp-1">{campaign.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {campaign.leads.toLocaleString()} leads • Created {campaign.createdAt}
                </p>

                {campaign.status !== "draft" && (
                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
                    <div className="text-center">
                      <p className="text-lg font-bold">{campaign.sent.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Sent</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-success">{openRate}%</p>
                      <p className="text-xs text-muted-foreground">Opened</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-accent">{replyRate}%</p>
                      <p className="text-xs text-muted-foreground">Replied</p>
                    </div>
                  </div>
                )}

                {campaign.status === "draft" && campaign.scheduledFor && (
                  <div className="flex items-center gap-2 pt-4 border-t border-border text-sm text-muted-foreground">
                    <Calendar size={14} />
                    <span>Scheduled for {campaign.scheduledFor}</span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Add Campaign Card */}
          <div className="chart-container border-dashed flex flex-col items-center justify-center min-h-[200px] cursor-pointer hover:bg-muted/30 transition-colors">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-3">
              <Plus size={24} className="text-accent" />
            </div>
            <p className="font-medium">Create New Campaign</p>
            <p className="text-sm text-muted-foreground">Email, SMS, or Multi-channel</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Campaigns;
