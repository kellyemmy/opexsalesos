import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Copy,
  Edit,
  Trash2,
  Sparkles,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Template {
  id: string;
  name: string;
  type: "email" | "sms";
  subject?: string;
  preview: string;
  category: string;
  usageCount: number;
  aiGenerated: boolean;
  lastUsed: string;
}

const mockTemplates: Template[] = [
  {
    id: "1",
    name: "Initial Outreach",
    type: "email",
    subject: "Quick question about {{company}}",
    preview: "Hi {{first_name}}, I noticed that {{company}} is expanding into...",
    category: "Cold Outreach",
    usageCount: 1245,
    aiGenerated: false,
    lastUsed: "2 hours ago"
  },
  {
    id: "2",
    name: "Follow-up #1",
    type: "email",
    subject: "Following up on my previous email",
    preview: "Hi {{first_name}}, I wanted to circle back on my email from last week...",
    category: "Follow-up",
    usageCount: 892,
    aiGenerated: true,
    lastUsed: "1 day ago"
  },
  {
    id: "3",
    name: "Demo Request Response",
    type: "email",
    subject: "Your demo with Opex Consulting",
    preview: "Thanks for your interest in Opex Consulting! I'd love to show you how...",
    category: "Demo",
    usageCount: 567,
    aiGenerated: false,
    lastUsed: "3 days ago"
  },
  {
    id: "4",
    name: "Quick Check-in SMS",
    type: "sms",
    preview: "Hi {{first_name}}, just wanted to check if you had a chance to review our proposal?",
    category: "Follow-up",
    usageCount: 234,
    aiGenerated: true,
    lastUsed: "5 hours ago"
  },
  {
    id: "5",
    name: "Meeting Reminder",
    type: "sms",
    preview: "Hi {{first_name}}, looking forward to our call tomorrow at {{time}}!",
    category: "Reminder",
    usageCount: 189,
    aiGenerated: false,
    lastUsed: "1 week ago"
  },
  {
    id: "6",
    name: "Negotiation Closer",
    type: "email",
    subject: "Special offer for {{company}}",
    preview: "Hi {{first_name}}, I've spoken with my team and we can offer you...",
    category: "Negotiation",
    usageCount: 456,
    aiGenerated: true,
    lastUsed: "2 days ago"
  },
];

const categories = ["All", "Cold Outreach", "Follow-up", "Demo", "Negotiation", "Reminder"];

const Templates = () => {
  return (
    <DashboardLayout 
      title="Templates" 
      subtitle="Manage your email and SMS templates"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Sparkles size={16} />
            <span className="hidden md:inline">Generate with AI</span>
          </Button>
          <Button variant="accent" size="sm">
            <Plus size={16} />
            New Template
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search templates..."
              className="input-field pl-9 w-full"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <Button 
                key={cat} 
                variant={cat === "All" ? "secondary" : "ghost"} 
                size="sm"
                className="whitespace-nowrap"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockTemplates.map((template) => (
            <div 
              key={template.id} 
              className="chart-container group hover-lift cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {template.type === "email" ? (
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Mail size={16} className="text-primary" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                      <MessageSquare size={16} className="text-accent" />
                    </div>
                  )}
                  <Badge variant="muted" className="text-xs">
                    {template.category}
                  </Badge>
                  {template.aiGenerated && (
                    <Badge variant="accent" className="gap-1 text-xs">
                      <Sparkles size={10} />
                      AI
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon-sm">
                    <Copy size={14} />
                  </Button>
                  <Button variant="ghost" size="icon-sm">
                    <Edit size={14} />
                  </Button>
                </div>
              </div>

              <h3 className="font-semibold mb-1">{template.name}</h3>
              {template.subject && (
                <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                  Subject: {template.subject}
                </p>
              )}
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {template.preview}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-muted-foreground">
                <span>Used {template.usageCount.toLocaleString()} times</span>
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{template.lastUsed}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Create Template Card */}
          <div className="chart-container border-dashed flex flex-col items-center justify-center min-h-[200px] cursor-pointer hover:bg-muted/30 transition-colors">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-3">
              <Plus size={24} className="text-accent" />
            </div>
            <p className="font-medium">Create Template</p>
            <p className="text-sm text-muted-foreground text-center">
              Build from scratch or generate with AI
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Templates;
