import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DEMO_USER } from "@/lib/demo/user";

export default function Layout({ children }: { children: React.ReactNode }) {
  // Demo: everyone is signed in as the demo user (the original read the
  // Better Auth session here).
  return (
    <>
      <SidebarProvider>
        <AppSidebar user={DEMO_USER} />
        <SidebarInset className="outline outline-border">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
