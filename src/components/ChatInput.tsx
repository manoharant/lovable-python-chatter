import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput = ({ 
  onSendMessage, 
  disabled = false, 
  placeholder = "Type your message..." 
}: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-border bg-background p-4">
      <div className="flex gap-3 items-end max-w-4xl mx-auto">
        <div className="flex-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "min-h-[44px] max-h-32 resize-none border-input bg-chat-input-background",
              "focus:ring-2 focus:ring-primary focus:border-transparent",
              "transition-all duration-200"
            )}
            rows={1}
          />
        </div>
        <Button
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          className={cn(
            "h-[44px] w-[44px] p-0 rounded-xl",
            "bg-gradient-to-r from-primary to-primary/90",
            "hover:shadow-lg hover:scale-105",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
            "transition-all duration-200"
          )}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};