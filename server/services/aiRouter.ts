import { askGeneralQuestion } from './groq';
import { searchWithPerplexity } from './perplexity';
import { generateContent, createSEOContent, writeGrantProposal } from './anthropic';

export type ServiceType = 'general' | 'research' | 'seo' | 'grant';

export interface AIRequest {
  type: ServiceType;
  content: string;
  metadata?: {
    keywords?: string[];
    organization?: string;
    fundingBody?: string;
    amount?: string;
    purpose?: string;
  };
}

export async function processAIRequest(request: AIRequest): Promise<{
  response: string;
  service: string;
  creditsUsed: number;
}> {
  try {
    let response: string;
    let service: string;
    let creditsUsed: number;

    switch (request.type) {
      case 'general':
        response = await askGeneralQuestion(request.content);
        service = 'Groq (Mixtral-8x7B)';
        creditsUsed = 1;
        break;

      case 'research':
        response = await searchWithPerplexity(request.content);
        service = 'Perplexity (Llama-3.1-Sonar)';
        creditsUsed = 1;
        break;

      case 'seo':
        try {
          if (request.metadata?.keywords) {
            response = await createSEOContent(request.content, request.metadata.keywords);
          } else {
            response = await createSEOContent(request.content);
          }
          service = 'Anthropic (Claude-4-Sonnet)';
          creditsUsed = 2;
        } catch (error) {
          // Fallback to Groq if Anthropic fails
          response = await askGeneralQuestion(`Create SEO content about: ${request.content}`);
          service = 'Groq (Fallback for SEO)';
          creditsUsed = 1;
        }
        break;

      case 'grant':
        try {
          if (request.metadata?.organization && request.metadata?.fundingBody && 
              request.metadata?.amount && request.metadata?.purpose) {
            response = await writeGrantProposal(
              request.metadata.organization,
              request.metadata.fundingBody,
              request.metadata.amount,
              request.metadata.purpose
            );
          } else {
            response = await generateContent(request.content, 'grant');
          }
          service = 'Anthropic (Claude-4-Sonnet)';
          creditsUsed = 3;
        } catch (error) {
          // Fallback to Groq if Anthropic fails
          response = await askGeneralQuestion(`Write a professional grant proposal for: ${request.content}`);
          service = 'Groq (Fallback for Grant Writing)';
          creditsUsed = 1;
        }
        break;

      default:
        throw new Error(`Unknown service type: ${request.type}`);
    }

    return {
      response,
      service,
      creditsUsed
    };
  } catch (error: any) {
    console.error('AI processing error:', error);
    throw new Error(`AI service error: ${error.message}`);
  }
}

// Smart routing based on message content
export function detectServiceType(message: string): ServiceType {
  const lowerMessage = message.toLowerCase();
  
  // Check for research/search indicators
  if (lowerMessage.includes('research') || lowerMessage.includes('search') || 
      lowerMessage.includes('find information') || lowerMessage.includes('latest') ||
      lowerMessage.includes('news') || lowerMessage.includes('current') ||
      lowerMessage.includes('government') || lowerMessage.includes('official') ||
      lowerMessage.includes('statistics') || lowerMessage.includes('data') ||
      lowerMessage.includes('study') || lowerMessage.includes('report') ||
      lowerMessage.includes('policy') || lowerMessage.includes('regulation') ||
      lowerMessage.includes('law') || lowerMessage.includes('legal') ||
      lowerMessage.includes('country') || lowerMessage.includes('national')) {
    return 'research';
  }
  
  // Check for SEO/content indicators
  if (lowerMessage.includes('seo') || lowerMessage.includes('content') || 
      lowerMessage.includes('article') || lowerMessage.includes('blog') ||
      lowerMessage.includes('write about') || lowerMessage.includes('create content')) {
    return 'seo';
  }
  
  // Check for grant writing indicators
  if (lowerMessage.includes('grant') || lowerMessage.includes('proposal') || 
      lowerMessage.includes('funding') || lowerMessage.includes('write proposal')) {
    return 'grant';
  }
  
  // Default to general questions
  return 'general';
}

export function formatAIResponse(response: string, service: string, creditsUsed: number): string {
  return `**🤖 Sofeia AI Response** (${service} • ${creditsUsed} credit${creditsUsed > 1 ? 's' : ''})\n\n${response}`;
}