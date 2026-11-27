import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth"; // path to your Better Auth server instance
import { headers } from "next/headers";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the user session from the auth API
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object
  });

  return (
    <>
      <SidebarProvider>
        <AppSidebar user={session?.user} />
        <SidebarInset className="outline outline-border">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
