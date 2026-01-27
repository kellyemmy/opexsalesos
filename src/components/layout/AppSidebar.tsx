import { useState } from "react";
import { 
  LayoutDashboard, 
  Users, 
  Mail, 
  MessageSquare, 
  FileText, 
  BarChart3, 
  Settings, 
  Palette,
  ChevronLeft,
  ChevronRight,
  Zap,
  LogOut
} from "lucide-react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}

const NavItem = ({ to, icon, label, collapsed }: NavItemProps) => {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "nav-item group relative",
          isActive && "active"
        )
      }
    >
      <span className="flex-shrink-0">{icon}</span>
      {!collapsed && <span className="truncate">{label}</span>}
      {collapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
          {label}
        </div>
      )}
    </RouterNavLink>
  );
};

const mainNavItems = [
  { to: "/", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
  { to: "/leads", icon: <Users size={20} />, label: "Leads" },
  { to: "/campaigns", icon: <Mail size={20} />, label: "Campaigns" },
  { to: "/conversations", icon: <MessageSquare size={20} />, label: "Conversations" },
  { to: "/templates", icon: <FileText size={20} />, label: "Templates" },
  { to: "/analytics", icon: <BarChart3 size={20} />, label: "Analytics" },
];

const bottomNavItems = [
  { to: "/brand", icon: <Palette size={20} />, label: "Brand Settings" },
  { to: "/settings", icon: <Settings size={20} />, label: "Settings" },
];

export const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar flex flex-col transition-all duration-300 z-40",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "h-16 flex items-center border-b border-sidebar-border px-4",
        collapsed ? "justify-center" : "gap-3"
      )}>
        <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center flex-shrink-0">
          <Zap size={20} className="text-sidebar-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sidebar-foreground font-bold text-lg leading-tight">Opex</span>
            <span className="text-sidebar-foreground/60 text-xs">Sales Engage</span>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {mainNavItems.map((item) => (
          <NavItem key={item.to} {...item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-sidebar-border py-4 px-3 space-y-1">
        {bottomNavItems.map((item) => (
          <NavItem key={item.to} {...item} collapsed={collapsed} />
        ))}
        <button className="nav-item w-full text-left opacity-70 hover:opacity-100">
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center shadow-sm hover:bg-muted transition-colors"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
};
