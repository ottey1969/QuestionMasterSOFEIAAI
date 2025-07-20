import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, MessageCircle, Zap, Brain, Copy, Check, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  service?: string;
  creditsUsed?: number;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [credits, setCredits] = useState<number | 'unlimited'>(5);
  const [userIp, setUserIp] = useState<string>('');
  const { sessionId } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Function to convert markdown to formatted HTML
  const convertMarkdownToHTML = (text: string): string => {
    let html = text;
    
    // Headers (H1-H6)
    html = html.replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2 text-gray-900">$1</h3>');
    html = html.replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-6 mb-3 text-gray-900">$1</h2>');
    html = html.replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-6 mb-4 text-gray-900">$1</h1>');
    
    // Bold and italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em class="italic text-gray-800">$1</em>');
    
    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm font-mono overflow-x-auto my-3"><code>$1</code></pre>');
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-200 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">$1</code>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline font-medium" target="_blank" rel="noopener">$1</a>');
    
    // Bullet points
    html = html.replace(/^\s*[-*+]\s+(.*)$/gm, '<li class="ml-4">$1</li>');
    
    // Numbered lists  
    html = html.replace(/^\s*\d+\.\s+(.*)$/gm, '<li class="ml-4 numbered">$1</li>');
    
    // Wrap consecutive list items
    html = html.replace(/(<li class="ml-4"[^>]*>.*?<\/li>\s*)+/g, '<ul class="list-disc list-inside space-y-1 my-3 text-gray-800">$&</ul>');
    html = html.replace(/(<li class="ml-4 numbered"[^>]*>.*?<\/li>\s*)+/g, '<ol class="list-decimal list-inside space-y-1 my-3 text-gray-800">$&</ol>');
    
    // Clean up numbered class
    html = html.replace(/class="ml-4 numbered"/g, 'class="ml-4"');
    
    // Line breaks and paragraphs
    html = html.replace(/\n\n/g, '</p><p class="mb-3">');
    html = html.replace(/\n/g, '<br>');
    
    // Wrap in paragraph if not already wrapped
    if (!html.startsWith('<')) {
      html = '<p class="mb-3 text-gray-800">' + html + '</p>';
    }
    
    return html;
  };

  // Function to convert plain text to HTML with basic formatting
  const convertToHTML = (text: string): string => {
    return text
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/^(.*)$/, '<p>$1</p>');
  };

  const copyAsHTML = async (message: Message) => {
    try {
      const htmlContent = convertMarkdownToHTML(message.content);
      await navigator.clipboard.writeText(htmlContent);
      setCopiedMessageId(message.id);
      toast({
        title: "Copied as HTML",
        description: "Response copied to clipboard in HTML format.",
      });
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const copyAsText = async (message: Message) => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedMessageId(message.id);
      toast({
        title: "Copied as text",
        description: "Response copied to clipboard.",
      });
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!sessionId) return;

    // Initialize WebSocket connection
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'response') {
          setIsThinking(false);
          const aiMessage: Message = {
            id: Date.now().toString(),
            content: data.content,
            sender: 'ai',
            timestamp: new Date(),
            service: data.service,
            creditsUsed: data.creditsUsed
          };
          setMessages(prev => [...prev, aiMessage]);
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
        setIsThinking(false);
      }
    };

    socket.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    return () => {
      socket.close();
    };
  }, [sessionId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !sessionId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    // Immediate visual feedback - show user message and start thinking animation instantly
    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    setIsLoading(true);
    setIsThinking(true);
    
    // Add a small delay to show the thinking animation before processing
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      // Send via WebSocket for real-time response
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({
          type: 'chat',
          content: newMessage.trim(),
          sessionId
        }));
      } else {
        // Fallback to HTTP API
        const response = await fetch('/api/chat/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: newMessage.trim(),
            sessionId
          })
        });

        if (!response.ok) {
          throw new Error('Failed to send message');
        }

        const data = await response.json();
        setIsThinking(false);
        const aiMessage: Message = {
          id: Date.now().toString(),
          content: data.response,
          sender: 'ai',
          timestamp: new Date(),
          service: data.service,
          creditsUsed: data.creditsUsed
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error: any) {
      toast({
        title: "Failed to send message",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsThinking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Sofeia AI Chat
                </h1>
                <p className="text-sm text-gray-600">
                  Powered by Advanced AI • {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
                  {credits !== undefined && (
                    <span className="ml-2">
                      • Credits: {credits === 'unlimited' ? '♾️ Unlimited' : `${credits} remaining`}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto p-4">
        <Card className="flex flex-col shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <CardTitle className="text-lg">AI Assistant</CardTitle>
              <div className="ml-auto flex items-center gap-1 text-sm">
                <Zap className="h-4 w-4" />
                <span>Real-time Chat</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            <div className="flex-1 p-4 max-h-[70vh] overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-12">
                  <div className="p-4 bg-gray-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <MessageCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Welcome to Sofeia AI</h3>
                  <p className="text-sm">Start a conversation by typing a message below.</p>
                  <p className="text-xs text-gray-400 mt-2">Your session ID: {sessionId}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                            : 'bg-white text-gray-900 border border-gray-200 shadow-sm'
                        }`}
                      >
                        <div 
                          className={`text-sm leading-relaxed prose prose-sm max-w-none ${
                            message.sender === 'ai' ? 'prose-gray' : 'prose-invert text-white'
                          }`}
                          dangerouslySetInnerHTML={{
                            __html: message.sender === 'ai' ? convertMarkdownToHTML(message.content) : message.content
                          }}
                        />
                        
                        {/* AI Message Footer with Service Info and Copy Buttons */}
                        {message.sender === 'ai' && (
                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              {message.service && (
                                <span className="bg-gray-200 px-2 py-1 rounded text-xs">
                                  {message.service}
                                </span>
                              )}
                              {message.creditsUsed && (
                                <span className="text-xs">
                                  {message.creditsUsed} credit{message.creditsUsed > 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyAsText(message)}
                                className="h-7 px-2 text-xs hover:bg-gray-200"
                              >
                                {copiedMessageId === message.id ? (
                                  <Check className="h-3 w-3" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                                <span className="ml-1">Text</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyAsHTML(message)}
                                className="h-7 px-2 text-xs hover:bg-gray-200"
                              >
                                {copiedMessageId === message.id ? (
                                  <Check className="h-3 w-3" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                                <span className="ml-1">HTML</span>
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        {/* Timestamp */}
                        <p className={`text-xs mt-2 ${
                          message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isThinking && (
                    <div className="flex justify-start animate-in slide-in-from-left-2 duration-300">
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 max-w-[80%] shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1">
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce"></div>
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Brain className="w-4 h-4 text-blue-600 animate-pulse" />
                              <span className="text-sm text-blue-700 font-medium">Sofeia AI is analyzing...</span>
                            </div>
                            <p className="text-xs text-blue-600 mt-1 animate-pulse">
                              Processing with advanced AI reasoning
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSendMessage} className="p-4 border-t bg-gray-50">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message here..."
                    disabled={!sessionId || isLoading}
                    className={`w-full transition-all duration-200 ${
                      isLoading ? 'bg-gray-100 border-blue-300' : 'focus:ring-2 focus:ring-blue-500'
                    }`}
                  />
                  {isLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="flex gap-1">
                        <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
                        <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  )}
                </div>
                <Button 
                  type="submit" 
                  disabled={!newMessage.trim() || !sessionId || isLoading}
                  className={`bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 ${
                    isLoading ? 'scale-95 opacity-75' : 'hover:scale-105'
                  }`}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">
                  {isLoading ? (
                    <span className="text-blue-600 animate-pulse">
                      ⚡ Processing your message...
                    </span>
                  ) : isConnected ? (
                    '🟢 Connected via WebSocket for real-time responses'
                  ) : (
                    '🔴 Using HTTP fallback'
                  )}
                </p>
                {newMessage.trim() && !isLoading && (
                  <p className="text-xs text-gray-400 animate-pulse">
                    Press Enter to send
                  </p>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center py-6 text-sm text-gray-500">
        <p>© 2025 Sofeia AI Agent • Founder/CEO: Ottmar Francisca</p>
      </div>
    </div>
  );
}