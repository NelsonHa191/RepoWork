"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Code,
  PlusIcon,
} from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "better-auth";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarHistory } from "./sidebar-history";
import { useAppContext } from "@/lib/app-context";

// Sample data for navigation
const sampleData = {
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Code Editor",
      url: "/code",
      icon: Code,
      items: [
        {
          title: "Playground",
          url: "/code",
        },
        {
          title: "My Scripts",
          url: "/code/scripts",
        },
        {
          title: "Templates",
          url: "/code/templates",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({
  user,
  showNavigation = false,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: User | undefined;
  showNavigation?: boolean;
}) {
  const router = useRouter();
  const { setShowModeSwitcher } = useAppContext?.() || {
    setShowModeSwitcher: () => {},
  };

  // Create a handler function for the logo click
  const handleLogoClick = () => {
    // Show the mode switcher when clicking the logo to go back to home
    if (setShowModeSwitcher) {
      setShowModeSwitcher(true);
    }
    router.push("/");
    router.refresh();
  };

  // SVG Logo element - extracted since it's used multiple times
  const LogoSVG = () => (
    <svg
      width="34"
      height="34"
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.3082 6.81283C22.4222 6.52018 23.5525 7.22647 23.7777 8.35598L26.3715 21.3601C26.5785 22.3976 25.9416 23.4168 24.9184 23.6857L12.0933 27.055C10.9793 27.3477 9.84903 26.6414 9.62374 25.5119L7.02996 12.5077C6.82301 11.4702 7.45989 10.451 8.48313 10.1822L21.3082 6.81283Z"
        fill="white"
      />
      <path
        d="M23.252 7.97433L25.902 19.4529C26.0884 20.2601 25.5851 21.0656 24.7779 21.2519L13.2993 23.902C12.4921 24.0883 11.6867 23.585 11.5003 22.7778L8.85026 11.2992C8.66391 10.492 9.1672 9.68661 9.97439 9.50025L21.453 6.85021C22.2602 6.66385 23.0656 7.16714 23.252 7.97433Z"
        fill="black"
        stroke="white"
      />
      <path
        d="M22.9689 5.70802L23.0869 6.02687C23.2388 6.43745 23.5626 6.76116 23.9731 6.91309L24.292 7.03107C24.7273 7.19215 24.7273 7.80785 24.292 7.96893L23.9731 8.08691C23.5626 8.23884 23.2388 8.56255 23.0869 8.97313L22.9689 9.29198C22.8078 9.72728 22.1922 9.72728 22.0311 9.29198L21.9131 8.97313C21.7612 8.56255 21.4374 8.23884 21.0269 8.08691L20.708 7.96893C20.2727 7.80785 20.2727 7.19215 20.708 7.03107L21.0269 6.91309C21.4374 6.76116 21.7612 6.43745 21.9131 6.02687L22.0311 5.70802C22.1922 5.27272 22.8078 5.27272 22.9689 5.70802Z"
        fill="white"
        stroke="black"
      />
      <rect x="20" y="12" width="1" height="6" rx="0.5" fill="white" />
      <rect x="15" y="12" width="1" height="14" rx="0.5" fill="black" />
      <path
        d="M15 12.5C15 12.2239 15.2239 12 15.5 12V12C15.7761 12 16 12.2239 16 12.5V15.5C16 15.7761 15.7761 16 15.5 16V16C15.2239 16 15 15.7761 15 15.5V12.5Z"
        fill="#FE00C7"
      />
      <path
        d="M20 12.5C20 12.2239 20.2239 12 20.5 12V12C20.7761 12 21 12.2239 21 12.5V15.5C21 15.7761 20.7761 16 20.5 16V16C20.2239 16 20 15.7761 20 15.5V12.5Z"
        fill="#FE00C7"
      />
    </svg>
  );

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        {showNavigation ? (
          <button className="cursor-pointer" onClick={handleLogoClick}>
            <LogoSVG />
          </button>
        ) : (
          <SidebarMenu>
            <SidebarMenuItem className="mx-auto mb-1">
              <Link href="/" onClick={handleLogoClick}>
                <LogoSVG />
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="New Chat"
                onClick={() => {
                  router.push("/");
                  router.refresh();
                }}
                className="cursor-pointer"
              >
                <PlusIcon />
                <span>New Chat</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarHeader>

      <SidebarContent>
        {showNavigation ? (
          <>
            <NavMain items={sampleData.navMain} />
            <NavProjects projects={sampleData.projects} />
          </>
        ) : (
          <SidebarHistory userId={user?.id} />
        )}
      </SidebarContent>

      <SidebarFooter>
        <ThemeToggle />
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
