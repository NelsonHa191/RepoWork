import { useQuery } from "@tanstack/react-query";
import { getHistoryByUserId } from "@/app/(chat)/actions";
import { isToday, isYesterday, subMonths, subWeeks } from "date-fns";
import { Chat } from "@/lib/db/schema";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

import Link from "next/link";
import { memo, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { BookOpen, Rocket } from "lucide-react";

type GroupedChats = {
  today: Chat[];
  yesterday: Chat[];
  lastWeek: Chat[];
  lastMonth: Chat[];
  older: Chat[];
};

const PureChatItem = ({
  chat,
  isActive,
}: {
  chat: Chat;
  isActive: boolean;
}) => {
  // Determine the correct URL based on chat mode
  const chatUrl =
    chat.mode === "learn" ? `/learn/${chat.id}` : `/explore/${chat.id}`;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link href={chatUrl}>
          <span className="flex items-center gap-1">
            {chat.mode === "learn" ? (
              <BookOpen className="w-3 h-3 text-primary/70" />
            ) : (
              <Rocket className="w-3 h-3 text-accent/70" />
            )}
            <span className="truncate">{chat.title}</span>
          </span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export const ChatItem = memo(PureChatItem, (prevProps, nextProps) => {
  if (prevProps.isActive !== nextProps.isActive) return false;
  return true;
});

export function SidebarHistory({ userId }: { userId: string | undefined }) {
  const { id } = useParams();
  const pathname = usePathname();
  const [activeMode, setActiveMode] = useState<"all" | "explore" | "learn">(
    "all"
  );

  const { data: history, isLoading } = useQuery({
    queryKey: ["history", pathname, userId, activeMode],
    queryFn: () => getHistoryByUserId(userId || "", activeMode),
    enabled: !!userId,
  });

  // Filter chats by mode
  const filterChatsByMode = (
    chats: Chat[] | undefined,
    mode: string | null
  ): Chat[] => {
    if (!chats || !Array.isArray(chats)) return [];
    if (!mode || mode === "all") return chats;

    return chats.filter((chat) => {
      if (!chat.mode && mode === "explore") return true; // Legacy chats without mode default to explore
      return chat.mode === mode;
    });
  };

  const filteredChats = filterChatsByMode(history as Chat[], activeMode);

  if (!userId) {
    return (
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupContent>
          <div className="px-2">Login to save and revisit previous chats!</div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  if (isLoading) {
    return (
      <SidebarGroup>
        <div className="px-2 py-1 text-xs text-sidebar-foreground/50">
          Today
        </div>
        <SidebarGroupContent>
          <div className="flex flex-col">
            {[44, 32, 28, 64, 52].map((item) => (
              <div
                key={item}
                className="rounded-md h-8 flex gap-2 px-2 items-center"
              >
                <div
                  className="h-4 rounded-md flex-1 max-w-[--skeleton-width] bg-sidebar-accent-foreground/10"
                  style={
                    {
                      "--skeleton-width": `${item}%`,
                    } as React.CSSProperties
                  }
                />
              </div>
            ))}
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  if (Array.isArray(history) && history.length === 0) {
    return (
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupContent>
          <div className="px-2 text-zinc-500 w-full flex flex-row justify-center items-center text-sm gap-2">
            Your conversations will appear here once you start chatting!
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  const groupChatsByDate = (chats: Chat[]): GroupedChats => {
    const now = new Date();
    const oneWeekAgo = subWeeks(now, 1);
    const oneMonthAgo = subMonths(now, 1);

    return chats.reduce(
      (groups, chat) => {
        const chatDate = new Date(chat.createdAt);

        if (isToday(chatDate)) {
          groups.today.push(chat);
        } else if (isYesterday(chatDate)) {
          groups.yesterday.push(chat);
        } else if (chatDate > oneWeekAgo) {
          groups.lastWeek.push(chat);
        } else if (chatDate > oneMonthAgo) {
          groups.lastMonth.push(chat);
        } else {
          groups.older.push(chat);
        }

        return groups;
      },
      {
        today: [],
        yesterday: [],
        lastWeek: [],
        lastMonth: [],
        older: [],
      } as GroupedChats
    );
  };

  // Function to render chats grouped by date
  const renderChatsByDate = (groupedChats: GroupedChats) => {
    return (
      <SidebarMenu>
        {groupedChats.today.length > 0 && (
          <>
            <div className="px-2 py-1 text-xs text-sidebar-foreground/50">
              Today
            </div>
            {groupedChats.today.map((chat) => (
              <ChatItem key={chat.id} chat={chat} isActive={chat.id === id} />
            ))}
          </>
        )}

        {groupedChats.yesterday.length > 0 && (
          <>
            <div className="px-2 py-1 text-xs text-sidebar-foreground/50 mt-4">
              Yesterday
            </div>
            {groupedChats.yesterday.map((chat) => (
              <ChatItem key={chat.id} chat={chat} isActive={chat.id === id} />
            ))}
          </>
        )}

        {groupedChats.lastWeek.length > 0 && (
          <>
            <div className="px-2 py-1 text-xs text-sidebar-foreground/50 mt-4">
              Last 7 days
            </div>
            {groupedChats.lastWeek.map((chat) => (
              <ChatItem key={chat.id} chat={chat} isActive={chat.id === id} />
            ))}
          </>
        )}

        {groupedChats.lastMonth.length > 0 && (
          <>
            <div className="px-2 py-1 text-xs text-sidebar-foreground/50 mt-4">
              Last 30 days
            </div>
            {groupedChats.lastMonth.map((chat) => (
              <ChatItem key={chat.id} chat={chat} isActive={chat.id === id} />
            ))}
          </>
        )}

        {groupedChats.older.length > 0 && (
          <>
            <div className="px-2 py-1 text-xs text-sidebar-foreground/50 mt-4">
              Older
            </div>
            {groupedChats.older.map((chat) => (
              <ChatItem key={chat.id} chat={chat} isActive={chat.id === id} />
            ))}
          </>
        )}
      </SidebarMenu>
    );
  };

  return (
    <>
      {/* Tabbed filter buttons for explore/learn modes */}
      <div className="flex justify-between p-2 mb-2">
        <div
          className={`flex-1 text-center py-1 px-2 rounded-l-md cursor-pointer ${
            activeMode === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-muted/50"
          }`}
          onClick={() => setActiveMode("all")}
        >
          All
        </div>
        <div
          className={`flex-1 text-center py-1 px-2 cursor-pointer flex items-center justify-center ${
            activeMode === "explore"
              ? "bg-primary text-primary-foreground"
              : "bg-muted/50"
          }`}
          onClick={() => setActiveMode("explore")}
        >
          <Rocket className="w-3 h-3 mr-1" />
          Explore
        </div>
        <div
          className={`flex-1 text-center py-1 px-2 rounded-r-md cursor-pointer flex items-center justify-center ${
            activeMode === "learn"
              ? "bg-primary text-primary-foreground"
              : "bg-muted/50"
          }`}
          onClick={() => setActiveMode("learn")}
        >
          <BookOpen className="w-3 h-3 mr-1" />
          Learn
        </div>
      </div>

      {/* Show all history grouped by date */}
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        {activeMode === "all" ? (
          <SidebarGroupLabel>History</SidebarGroupLabel>
        ) : activeMode === "explore" ? (
          <SidebarGroupLabel className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-accent/70" />
            <span>Explore</span>
          </SidebarGroupLabel>
        ) : (
          <SidebarGroupLabel className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary/70" />
            <span>Learn</span>
          </SidebarGroupLabel>
        )}

        {renderChatsByDate(groupChatsByDate(filteredChats))}
      </SidebarGroup>
    </>
  );
}
