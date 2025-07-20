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
  
  // Check for research/search indicators including country-specific content
  if (lowerMessage.includes('research') || lowerMessage.includes('search') || 
      lowerMessage.includes('find information') || lowerMessage.includes('latest') ||
      lowerMessage.includes('news') || lowerMessage.includes('current') ||
      lowerMessage.includes('government') || lowerMessage.includes('official') ||
      lowerMessage.includes('statistics') || lowerMessage.includes('data') ||
      lowerMessage.includes('study') || lowerMessage.includes('report') ||
      lowerMessage.includes('policy') || lowerMessage.includes('regulation') ||
      lowerMessage.includes('law') || lowerMessage.includes('legal') ||
      lowerMessage.includes('country') || lowerMessage.includes('national') ||
      // Country mentions for targeted research
      lowerMessage.includes('india') || lowerMessage.includes('usa') || lowerMessage.includes('america') ||
      lowerMessage.includes('uk') || lowerMessage.includes('britain') || lowerMessage.includes('canada') ||
      lowerMessage.includes('australia') || lowerMessage.includes('singapore') || lowerMessage.includes('japan') ||
      lowerMessage.includes('germany') || lowerMessage.includes('france') || lowerMessage.includes('china') ||
      lowerMessage.includes('brazil') || lowerMessage.includes('mexico') ||
      // Content targeting phrases
      lowerMessage.includes('content for') || lowerMessage.includes('audience in') ||
      lowerMessage.includes('market in') || lowerMessage.includes('regulations in')) {
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
      lowerMessage.includes('funding') || lowerMessage.includes('write proposal') ||
      lowerMessage.includes('grant proposal') || lowerMessage.includes('grant writing') ||
      lowerMessage.includes('funding application') || lowerMessage.includes('scholarship') ||
      lowerMessage.includes('research proposal') || lowerMessage.includes('project proposal') ||
      lowerMessage.includes('budget') || lowerMessage.includes('timeline') ||
      lowerMessage.includes('objectives') || lowerMessage.includes('methodology') ||
      lowerMessage.includes('impact assessment') || lowerMessage.includes('sustainability plan') ||
      lowerMessage.includes('executive summary') || lowerMessage.includes('foundation') ||
      lowerMessage.includes('non-profit') || lowerMessage.includes('ngo') ||
      lowerMessage.includes('charity') || lowerMessage.includes('donation')) {
    return 'grant';
  }
  
  // Default to general questions
  return 'general';
}

// Check if the message needs clarification before processing
export function needsClarification(message: string): { needs: boolean; questions: string[] } {
  const lowerMessage = message.toLowerCase();
  const questions: string[] = [];
  
  // Check for vague blog/content requests
  if ((lowerMessage.includes('blog') || lowerMessage.includes('article') || lowerMessage.includes('content')) && 
      !lowerMessage.includes('about') && !lowerMessage.includes('for') && 
      lowerMessage.split(' ').length < 6) {
    questions.push("What specific topic would you like me to write about?");
    questions.push("What target country/audience should I focus on?");
    questions.push("Any specific keywords you'd like me to include?");
  }
  
  // Check for vague grant requests
  if (lowerMessage.includes('grant') && !lowerMessage.includes('for') && 
      lowerMessage.split(' ').length < 6) {
    questions.push("What organization are you writing this grant for?");
    questions.push("Which funding body are you targeting?");
    questions.push("What's the purpose/project of the grant?");
    questions.push("What's the funding amount you're requesting?");
  }
  
  // Check for vague research requests
  if ((lowerMessage.includes('research') || lowerMessage.includes('find')) && 
      !lowerMessage.includes('about') && lowerMessage.split(' ').length < 5) {
    questions.push("What specific topic should I research?");
    questions.push("Which country or region should I focus on?");
    questions.push("Are you looking for government regulations, statistics, or general information?");
  }
  
  return {
    needs: questions.length > 0,
    questions
  };
}

export function formatAIResponse(response: string, service: string, creditsUsed: number): string {
  return `**🤖 Sofeia AI Response** (${service} • ${creditsUsed} credit${creditsUsed > 1 ? 's' : ''})\n\n${response}`;
}

// Format clarification response
export function formatClarificationResponse(questions: string[]): string {
  const intro = "I'd be happy to help you! To provide the best possible content, I need a few more details:";
  const questionList = questions.map((q, i) => `${i + 1}. ${q}`).join('\n');
  const outro = "\nPlease provide these details, and I'll create exactly what you need with relevant sources and targeting.";
  
  return `${intro}\n\n${questionList}${outro}`;
}