import { 
  Clock, 
  Mail, 
  MessageSquare, 
  UserPlus, 
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  type: "email_sent" | "sms_sent" | "lead_added" | "reply_received" | "deal_closed" | "bounce";
  message: string;
  time: string;
}

const activities: Activity[] = [
  { id: "1", type: "reply_received", message: "Sarah Chen replied to Q1 Outreach campaign", time: "2 min ago" },
  { id: "2", type: "deal_closed", message: "Deal closed with TechCorp Inc. - $45,000", time: "15 min ago" },
  { id: "3", type: "email_sent", message: "Bulk email sent to 250 leads", time: "32 min ago" },
  { id: "4", type: "lead_added", message: "45 new leads imported from CSV", time: "1 hour ago" },
  { id: "5", type: "bounce", message: "3 emails bounced in Product Launch campaign", time: "2 hours ago" },
  { id: "6", type: "sms_sent", message: "SMS campaign sent to 180 contacts", time: "3 hours ago" },
];

const getActivityIcon = (type: Activity["type"]) => {
  switch (type) {
    case "email_sent":
      return <Mail size={16} />;
    case "sms_sent":
      return <MessageSquare size={16} />;
    case "lead_added":
      return <UserPlus size={16} />;
    case "reply_received":
      return <MessageSquare size={16} />;
    case "deal_closed":
      return <CheckCircle size={16} />;
    case "bounce":
      return <AlertCircle size={16} />;
  }
};

const getActivityColor = (type: Activity["type"]) => {
  switch (type) {
    case "email_sent":
      return "bg-primary/15 text-primary";
    case "sms_sent":
      return "bg-accent/15 text-accent";
    case "lead_added":
      return "bg-success/15 text-success";
    case "reply_received":
      return "bg-success/15 text-success";
    case "deal_closed":
      return "bg-accent/15 text-accent";
    case "bounce":
      return "bg-destructive/15 text-destructive";
  }
};

export const ActivityFeed = () => {
  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <button className="text-sm text-accent hover:underline font-medium">View All</button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div 
            key={activity.id} 
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
              getActivityColor(activity.type)
            )}>
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground leading-snug">{activity.message}</p>
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <Clock size={12} />
                <span>{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
