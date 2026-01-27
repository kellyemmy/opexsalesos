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
  PieChart,
  Pie,
  Cell
} from "recharts";

const emailData = [
  { name: "Mon", sent: 1200, opened: 680, clicked: 120 },
  { name: "Tue", sent: 1900, opened: 890, clicked: 180 },
  { name: "Wed", sent: 2400, opened: 1100, clicked: 240 },
  { name: "Thu", sent: 1800, opened: 950, clicked: 190 },
  { name: "Fri", sent: 2200, opened: 1020, clicked: 210 },
  { name: "Sat", sent: 800, opened: 340, clicked: 65 },
  { name: "Sun", sent: 600, opened: 280, clicked: 45 },
];

const leadSourceData = [
  { name: "LinkedIn", value: 35 },
  { name: "Website", value: 28 },
  { name: "Referral", value: 20 },
  { name: "Cold Outreach", value: 17 },
];

const COLORS = ["hsl(175, 65%, 40%)", "hsl(215, 50%, 23%)", "hsl(152, 60%, 40%)", "hsl(38, 92%, 50%)"];

export const EmailPerformanceChart = () => {
  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Email Performance</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent"></div>
            <span className="text-muted-foreground">Sent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span className="text-muted-foreground">Opened</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success"></div>
            <span className="text-muted-foreground">Clicked</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={emailData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="sentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(175, 65%, 40%)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(175, 65%, 40%)" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="openedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(215, 50%, 23%)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(215, 50%, 23%)" stopOpacity={0}/>
            </linearGradient>
          </defs>
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
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="sent" 
            stroke="hsl(175, 65%, 40%)" 
            strokeWidth={2}
            fill="url(#sentGradient)" 
          />
          <Area 
            type="monotone" 
            dataKey="opened" 
            stroke="hsl(215, 50%, 23%)" 
            strokeWidth={2}
            fill="url(#openedGradient)" 
          />
          <Area 
            type="monotone" 
            dataKey="clicked" 
            stroke="hsl(152, 60%, 40%)" 
            strokeWidth={2}
            fill="transparent" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const LeadSourceChart = () => {
  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold mb-6">Lead Sources</h3>
      
      <div className="flex items-center gap-6">
        <ResponsiveContainer width={180} height={180}>
          <PieChart>
            <Pie
              data={leadSourceData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {leadSourceData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="flex-1 space-y-3">
          {leadSourceData.map((source, index) => (
            <div key={source.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index] }}
                ></div>
                <span className="text-sm text-muted-foreground">{source.name}</span>
              </div>
              <span className="text-sm font-semibold">{source.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
