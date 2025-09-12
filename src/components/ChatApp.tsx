import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar, type Conversation } from "@/components/AppSidebar";
import { ChatInterface, type Message } from "@/components/ChatInterface";
import { useToast } from "@/hooks/use-toast";

interface ConversationData {
  id: string;
  title: string;
  messages: Message[];
}

export const ChatApp = () => {
  const [conversations, setConversations] = useState<ConversationData[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

  // Load conversations from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('chatbot-conversations');
    if (saved) {
      try {
        const parsedConversations = JSON.parse(saved);
        setConversations(parsedConversations);
        if (parsedConversations.length > 0) {
          setActiveConversationId(parsedConversations[0].id);
        }
      } catch (error) {
        console.error('Failed to load conversations:', error);
      }
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('chatbot-conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  const generateTitle = (firstMessage: string): string => {
    const words = firstMessage.trim().split(' ').slice(0, 4);
    return words.length > 0 ? words.join(' ') : 'New Conversation';
  };

  const createNewConversation = (): string => {
    const newId = `conv_${Date.now()}`;
    const newConversation: ConversationData = {
      id: newId,
      title: 'New Conversation',
      messages: [{
        id: `msg_${Date.now()}`,
        text: "Hello! I'm your AI assistant. How can I help you today?",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]
    };

    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newId);
    return newId;
  };

  const handleNewConversation = () => {
    createNewConversation();
    toast({
      title: "New conversation started",
      description: "You can now start chatting!"
    });
  };

  const handleConversationSelect = (id: string) => {
    setActiveConversationId(id);
  };

  const handleDeleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    
    if (activeConversationId === id) {
      const remainingConversations = conversations.filter(c => c.id !== id);
      setActiveConversationId(remainingConversations.length > 0 ? remainingConversations[0].id : null);
      
      if (remainingConversations.length === 0) {
        createNewConversation();
      }
    }

    toast({
      title: "Conversation deleted",
      description: "The conversation has been removed from history."
    });
  };

  const handleSendMessage = async (text: string) => {
    if (!activeConversationId) {
      const newConvId = createNewConversation();
      setActiveConversationId(newConvId);
    }

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      text,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update conversation with user message
    setConversations(prev => prev.map(conv => {
      if (conv.id === activeConversationId) {
        const updatedMessages = [...conv.messages, userMessage];
        const newTitle = conv.title === 'New Conversation' ? generateTitle(text) : conv.title;
        
        return {
          ...conv,
          title: newTitle,
          messages: updatedMessages
        };
      }
      return conv;
    }));

    setIsTyping(true);

    // Simulate AI response (replace with actual Python backend call)
    setTimeout(() => {
      const botResponse: Message = {
        id: `msg_${Date.now() + 1}`,
        text: `I received your message: "${text}". This is a demo response. Connect this to your Python chatbot backend to get real responses!`,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setConversations(prev => prev.map(conv => {
        if (conv.id === activeConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, botResponse]
          };
        }
        return conv;
      }));
      
      setIsTyping(false);
    }, 1500);
  };

  // Create sidebar conversations data
  const sidebarConversations: Conversation[] = conversations.map(conv => ({
    id: conv.id,
    title: conv.title,
    lastMessage: conv.messages.length > 0 
      ? conv.messages[conv.messages.length - 1].text 
      : 'No messages',
    timestamp: new Date(), // You might want to store actual timestamps
    messageCount: conv.messages.length
  }));

  // Initialize with first conversation if none exist
  useEffect(() => {
    if (conversations.length === 0 && !activeConversationId) {
      createNewConversation();
    }
  }, []);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar
          conversations={sidebarConversations}
          activeConversationId={activeConversationId}
          onConversationSelect={handleConversationSelect}
          onNewConversation={handleNewConversation}
          onDeleteConversation={handleDeleteConversation}
        />
        
        <div className="flex-1 flex flex-col">
          {/* Global trigger in header */}
          <header className="h-12 flex items-center border-b border-border bg-card px-4 lg:hidden">
            <SidebarTrigger />
          </header>
          
          <main className="flex-1">
            <ChatInterface
              messages={activeConversation?.messages || []}
              onSendMessage={handleSendMessage}
              isTyping={isTyping}
              conversationTitle={activeConversation?.title || 'AI Chatbot'}
            />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};