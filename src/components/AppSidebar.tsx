import { useState } from "react";
import { MessageCircle, Plus, Trash2, Clock } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

interface AppSidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onConversationSelect: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
}

export function AppSidebar({ 
  conversations, 
  activeConversationId, 
  onConversationSelect, 
  onNewConversation,
  onDeleteConversation 
}: AppSidebarProps) {
  const { state } = useSidebar();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const isCollapsed = state === "collapsed";

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const truncateTitle = (title: string, maxLength: number) => {
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  };

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-80"} collapsible="icon">
      <SidebarContent className="bg-card border-r border-border">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Chat History
              </h2>
            )}
            <SidebarTrigger />
          </div>
          
          {!isCollapsed && (
            <Button
              onClick={onNewConversation}
              className="w-full mt-3 bg-gradient-to-r from-primary to-primary/90 hover:shadow-md transition-all duration-200"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          )}
          
          {isCollapsed && (
            <Button
              onClick={onNewConversation}
              className="w-8 h-8 mt-3 p-0 bg-gradient-to-r from-primary to-primary/90 hover:shadow-md transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Conversations List */}
        <SidebarGroup className="flex-1">
          {!isCollapsed && (
            <SidebarGroupLabel className="px-4 py-2 text-muted-foreground text-xs uppercase tracking-wide">
              Recent Conversations
            </SidebarGroupLabel>
          )}
          
          <SidebarGroupContent className="px-2">
            <SidebarMenu className="space-y-1">
              {conversations.map((conversation) => (
                <SidebarMenuItem key={conversation.id}>
                  <SidebarMenuButton
                    onClick={() => onConversationSelect(conversation.id)}
                    onMouseEnter={() => setHoveredId(conversation.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className={cn(
                      "w-full h-auto p-3 flex items-start gap-3 rounded-lg transition-all duration-200",
                      "hover:bg-accent hover:text-accent-foreground",
                      activeConversationId === conversation.id && "bg-primary/10 text-primary border border-primary/20"
                    )}
                  >
                    {isCollapsed ? (
                      <MessageCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    ) : (
                      <>
                        <MessageCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-medium text-sm leading-tight truncate">
                              {truncateTitle(conversation.title, 25)}
                            </h3>
                            {hoveredId === conversation.id && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteConversation(conversation.id);
                                }}
                                className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {truncateTitle(conversation.lastMessage, 40)}
                          </p>
                          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{formatTime(conversation.timestamp)}</span>
                            <span>•</span>
                            <span>{conversation.messageCount} messages</span>
                          </div>
                        </div>
                      </>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              {conversations.length === 0 && !isCollapsed && (
                <div className="px-3 py-8 text-center text-muted-foreground">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No conversations yet</p>
                  <p className="text-xs mt-1">Start a new chat to begin</p>
                </div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}