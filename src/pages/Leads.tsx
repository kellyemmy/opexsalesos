import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Upload, 
  Download, 
  Search, 
  Filter, 
  MoreHorizontal,
  Mail,
  Phone,
  Building2,
  MapPin,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  location: string;
  status: "new" | "contacted" | "qualified" | "negotiation" | "closed";
  source: string;
  lastContact: string;
}

const mockLeads: Lead[] = [
  { 
    id: "1", 
    name: "Sarah Chen", 
    email: "sarah.chen@techcorp.com", 
    phone: "+1 (555) 123-4567",
    company: "TechCorp Inc.", 
    title: "VP of Operations",
    location: "San Francisco, CA",
    status: "negotiation", 
    source: "LinkedIn",
    lastContact: "2 hours ago"
  },
  { 
    id: "2", 
    name: "Michael Rodriguez", 
    email: "m.rodriguez@innovate.io", 
    phone: "+1 (555) 234-5678",
    company: "Innovate.io", 
    title: "CTO",
    location: "Austin, TX",
    status: "qualified", 
    source: "Website",
    lastContact: "1 day ago"
  },
  { 
    id: "3", 
    name: "Emily Watson", 
    email: "emily.w@globalfin.com", 
    phone: "+1 (555) 345-6789",
    company: "Global Finance Ltd", 
    title: "Director of IT",
    location: "New York, NY",
    status: "contacted", 
    source: "Referral",
    lastContact: "3 days ago"
  },
  { 
    id: "4", 
    name: "David Kim", 
    email: "dkim@startupx.co", 
    phone: "+1 (555) 456-7890",
    company: "StartupX", 
    title: "CEO",
    location: "Seattle, WA",
    status: "new", 
    source: "Cold Outreach",
    lastContact: "Never"
  },
  { 
    id: "5", 
    name: "Jessica Park", 
    email: "jpark@enterprise.com", 
    phone: "+1 (555) 567-8901",
    company: "Enterprise Solutions", 
    title: "Head of Procurement",
    location: "Chicago, IL",
    status: "closed", 
    source: "LinkedIn",
    lastContact: "1 week ago"
  },
];

const getStatusBadge = (status: Lead["status"]) => {
  switch (status) {
    case "new":
      return <Badge variant="muted">New</Badge>;
    case "contacted":
      return <Badge variant="accent">Contacted</Badge>;
    case "qualified":
      return <Badge variant="warning">Qualified</Badge>;
    case "negotiation":
      return <Badge variant="accent">Negotiation</Badge>;
    case "closed":
      return <Badge variant="success">Closed</Badge>;
  }
};

const Leads = () => {
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleLead = (id: string) => {
    setSelectedLeads(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id) 
        : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedLeads(prev => 
      prev.length === mockLeads.length 
        ? [] 
        : mockLeads.map(l => l.id)
    );
  };

  return (
    <DashboardLayout 
      title="Leads" 
      subtitle="Manage and organize your sales leads"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload size={16} />
            <span className="hidden md:inline">Import</span>
          </Button>
          <Button variant="outline" size="sm">
            <Download size={16} />
            <span className="hidden md:inline">Export</span>
          </Button>
          <Button variant="accent" size="sm">
            <Plus size={16} />
            Add Lead
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search leads by name, email, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-9 w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="default">
              <Filter size={16} />
              Filter
            </Button>
            {selectedLeads.length > 0 && (
              <>
                <Button variant="accent" size="default">
                  <Mail size={16} />
                  Email ({selectedLeads.length})
                </Button>
                <Button variant="outline" size="default">
                  <Phone size={16} />
                  SMS
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Leads Table */}
        <div className="chart-container p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="py-3 px-4 text-left">
                    <input 
                      type="checkbox"
                      checked={selectedLeads.length === mockLeads.length}
                      onChange={toggleAll}
                      className="w-4 h-4 rounded border-border"
                    />
                  </th>
                  <th className="table-header text-left py-3 px-4">Lead</th>
                  <th className="table-header text-left py-3 px-4">Company</th>
                  <th className="table-header text-left py-3 px-4">Status</th>
                  <th className="table-header text-left py-3 px-4">Source</th>
                  <th className="table-header text-left py-3 px-4">Last Contact</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {mockLeads.map((lead) => (
                  <tr 
                    key={lead.id} 
                    className={cn(
                      "table-row cursor-pointer",
                      selectedLeads.includes(lead.id) && "bg-accent/5"
                    )}
                  >
                    <td className="py-4 px-4">
                      <input 
                        type="checkbox"
                        checked={selectedLeads.includes(lead.id)}
                        onChange={() => toggleLead(lead.id)}
                        className="w-4 h-4 rounded border-border"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {lead.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{lead.name}</p>
                          <p className="text-sm text-muted-foreground">{lead.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="flex items-center gap-1.5 text-sm">
                          <Building2 size={14} className="text-muted-foreground" />
                          <span className="font-medium">{lead.company}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{lead.title}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(lead.status)}
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">
                      {lead.source}
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">
                      {lead.lastContact}
                    </td>
                    <td className="py-4 px-4">
                      <Button variant="ghost" size="icon-sm">
                        <MoreHorizontal size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">1-5</span> of <span className="font-medium text-foreground">2,847</span> leads
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft size={16} />
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Leads;
