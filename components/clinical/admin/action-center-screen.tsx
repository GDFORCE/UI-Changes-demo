"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckSquare, LifeBuoy, ShieldAlert, Bell } from "lucide-react";
import { MasterDataScreen } from "@/components/clinical/screens/admin/master-data-screen";
import { SupportTicketScreen } from "@/components/clinical/screens/admin/support-ticket-screen";
import { SystemAlertsScreen } from "@/components/clinical/screens/admin/system-alerts-screen";
import { NotificationMonitoringScreen } from "@/components/clinical/screens/admin/notification-monitoring-screen";

interface ActionCenterScreenProps {
  defaultTab?: "approvals" | "issues" | "alerts" | "notifications";
}

// Approximate "needs attention" counts shown as tab badges.
const counts = { approvals: 3, issues: 7, alerts: 4, notifications: 12 };

function TabBadge({ n, tone }: { n: number; tone: "red" | "amber" }) {
  if (!n) return null;
  return (
    <span
      className={`ml-1.5 h-4 min-w-4 px-1 rounded-full text-[10px] font-semibold flex items-center justify-center ${
        tone === "red" ? "bg-destructive text-white" : "bg-warning text-white"
      }`}
    >
      {n}
    </span>
  );
}

/**
 * Unified admin action hub — consolidates everything that needs admin action:
 * ADM-05 Pending Approvals, ADM-10 Issue Management, ADM-11 System Alerts,
 * ADM-07 Notification Monitoring. Each tab renders the existing screen as-is.
 */
export function ActionCenterScreen({ defaultTab = "approvals" }: ActionCenterScreenProps) {
  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <div className="px-6 lg:px-8 pt-6 max-w-[1400px] mx-auto">
        <div className="mb-3">
          <h1 className="text-xl font-bold text-primary">Action Center</h1>
          <p className="text-sm text-muted-foreground">
            Everything that needs admin attention — approvals, issues, alerts and notification failures — in one place.
          </p>
        </div>
        <TabsList className="bg-card border border-border rounded-lg h-auto p-1 flex-wrap">
          <TabsTrigger value="approvals" className="text-sm gap-1">
            <CheckSquare className="h-4 w-4" /> Pending Approvals <TabBadge n={counts.approvals} tone="amber" />
          </TabsTrigger>
          <TabsTrigger value="issues" className="text-sm gap-1">
            <LifeBuoy className="h-4 w-4" /> Issues &amp; Tickets <TabBadge n={counts.issues} tone="red" />
          </TabsTrigger>
          <TabsTrigger value="alerts" className="text-sm gap-1">
            <ShieldAlert className="h-4 w-4" /> System Alerts <TabBadge n={counts.alerts} tone="amber" />
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-sm gap-1">
            <Bell className="h-4 w-4" /> Notifications <TabBadge n={counts.notifications} tone="red" />
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="approvals" className="mt-0">
        <MasterDataScreen />
      </TabsContent>
      <TabsContent value="issues" className="mt-0">
        <SupportTicketScreen />
      </TabsContent>
      <TabsContent value="alerts" className="mt-0">
        <SystemAlertsScreen />
      </TabsContent>
      <TabsContent value="notifications" className="mt-0">
        <NotificationMonitoringScreen />
      </TabsContent>
    </Tabs>
  );
}
