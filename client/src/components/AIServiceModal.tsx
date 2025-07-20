import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Loader2, Brain, Search, FileText, Coins } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { User } from "@shared/schema";

type ServiceType = 'general' | 'seo' | 'grant';

interface AIServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: ServiceType;
}

const serviceConfig = {
  general: {
    title: "General Questions",
    icon: Brain,
    credits: 1,
    description: "Powered by Groq API for lightning-fast responses",
    color: "bg-blue-500"
  },
  seo: {
    title: "SEO & AI Content",
    icon: Search,
    credits: 2,
    description: "Perplexity research + Anthropic content generation",
    color: "bg-purple-500"
  },
  grant: {
    title: "Grant Writing",
    icon: FileText,
    credits: 3,
    description: "Professional grant proposals with Anthropic API",
    color: "bg-green-500"
  }
};

export function AIServiceModal({ isOpen, onClose, serviceType }: AIServiceModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [citations, setCitations] = useState<string[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const config = serviceConfig[serviceType];
  const IconComponent = config.icon;

  // Form states
  const [generalQuestion, setGeneralQuestion] = useState("");
  const [seoTopic, setSeoTopic] = useState("");
  const [seoContentType, setSeoContentType] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [grantOrganization, setGrantOrganization] = useState("");
  const [grantFundingBody, setGrantFundingBody] = useState("");
  const [grantProject, setGrantProject] = useState("");
  const [grantBudget, setGrantBudget] = useState("");
  const [grantObjectives, setGrantObjectives] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || (user.credits ?? 0) < config.credits) {
      toast({
        title: "Insufficient Credits",
        description: `You need ${config.credits} credits for this service.`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResponse("");
    setCitations([]);

    try {
      let endpoint = "";
      let payload = {};

      switch (serviceType) {
        case 'general':
          endpoint = '/api/ai/general-question';
          payload = { question: generalQuestion };
          break;
        case 'seo':
          endpoint = '/api/ai/seo-content';
          payload = {
            topic: seoTopic,
            contentType: seoContentType,
            targetKeywords: seoKeywords
          };
          break;
        case 'grant':
          endpoint = '/api/ai/grant-proposal';
          payload = {
            organization: grantOrganization,
            fundingBody: grantFundingBody,
            projectDescription: grantProject,
            budget: grantBudget,
            objectives: grantObjectives
          };
          break;
      }

      const response = await apiRequest('POST', endpoint, payload);
      const data = await response.json();

      if (serviceType === 'general') {
        setResponse(data.response);
      } else if (serviceType === 'seo') {
        setResponse(data.content);
        setCitations(data.citations || []);
      } else {
        setResponse(data.proposal);
      }

      toast({
        title: "Success",
        description: `${config.credits} credits used. Response generated successfully!`,
      });

    } catch (error) {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to process request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setGeneralQuestion("");
    setSeoTopic("");
    setSeoContentType("");
    setSeoKeywords("");
    setGrantOrganization("");
    setGrantFundingBody("");
    setGrantProject("");
    setGrantBudget("");
    setGrantObjectives("");
    setResponse("");
    setCitations([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
        <CardHeader className={`${config.color} text-white rounded-t-lg`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <IconComponent size={20} />
              </div>
              <div>
                <CardTitle className="text-xl">{config.title}</CardTitle>
                <p className="text-sm opacity-90">{config.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                <Coins size={14} className="inline mr-1" />
                {config.credits} Credit{config.credits > 1 ? 's' : ''}
              </div>
              <Button variant="ghost" size="sm" onClick={handleClose} className="text-white hover:bg-white/20">
                <X size={18} />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-6 overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-6 flex-1">
            {/* Input Form */}
            <div className="lg:w-1/2">
              <form onSubmit={handleSubmit} className="space-y-4">
                {serviceType === 'general' && (
                  <div>
                    <Label htmlFor="question">Your Question</Label>
                    <Textarea
                      id="question"
                      placeholder="Ask any question across all domains..."
                      value={generalQuestion}
                      onChange={(e) => setGeneralQuestion(e.target.value)}
                      required
                      className="min-h-[120px]"
                    />
                  </div>
                )}

                {serviceType === 'seo' && (
                  <>
                    <div>
                      <Label htmlFor="topic">Topic/Subject</Label>
                      <Input
                        id="topic"
                        placeholder="Enter your content topic"
                        value={seoTopic}
                        onChange={(e) => setSeoTopic(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="contentType">Content Type</Label>
                      <Input
                        id="contentType"
                        placeholder="e.g., blog post, product review, how-to guide"
                        value={seoContentType}
                        onChange={(e) => setSeoContentType(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="keywords">Target Keywords</Label>
                      <Input
                        id="keywords"
                        placeholder="Enter target keywords separated by commas"
                        value={seoKeywords}
                        onChange={(e) => setSeoKeywords(e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}

                {serviceType === 'grant' && (
                  <>
                    <div>
                      <Label htmlFor="organization">Organization Name</Label>
                      <Input
                        id="organization"
                        placeholder="Your organization name"
                        value={grantOrganization}
                        onChange={(e) => setGrantOrganization(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="fundingBody">Funding Body</Label>
                      <Input
                        id="fundingBody"
                        placeholder="Grant provider/funding organization"
                        value={grantFundingBody}
                        onChange={(e) => setGrantFundingBody(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="project">Project Description</Label>
                      <Textarea
                        id="project"
                        placeholder="Describe your project and its purpose"
                        value={grantProject}
                        onChange={(e) => setGrantProject(e.target.value)}
                        required
                        className="min-h-[80px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="budget">Budget</Label>
                      <Input
                        id="budget"
                        placeholder="Total project budget (e.g., $50,000)"
                        value={grantBudget}
                        onChange={(e) => setGrantBudget(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="objectives">Objectives</Label>
                      <Textarea
                        id="objectives"
                        placeholder="Main objectives and expected outcomes"
                        value={grantObjectives}
                        onChange={(e) => setGrantObjectives(e.target.value)}
                        required
                        className="min-h-[80px]"
                      />
                    </div>
                  </>
                )}

                <Button 
                  type="submit" 
                  className={`w-full ${config.color} hover:opacity-90`}
                  disabled={isLoading || (user && user.credits < config.credits)}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={16} />
                      Processing...
                    </>
                  ) : (
                    `Generate Response (${config.credits} Credits)`
                  )}
                </Button>
              </form>
            </div>

            {/* Response Area */}
            <div className="lg:w-1/2">
              <Label>Response</Label>
              <ScrollArea className="h-[400px] lg:h-[500px] border rounded-lg p-4 bg-gray-50">
                {response ? (
                  <div className="space-y-4">
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: response }}
                    />
                    
                    {citations.length > 0 && (
                      <div className="border-t pt-4">
                        <h4 className="font-semibold text-sm text-gray-900 mb-2">Sources:</h4>
                        <ul className="space-y-1">
                          {citations.map((citation, index) => (
                            <li key={index}>
                              <a 
                                href={citation} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-xs"
                              >
                                [{index + 1}] {citation}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <IconComponent size={48} className="mx-auto mb-4 text-gray-300" />
                      <p>Your AI-generated response will appear here</p>
                      <p className="text-sm mt-2">
                        {user ? (
                          user.credits >= config.credits ? (
                            "Fill out the form and click generate"
                          ) : (
                            `You need ${config.credits} credits for this service`
                          )
                        ) : (
                          "Please log in to use this service"
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
