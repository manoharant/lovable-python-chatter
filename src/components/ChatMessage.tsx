import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
}

export const ChatMessage = ({ message, isUser, timestamp }: ChatMessageProps) => {
  return (
    <div className={cn(
      "flex w-full mb-4",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] md:max-w-[70%] px-4 py-3 rounded-2xl transition-all duration-200",
        isUser 
          ? "bg-chat-user-bubble text-chat-user-text rounded-br-md" 
          : "bg-chat-bot-bubble text-chat-bot-text rounded-bl-md border border-border shadow-sm"
      )}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message}
        </p>
        {timestamp && (
          <p className={cn(
            "text-xs mt-2 opacity-70",
            isUser ? "text-chat-user-text" : "text-muted-foreground"
          )}>
            {timestamp}
          </p>
        )}
      </div>
    </div>
  );
};