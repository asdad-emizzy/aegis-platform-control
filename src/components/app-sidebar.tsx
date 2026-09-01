import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Boxes,
  Server,
  GitBranch,
  ShieldCheck,
  Workflow,
  Sparkles,
  BarChart3,
  Settings,
  ShieldHalf,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const nav = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "Services", url: "/inventory", icon: Boxes },
  { title: "Infrastructure", url: "/clusters", icon: Server },
  { title: "Platform Lifecycle", url: "/lifecycle", icon: GitBranch },
  { title: "Compatibility", url: "/compatibility", icon: ShieldCheck },
  { title: "Automations", url: "/jobs", icon: Workflow },
  { title: "Decision Support", url: "/recommendations", icon: Sparkles },
  { title: "Observability", url: "/grafana", icon: BarChart3 },
];

export function AppSidebar() {
  const currentPath = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (p: string) => (p === "/" ? currentPath === "/" : currentPath.startsWith(p));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15 text-primary ring-1 ring-primary/30">
            <ShieldHalf className="h-4 w-4" />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold tracking-tight">Aegis</span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Control Plane
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/settings")} tooltip="Settings">
                  <Link to="/settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-1.5 text-xs group-data-[collapsible=icon]:hidden">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-chart-4 ring-1 ring-border" />
          <div className="flex flex-col leading-tight">
            <span className="font-medium">Alex Rossi</span>
            <span className="text-muted-foreground">Platform SRE</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
