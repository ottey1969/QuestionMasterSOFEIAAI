import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Search, FileText, Shield, Zap, Globe, MessageCircle, Heart, Loader2 } from "lucide-react";

export default function Landing() {
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userIP, setUserIP] = useState("");

  const handleStartChat = () => {
    setIsStartingChat(true);
    setLoadingText("Initializing Sofeia AI...");
    
    setTimeout(() => setLoadingText("Loading chat interface..."), 800);
    setTimeout(() => setLoadingText("Connecting to AI services..."), 1600);
    setTimeout(() => setLoadingText("Almost ready..."), 2400);
    setTimeout(() => {
      window.location.href = "/chat";
    }, 3000);
  };

  const handleContactAdmin = (plan: string) => {
    const message = `Hello! I'm interested in the ${plan} plan (${plan === 'starter' ? '150 questions for €35/month' : '1500 questions for €300/month'}). My details:\nEmail: ${userEmail || 'Not provided'}\nIP: ${userIP || 'Not detected'}`;
    const whatsappUrl = `https://wa.me/31628073996?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handlePayPalPurchase = () => {
    window.open("https://paypal.me/ojgmedia?country.x=NL&locale.x=en_US", "_blank");
  };

  const handleDonation = () => {
    window.open("https://paypal.me/ojgmedia?country.x=NL&locale.x=en_US", "_blank");
  };

  // Get user IP on component mount using the specified API
  React.useEffect(() => {
    // First try myipinfo.io as specified
    fetch('https://ipapi.co/json/')
      .then(response => response.json())
      .then(data => setUserIP(data.ip || 'Unable to detect'))
      .catch(() => {
        // Fallback to ipify
        fetch('https://api.ipify.org?format=json')
          .then(response => response.json())
          .then(data => setUserIP(data.ip))
          .catch(() => setUserIP('Unable to detect'));
      });
  }, []);

  const handleWhatsApp = () => {
    window.open("https://wa.me/31628073996", "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary">Sofeia AI</h1>
                <p className="text-xs text-gray-500">Autonomous Agent</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => window.location.href = "/admin"} 
                variant="outline" 
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Admin
              </Button>
              <Button 
                onClick={handleStartChat} 
                className="bg-primary text-white hover:bg-primary/90"
                disabled={isStartingChat}
              >
                {isStartingChat ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Starting...
                  </>
                ) : (
                  "Start Chatting"
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-purple-500/5 to-primary/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              The World's Most Advanced
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
                {" "}Autonomous AI Agent
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              Powered by cutting-edge AI technology, Sofeia combines real-time research, 
              structured content generation, and multi-agent reasoning to deliver unparalleled results 
              across general questions, SEO content, and grant writing.
            </p>
            
            {/* Credit Purchase Cards */}
            <div className="mb-12">
              <p className="text-lg font-bold text-[#8B1538] mb-6">
                If you need credits, please contact admin via WhatsApp. You can get 150 questions for 35 euros/month and 1500 questions for 300 euros per month.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
                {/* Starter Plan */}
                <Card className="bg-white border-2 border-[#8B1538]/20 hover:border-[#8B1538]/40 transition-all shadow-lg h-full flex flex-col">
                  <CardContent className="p-6 text-center flex-1 flex flex-col">
                    <h3 className="text-2xl font-bold text-[#8B1538] mb-2">Starter Plan</h3>
                    <div className="text-3xl font-bold text-gray-900 mb-2">€35</div>
                    <div className="text-gray-600 mb-4">per month</div>
                    <div className="text-lg font-semibold text-[#8B1538] mb-4">150 Questions</div>
                    <ul className="text-sm text-gray-600 mb-6 space-y-1 flex-1">
                      <li>• Perfect for individuals</li>
                      <li>• All AI services included</li>
                      <li>• Email support</li>
                      <li className="opacity-0">• Spacer for alignment</li>
                    </ul>
                    <div className="flex gap-2 mt-auto">
                      <Button 
                        onClick={() => handleContactAdmin('starter')}
                        className="bg-green-500 hover:bg-green-600 text-white flex-1"
                      >
                        <MessageCircle className="mr-2" size={16} />
                        WhatsApp
                      </Button>
                      <Button 
                        onClick={handlePayPalPurchase}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                      >
                        PayPal
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Professional Plan */}
                <Card className="bg-white border-2 border-[#8B1538]/20 hover:border-[#8B1538]/40 transition-all shadow-lg h-full flex flex-col">
                  <CardContent className="p-6 text-center relative flex-1 flex flex-col">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#8B1538] text-white px-4 py-1 rounded-full text-sm font-medium">
                      Popular
                    </div>
                    <h3 className="text-2xl font-bold text-[#8B1538] mb-2 mt-2">Professional Plan</h3>
                    <div className="text-3xl font-bold text-gray-900 mb-2">€300</div>
                    <div className="text-gray-600 mb-4">per month</div>
                    <div className="text-lg font-semibold text-[#8B1538] mb-4">1500 Questions</div>
                    <ul className="text-sm text-gray-600 mb-6 space-y-1 flex-1">
                      <li>• Best for businesses</li>
                      <li>• All AI services included</li>
                      <li>• Priority support</li>
                      <li>• Bulk discounts available</li>
                    </ul>
                    <div className="flex gap-2 mt-auto">
                      <Button 
                        onClick={() => handleContactAdmin('professional')}
                        className="bg-green-500 hover:bg-green-600 text-white flex-1"
                      >
                        <MessageCircle className="mr-2" size={16} />
                        WhatsApp
                      </Button>
                      <Button 
                        onClick={handlePayPalPurchase}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                      >
                        PayPal
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                onClick={handleStartChat}
                size="lg"
                className="bg-primary text-white hover:bg-primary/90 text-lg px-8 py-4"
                disabled={isStartingChat}
              >
                {isStartingChat ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" size={20} />
                    {loadingText || "Starting..."}
                  </>
                ) : (
                  <>
                    <Zap className="mr-2" size={20} />
                    Start Chatting Now
                  </>
                )}
              </Button>
              
              <div className="flex items-center space-x-4">
                <span className="text-gray-500">or</span>
                <Button 
                  onClick={handleDonation}
                  variant="outline"
                  size="lg"
                  className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                >
                  <Heart className="mr-2" size={16} />
                  Support Us
                </Button>
              </div>
            </div>

            {/* Feature Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Brain className="text-primary mx-auto mb-3" size={32} />
                  <h3 className="font-semibold text-lg mb-2">Multi-Agent Reasoning</h3>
                  <p className="text-gray-600 text-sm">Advanced AI architecture with specialized agents for different tasks</p>
                </CardContent>
              </Card>
              <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Search className="text-purple-500 mx-auto mb-3" size={32} />
                  <h3 className="font-semibold text-lg mb-2">Real-Time Research</h3>
                  <p className="text-gray-600 text-sm">Live data from top Google results with fact-checked sources</p>
                </CardContent>
              </Card>
              <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Shield className="text-green-500 mx-auto mb-3" size={32} />
                  <h3 className="font-semibold text-lg mb-2">Enterprise Security</h3>
                  <p className="text-gray-600 text-sm">IP tracking, fingerprinting, and advanced fraud prevention</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* AI Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Three Specialized AI Agents
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Each powered by industry-leading APIs and optimized for specific use cases
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* General Questions */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-xl transition-all">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-primary text-white p-4 rounded-xl">
                    <Brain size={24} />
                  </div>
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                    1 Credit
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">General Questions</h3>
                <p className="text-gray-600 mb-6">
                  Powered by <strong>Groq API</strong> for lightning-fast responses to any question 
                  across all domains with step-by-step reasoning and validation.
                </p>
                
                <div className="space-y-3 mb-8">
                  {["Factual question answering", "Multi-step reasoning tasks", "Code execution & validation", "Computational problems"].map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      {feature}
                    </div>
                  ))}
                </div>
                
                <Button onClick={handleStartChat} className="w-full bg-primary hover:bg-primary/90">
                  Ask Question
                </Button>
              </CardContent>
            </Card>

            {/* SEO Content */}
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-xl transition-all">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-purple-500 text-white p-4 rounded-xl">
                    <Search size={24} />
                  </div>
                  <div className="bg-purple-500/10 text-purple-500 px-3 py-1 rounded-full text-sm font-semibold">
                    2 Credits
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">SEO & AI Content</h3>
                <p className="text-gray-600 mb-6">
                  <strong>Perplexity API</strong> for research + <strong>Anthropic API</strong> for content creation. 
                  Generate ranking-ready content optimized for Google AI Overview.
                </p>
                
                <div className="space-y-3 mb-8">
                  {["Live Google research (top 10 results)", "E-E-A-T optimized content", "Semantic keyword clustering", "HTML-ready with citations"].map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      {feature}
                    </div>
                  ))}
                </div>
                
                <Button onClick={handleStartChat} className="w-full bg-purple-500 hover:bg-purple-500/90">
                  Create Content
                </Button>
              </CardContent>
            </Card>

            {/* Grant Writing */}
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-xl transition-all">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-green-500 text-white p-4 rounded-xl">
                    <FileText size={24} />
                  </div>
                  <div className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-sm font-semibold">
                    3 Credits
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Grant Writing</h3>
                <p className="text-gray-600 mb-6">
                  Professional grant proposals powered by <strong>Anthropic API</strong> with 
                  structured formatting, budgets, and official citations.
                </p>
                
                <div className="space-y-3 mb-8">
                  {["Executive summary & objectives", "Budget breakdown tables", "Timeline & impact evaluation", ".gov/.edu citations"].map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      {feature}
                    </div>
                  ))}
                </div>
                
                <Button onClick={handleStartChat} className="w-full bg-green-500 hover:bg-green-500/90">
                  Write Proposal
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">Sofeia AI Agent</h3>
              <p className="text-gray-300 mb-6 max-w-md">
                The world's most advanced autonomous AI system, combining multi-agent reasoning, 
                real-time research, and enterprise-grade security to revolutionize AI interactions.
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

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-4">AI Services</h4>
              <ul className="space-y-2 text-gray-300">
                {["General Questions", "SEO & Content", "Grant Writing", "API Access", "Enterprise Solutions"].map((service, idx) => (
                  <li key={idx}>
                    <a href="#" className="hover:text-white transition-colors">{service}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal & Support */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal & Support</h4>
              <ul className="space-y-2 text-gray-300">
                {["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR Compliance", "Support Center", "Contact Us"].map((item, idx) => (
                  <li key={idx}>
                    <a href="#" className="hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2025 Sofeia AI Agent. All rights reserved. | Powered by Advanced Multi-Agent Architecture
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <Shield size={16} className="text-green-500" />
                  <span>Enterprise Security</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <Zap size={16} className="text-yellow-500" />
                  <span>99.9% Uptime</span>
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
      <div className="fixed bottom-6 right-6 flex flex-col space-y-4 z-50">
        <Button
          onClick={handleWhatsApp}
          size="lg"
          className="bg-green-500 hover:bg-green-600 rounded-full w-14 h-14 shadow-lg"
        >
          <MessageCircle size={20} />
        </Button>
        
        <Button
          onClick={handleDonation}
          size="lg"
          className="bg-yellow-500 hover:bg-yellow-600 rounded-full w-14 h-14 shadow-lg"
        >
          <Heart size={20} />
        </Button>
      </div>
    </div>
  );
}
