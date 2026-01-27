import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User,
  Users,
  Shield,
  Bell,
  Key,
  Globe,
  Database,
  Webhook,
  ChevronRight,
  Plus,
  Mail,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";

const teamMembers = [
  { name: "John Smith", email: "john@opexconsulting.com", role: "Admin", avatar: "JS" },
  { name: "Sarah Johnson", email: "sarah@opexconsulting.com", role: "Manager", avatar: "SJ" },
  { name: "Mike Chen", email: "mike@opexconsulting.com", role: "Sales Rep", avatar: "MC" },
  { name: "Emily Davis", email: "emily@opexconsulting.com", role: "Sales Rep", avatar: "ED" },
];

const settingsSections = [
  {
    title: "Account",
    items: [
      { icon: <User size={18} />, label: "Profile Settings", description: "Manage your personal information" },
      { icon: <Bell size={18} />, label: "Notifications", description: "Configure email and push notifications" },
      { icon: <Key size={18} />, label: "Security", description: "Password, 2FA, and session management" },
    ]
  },
  {
    title: "Integrations",
    items: [
      { icon: <Mail size={18} />, label: "Email Provider", description: "Connect your email sending service", connected: true },
      { icon: <Database size={18} />, label: "CRM Integration", description: "Sync with Salesforce, HubSpot, etc.", connected: false },
      { icon: <Webhook size={18} />, label: "Webhooks & API", description: "Configure webhooks and API access" },
    ]
  },
  {
    title: "Organization",
    items: [
      { icon: <Globe size={18} />, label: "General Settings", description: "Timezone, language, and preferences" },
      { icon: <Shield size={18} />, label: "Roles & Permissions", description: "Configure team access levels" },
    ]
  },
];

const Settings = () => {
  return (
    <DashboardLayout 
      title="Settings" 
      subtitle="Manage your account and organization settings"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-2 space-y-6">
          {settingsSections.map((section) => (
            <div key={section.title} className="chart-container">
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <div className="space-y-2">
                {section.items.map((item) => (
                  <button
                    key={item.label}
                    className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                        {item.icon}
                      </div>
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {"connected" in item && (
                        <Badge variant={item.connected ? "success" : "muted"}>
                          {item.connected ? (
                            <>
                              <Check size={12} className="mr-1" />
                              Connected
                            </>
                          ) : "Not Connected"}
                        </Badge>
                      )}
                      <ChevronRight size={18} className="text-muted-foreground" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Team Members */}
        <div className="chart-container h-fit">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users size={20} className="text-accent" />
              Team Members
            </h3>
            <Button variant="outline" size="sm">
              <Plus size={14} />
              Invite
            </Button>
          </div>

          <div className="space-y-3">
            {teamMembers.map((member) => (
              <div 
                key={member.email}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">{member.avatar}</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <Badge 
                  variant={member.role === "Admin" ? "accent" : member.role === "Manager" ? "warning" : "muted"}
                >
                  {member.role}
                </Badge>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground text-center">
              4 of 10 seats used
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
