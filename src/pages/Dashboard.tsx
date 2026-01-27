import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricCards, CampaignMetrics } from "@/components/dashboard/MetricCards";
import { EmailPerformanceChart, LeadSourceChart } from "@/components/dashboard/Charts";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { Button } from "@/components/ui/button";
import { Plus, Download, RefreshCw } from "lucide-react";

const Dashboard = () => {
  return (
    <DashboardLayout 
      title="Dashboard" 
      subtitle="Welcome back, John. Here's your sales engagement overview."
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw size={16} />
            <span className="hidden md:inline">Refresh</span>
          </Button>
          <Button variant="outline" size="sm">
            <Download size={16} />
            <span className="hidden md:inline">Export</span>
          </Button>
          <Button variant="accent" size="sm">
            <Plus size={16} />
            New Campaign
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Metric Cards */}
        <MetricCards />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <EmailPerformanceChart />
          </div>
          <LeadSourceChart />
        </div>

        {/* Tables and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CampaignMetrics />
          </div>
          <ActivityFeed />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
