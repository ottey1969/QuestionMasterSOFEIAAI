import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Brain, Search, FileText, Coins, MessageCircle, Heart, Settings, 
  Users, BarChart3, Shield, Moon, Sun, LogOut, CreditCard, History,
  UserCheck, Globe, Zap, Loader2
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@shared/schema";
import { AIServiceModal } from "@/components/AIServiceModal";
import { ChatWidget } from "@/components/ChatWidget";
import PayPalButton from "@/components/PayPalButton";

type ServiceType = 'general' | 'seo' | 'grant';

export default function Home() {
  const [activeModal, setActiveModal] = useState<ServiceType | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [loadingService, setLoadingService] = useState<ServiceType | null>(null);
  const [loadingText, setLoadingText] = useState("");
  
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const handleWhatsApp = () => {
    window.open("https://wa.me/31628073996", "_blank");
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleServiceClick = (serviceType: ServiceType) => {
    setLoadingService(serviceType);
    
    // Set progressive loading messages based on service type
    const messages = {
      general: [
        "Initializing Groq AI...",
        "Connecting to knowledge base...",
        "Preparing question interface...",
        "Ready to answer!"
      ],
      seo: [
        "Initializing Perplexity Research...",
        "Connecting to Anthropic Claude...",
        "Loading SEO optimization tools...",
        "Preparing content generator..."
      ],
      grant: [
        "Initializing Claude-4-Sonnet...",
        "Loading grant templates...", 
        "Preparing proposal structure...",
        "Ready for professional writing!"
      ]
    };

    const serviceMessages = messages[serviceType];
    setLoadingText(serviceMessages[0]);

    serviceMessages.forEach((message, index) => {
      setTimeout(() => {
        if (index < serviceMessages.length - 1) {
          setLoadingText(serviceMessages[index + 1]);
        }
      }, (index + 1) * 800);
    });

    // Navigate to chat after loading sequence
    setTimeout(() => {
      window.location.href = `/chat?service=${serviceType}`;
    }, serviceMessages.length * 800 + 500);
  };

  const serviceCards = [
    {
      type: 'general' as ServiceType,
      title: "General Questions",
      description: "Lightning-fast responses powered by Groq API",
      credits: 1,
      icon: Brain,
      color: "bg-blue-500",
      gradient: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      features: ["Factual question answering", "Multi-step reasoning", "Code execution", "Computational problems"]
    },
    {
      type: 'seo' as ServiceType,
      title: "SEO & AI Content",
      description: "Research + content generation with live data",
      credits: 2,
      icon: Search,
      color: "bg-purple-500",
      gradient: "from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
      features: ["Live Google research", "E-E-A-T optimized", "Semantic keywords", "HTML-ready output"]
    },
    {
      type: 'grant' as ServiceType,
      title: "Grant Writing",
      description: "Professional proposals with structured formatting",
      credits: 3,
      icon: FileText,
      color: "bg-green-500",
      gradient: "from-green-50 to-green-100",
      borderColor: "border-green-200",
      features: ["Executive summaries", "Budget breakdowns", "Impact evaluation", "Official citations"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Loading Overlay */}
      {loadingService && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Launching {loadingService === 'general' ? 'General Questions' : loadingService === 'seo' ? 'SEO & AI Content' : 'Grant Writing'}
              </h3>
              <p className="text-blue-600 dark:text-blue-400 font-medium mb-4">
                {loadingText}
              </p>
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary">Sofeia AI</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Autonomous Agent</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Credits Display */}
              <div className="hidden md:flex items-center space-x-2 bg-primary/10 dark:bg-primary/20 px-3 py-1 rounded-full">
                <Coins className="text-yellow-500" size={16} />
                <span className="text-sm font-medium dark:text-white">
                  IP Credits Available
                </span>
              </div>
              
              {/* Dark Mode Toggle */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleDarkMode}
                className="dark:text-gray-300"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </Button>
              
              {/* User Menu */}
              <div className="relative">
                <Button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  <UserCheck className="mr-2" size={16} />
                  {user?.firstName || 'User'}
                </Button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="py-1">
                      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <CreditCard className="mr-2" size={16} />
                        Buy Credits
                      </button>
                      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <History className="mr-2" size={16} />
                        History
                      </button>
                      <hr className="my-1 border-gray-200 dark:border-gray-600" />
                      <button 
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <LogOut className="mr-2" size={16} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-purple-500/5 to-primary/10 dark:from-primary/10 dark:via-purple-500/10 dark:to-primary/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Sofeia AI
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Choose your AI service and let our autonomous agents handle the rest
          </p>
          
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <Coins className="text-yellow-500" size={16} />
              <span>IP-Based Credit System</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="text-green-500" size={16} />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="text-yellow-500" size={16} />
              <span>Real-time Processing</span>
            </div>
          </div>
        </div>
      </section>

      {/* AI Services */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {serviceCards.map((service) => {
              const IconComponent = service.icon;
              
              return (
                <Card 
                  key={service.type}
                  className={`bg-gradient-to-br ${service.gradient} ${service.borderColor} hover:shadow-xl transition-all transform hover:-translate-y-1 ${loadingService === null ? 'cursor-pointer' : 'cursor-wait'} dark:from-gray-800 dark:to-gray-700 dark:border-gray-600 ${loadingService === service.type ? 'ring-2 ring-blue-500 animate-pulse' : ''}`}
                >
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`${service.color} text-white p-4 rounded-xl`}>
                        <IconComponent size={24} />
                      </div>
                      <Badge variant="secondary" className="bg-white/80">
                        <Coins size={12} className="mr-1" />
                        {service.credits} Credit{service.credits > 1 ? 's' : ''}
                      </Badge>
                    </div>
                    
                    <CardTitle className="text-2xl mb-4 dark:text-white">{service.title}</CardTitle>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{service.description}</p>
                    
                    <div className="space-y-3 mb-8">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      className={`w-full ${service.color} hover:opacity-90 text-white`}
                      disabled={!isAuthenticated || loadingService !== null}
                      onClick={() => handleServiceClick(service.type)}
                    >
                      {loadingService === service.type ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {loadingText}
                        </>
                      ) : (
                        isAuthenticated ? 'Launch Service' : 'Login Required'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Admin Dashboard */}
      {user?.isAdmin && (
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="shadow-lg dark:bg-gray-700 dark:border-gray-600">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl dark:text-white">
                  <Settings className="text-primary mr-3" size={24} />
                  Admin Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="bg-primary/5 dark:bg-gray-600">
                    <CardContent className="p-6 text-center">
                      <Users className="text-primary mx-auto mb-2" size={32} />
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">247</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Active Users</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-yellow-500/5 dark:bg-gray-600">
                    <CardContent className="p-6 text-center">
                      <Coins className="text-yellow-500 mx-auto mb-2" size={32} />
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">12,450</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Credits Distributed</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-green-500/5 dark:bg-gray-600">
                    <CardContent className="p-6 text-center">
                      <BarChart3 className="text-green-500 mx-auto mb-2" size={32} />
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">99.9%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">System Uptime</div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-6 flex space-x-4">
                  <Button variant="outline">
                    <Users className="mr-2" size={16} />
                    Manage Users
                  </Button>
                  <Button variant="outline">
                    <Shield className="mr-2" size={16} />
                    Security Logs
                  </Button>
                  <Button variant="outline">
                    <BarChart3 className="mr-2" size={16} />
                    Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">Sofeia AI Agent</h3>
              <p className="text-gray-300 mb-6 max-w-md">
                The world's most advanced autonomous AI system, revolutionizing how humans interact with artificial intelligence.
              </p>
              
              {/* Founder Information */}
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">OF</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Ottmar Francisca</h4>
                      <p className="text-gray-300 text-sm">Founder & CEO</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center space-x-4">
                    <button 
                      onClick={handleWhatsApp}
                      className="flex items-center text-green-400 hover:text-green-300 text-sm"
                    >
                      <MessageCircle size={16} className="mr-2" />
                      +31 628 073 996
                    </button>
                    <a href="#" className="flex items-center text-blue-400 hover:text-blue-300 text-sm">
                      <span className="mr-2">in</span>
                      LinkedIn
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-300">
                {["General Questions", "SEO Content", "Grant Writing", "API Access"].map((item, idx) => (
                  <li key={idx}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                {["Help Center", "Privacy Policy", "Terms of Service", "Contact Us"].map((item, idx) => (
                  <li key={idx}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2025 Sofeia AI Agent. All rights reserved.
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <Shield size={16} className="text-green-500" />
                  <span>Enterprise Security</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <Globe size={16} className="text-blue-500" />
                  <span>Global Scale</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-4 z-40">
        <Button
          onClick={() => setIsChatOpen(true)}
          size="lg"
          className="bg-primary hover:bg-primary/90 rounded-full w-14 h-14 shadow-lg"
          title="Support Chat"
        >
          <MessageCircle size={20} />
        </Button>
        
        <Button
          onClick={handleWhatsApp}
          size="lg"
          className="bg-green-500 hover:bg-green-600 rounded-full w-14 h-14 shadow-lg"
          title="WhatsApp Support"
        >
          <MessageCircle size={20} />
        </Button>
        
        <Button
          onClick={() => setShowDonationModal(true)}
          size="lg"
          className="bg-yellow-500 hover:bg-yellow-600 rounded-full w-14 h-14 shadow-lg"
          title="Support Us"
        >
          <Heart size={20} />
        </Button>
      </div>

      {/* Modals */}
      {activeModal && (
        <AIServiceModal 
          isOpen={!!activeModal}
          onClose={() => setActiveModal(null)}
          serviceType={activeModal}
        />
      )}

      <ChatWidget 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {/* Donation Modal */}
      {showDonationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="text-red-500 mr-2" size={20} />
                Support Sofeia AI
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Help us continue developing the world's most advanced AI platform.
              </p>
              <div className="space-y-2">
                <PayPalButton amount="10.00" currency="USD" intent="CAPTURE" />
                <PayPalButton amount="25.00" currency="USD" intent="CAPTURE" />
                <PayPalButton amount="50.00" currency="USD" intent="CAPTURE" />
              </div>
              <Button 
                onClick={() => setShowDonationModal(false)}
                variant="outline" 
                className="w-full"
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
