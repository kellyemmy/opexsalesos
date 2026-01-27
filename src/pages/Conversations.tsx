import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search,
  Filter,
  Mail,
  MessageSquare,
  Phone,
  Clock,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  leadName: string;
  leadEmail: string;
  company: string;
  lastMessage: string;
  lastMessageType: "email" | "sms";
  lastMessageTime: string;
  unread: boolean;
  status: "active" | "waiting" | "closed";
  messageCount: number;
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    leadName: "Sarah Chen",
    leadEmail: "sarah.chen@techcorp.com",
    company: "TechCorp Inc.",
    lastMessage: "That sounds great! Can we schedule a call for next week to discuss the pricing?",
    lastMessageType: "email",
    lastMessageTime: "10 min ago",
    unread: true,
    status: "active",
    messageCount: 12
  },
  {
    id: "2",
    leadName: "Michael Rodriguez",
    leadEmail: "m.rodriguez@innovate.io",
    company: "Innovate.io",
    lastMessage: "Thanks for the info. I'll review with my team and get back to you.",
    lastMessageType: "email",
    lastMessageTime: "2 hours ago",
    unread: false,
    status: "waiting",
    messageCount: 8
  },
  {
    id: "3",
    leadName: "Emily Watson",
    leadEmail: "emily.w@globalfin.com",
    company: "Global Finance Ltd",
    lastMessage: "Yes, please send over the proposal.",
    lastMessageType: "sms",
    lastMessageTime: "1 day ago",
    unread: false,
    status: "active",
    messageCount: 5
  },
  {
    id: "4",
    leadName: "David Kim",
    leadEmail: "dkim@startupx.co",
    company: "StartupX",
    lastMessage: "Hi David, I wanted to follow up on our conversation about...",
    lastMessageType: "email",
    lastMessageTime: "3 days ago",
    unread: false,
    status: "waiting",
    messageCount: 3
  },
];

const Conversations = () => {
  return (
    <DashboardLayout 
      title="Conversations" 
      subtitle="View and manage all your lead interactions"
    >
      <div className="flex gap-6 h-[calc(100vh-180px)]">
        {/* Conversation List */}
        <div className="w-96 flex-shrink-0 flex flex-col">
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search conversations..."
              className="input-field pl-9 w-full"
            />
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Button variant="secondary" size="sm">All</Button>
            <Button variant="ghost" size="sm">Unread</Button>
            <Button variant="ghost" size="sm">Active</Button>
            <Button variant="ghost" size="sm">Waiting</Button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {mockConversations.map((conv, i) => (
              <div 
                key={conv.id}
                className={cn(
                  "p-4 rounded-xl cursor-pointer transition-all",
                  i === 0 ? "bg-accent/10 border border-accent/20" : "bg-card hover:bg-muted/50 border border-border"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {conv.leadName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className={cn("font-medium text-sm", conv.unread && "font-semibold")}>
                        {conv.leadName}
                      </p>
                      <p className="text-xs text-muted-foreground">{conv.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {conv.unread && (
                      <div className="w-2 h-2 rounded-full bg-accent"></div>
                    )}
                    <span className="text-xs text-muted-foreground">{conv.lastMessageTime}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  {conv.lastMessageType === "email" ? (
                    <Mail size={12} className="text-muted-foreground mt-1 flex-shrink-0" />
                  ) : (
                    <MessageSquare size={12} className="text-muted-foreground mt-1 flex-shrink-0" />
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-2">{conv.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversation Detail */}
        <div className="flex-1 chart-container flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-semibold text-primary">SC</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Sarah Chen</h3>
                <p className="text-sm text-muted-foreground">TechCorp Inc. • VP of Operations</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Phone size={16} />
                Call
              </Button>
              <Button variant="accent" size="sm">
                <Sparkles size={16} />
                AI Follow-up
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            <div className="flex justify-end">
              <div className="max-w-md bg-primary text-primary-foreground rounded-2xl rounded-br-md p-4">
                <p className="text-sm">Hi Sarah, I noticed that TechCorp is expanding into new markets. I'd love to discuss how Opex Consulting can help streamline your operations during this growth phase.</p>
                <p className="text-xs opacity-70 mt-2">You • 2 days ago</p>
              </div>
            </div>
            
            <div className="flex justify-start">
              <div className="max-w-md bg-muted rounded-2xl rounded-bl-md p-4">
                <p className="text-sm">Thanks for reaching out! We are indeed looking at ways to improve our operational efficiency. Can you tell me more about what you offer?</p>
                <p className="text-xs text-muted-foreground mt-2">Sarah • 1 day ago</p>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="max-w-md bg-primary text-primary-foreground rounded-2xl rounded-br-md p-4">
                <p className="text-sm">Absolutely! We specialize in process optimization, supply chain consulting, and digital transformation. I'd be happy to share some case studies from similar companies in your industry.</p>
                <p className="text-xs opacity-70 mt-2">You • 1 day ago</p>
              </div>
            </div>

            <div className="flex justify-start">
              <div className="max-w-md bg-muted rounded-2xl rounded-bl-md p-4">
                <p className="text-sm">That sounds great! Can we schedule a call for next week to discuss the pricing?</p>
                <p className="text-xs text-muted-foreground mt-2">Sarah • 10 min ago</p>
              </div>
            </div>
          </div>

          {/* Reply */}
          <div className="pt-4 border-t border-border">
            <div className="flex items-center gap-2 mb-3">
              <Button variant="secondary" size="sm" className="gap-1">
                <Mail size={14} />
                Email
              </Button>
              <Button variant="ghost" size="sm" className="gap-1">
                <MessageSquare size={14} />
                SMS
              </Button>
            </div>
            <div className="flex gap-3">
              <textarea 
                placeholder="Type your reply..."
                className="input-field flex-1 min-h-[80px] resize-none"
              />
              <Button variant="accent" className="self-end">
                Send
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Conversations;
