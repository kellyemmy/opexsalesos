import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { 
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Mail,
  MessageSquare,
  Users,
  Target,
  ArrowUpRight
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line
} from "recharts";

const weeklyData = [
  { name: "Week 1", emails: 12400, sms: 3200, replies: 890 },
  { name: "Week 2", emails: 15600, sms: 4100, replies: 1230 },
  { name: "Week 3", emails: 13800, sms: 3800, replies: 980 },
  { name: "Week 4", emails: 18200, sms: 4800, replies: 1450 },
];

const conversionData = [
  { stage: "Contacted", value: 100, count: 12847 },
  { stage: "Opened", value: 68, count: 8736 },
  { stage: "Clicked", value: 24, count: 3083 },
  { stage: "Replied", value: 12, count: 1542 },
  { stage: "Meeting", value: 5, count: 642 },
  { stage: "Closed", value: 2.1, count: 270 },
];

const performanceMetrics = [
  { title: "Email Deliverability", value: "98.2%", change: "+0.5%", positive: true, icon: <Mail size={20} /> },
  { title: "Average Open Rate", value: "42.8%", change: "+3.2%", positive: true, icon: <Target size={20} /> },
  { title: "Click-through Rate", value: "8.4%", change: "-0.8%", positive: false, icon: <ArrowUpRight size={20} /> },
  { title: "Reply Rate", value: "12.0%", change: "+1.4%", positive: true, icon: <MessageSquare size={20} /> },
];

const Analytics = () => {
  return (
    <DashboardLayout 
      title="Analytics" 
      subtitle="Track your sales engagement performance"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar size={16} />
            Last 30 Days
          </Button>
          <Button variant="outline" size="sm">
            <Download size={16} />
            Export Report
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {performanceMetrics.map((metric) => (
            <div key={metric.title} className="metric-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="stat-label">{metric.title}</p>
                  <p className="stat-value mt-1">{metric.value}</p>
                  <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${metric.positive ? 'text-success' : 'text-destructive'}`}>
                    {metric.positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    <span>{metric.change} vs last period</span>
                  </div>
                </div>
                <div className="w-11 h-11 rounded-xl bg-accent/15 flex items-center justify-center text-accent">
                  {metric.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Outreach */}
          <div className="chart-container">
            <h3 className="text-lg font-semibold mb-6">Weekly Outreach Volume</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'hsl(215, 15%, 45%)', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'hsl(215, 15%, 45%)', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(0, 0%, 100%)', 
                    border: '1px solid hsl(214, 20%, 90%)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="emails" fill="hsl(215, 50%, 23%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sms" fill="hsl(175, 65%, 40%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-sm text-muted-foreground">Emails</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent"></div>
                <span className="text-sm text-muted-foreground">SMS</span>
              </div>
            </div>
          </div>

          {/* Reply Trend */}
          <div className="chart-container">
            <h3 className="text-lg font-semibold mb-6">Reply Trend</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={weeklyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'hsl(215, 15%, 45%)', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'hsl(215, 15%, 45%)', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(0, 0%, 100%)', 
                    border: '1px solid hsl(214, 20%, 90%)',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="replies" 
                  stroke="hsl(152, 60%, 40%)" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(152, 60%, 40%)', strokeWidth: 2, r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-6">Conversion Funnel</h3>
          <div className="flex items-end justify-between gap-4 h-64">
            {conversionData.map((stage, i) => (
              <div key={stage.stage} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full rounded-t-lg transition-all duration-500"
                  style={{ 
                    height: `${(stage.value / 100) * 200}px`,
                    background: `linear-gradient(180deg, hsl(175, 65%, ${40 + i * 5}%) 0%, hsl(175, 65%, ${50 + i * 5}%) 100%)`
                  }}
                ></div>
                <div className="text-center mt-3">
                  <p className="text-xl font-bold">{stage.value}%</p>
                  <p className="text-sm text-muted-foreground">{stage.stage}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stage.count.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
