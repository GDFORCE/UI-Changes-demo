"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Building2 } from "lucide-react";
import { UserManagementScreen } from "@/components/clinical/screens/admin/user-management-screen";
import { OrganizationManagementScreen } from "@/components/clinical/screens/admin/organization-management-screen";

interface UserOrgManagementScreenProps {
  defaultTab?: "users" | "orgs";
  initialFilter?: string;
}

/**
 * Combined ADM-02 (User Management) + ADM-03 (Organization Management) into a
 * single screen with tabs. Each tab renders the existing full screen as-is.
 */
export function UserOrgManagementScreen({ defaultTab = "users", initialFilter }: UserOrgManagementScreenProps) {
  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <div className="px-6 lg:px-8 pt-6 max-w-[1400px] mx-auto">
        <TabsList className="bg-card border border-border rounded-lg h-auto p-1">
          <TabsTrigger value="users" className="text-sm gap-1.5">
            <Users className="h-4 w-4" /> Users
          </TabsTrigger>
          <TabsTrigger value="orgs" className="text-sm gap-1.5">
            <Building2 className="h-4 w-4" /> Organizations
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="users" className="mt-0">
        <UserManagementScreen initialFilter={initialFilter} />
      </TabsContent>
      <TabsContent value="orgs" className="mt-0">
        <OrganizationManagementScreen />
      </TabsContent>
    </Tabs>
  );
}
