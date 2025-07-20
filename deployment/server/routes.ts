import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault } from "./paypal";
import { extractSecurityInfo, generateFingerprint } from "./services/security";
import { processAIRequest, detectServiceType, formatAIResponse, needsClarification, formatClarificationResponse, type AIRequest } from "./services/aiRouter";
import { z } from "zod";

// Validation schemas
const messageSchema = z.object({
  message: z.string().min(1, "Message is required"),
  sessionId: z.string().min(1, "Session ID is required")
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server first
  const httpServer = createServer(app);
  
  // Create WebSocket server for real-time chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection established');
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.connection.remoteAddress || 'unknown';
    console.log('WebSocket connection from IP:', ip);
    
    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        console.log('WebSocket message received:', message);
        
        // Process AI chat messages with IP credit system
        if (message.type === 'chat') {
          try {
            // Check IP credits first
            let ipCredit = await storage.getIpCredits(ip);
            if (!ipCredit) {
              ipCredit = await storage.createIpCredits(ip);
            }
            
            // Check if IP has enough credits (unless unlimited)
            if (!ipCredit.isUnlimited && ipCredit.credits <= 0) {
              ws.send(JSON.stringify({
                type: 'error',
                content: 'No credits remaining. Contact admin to add more credits to your IP address.',
                credits: ipCredit.credits,
                contactInfo: {
                  whatsapp: '+31 628 073 996',
                  message: `Hi, I need more credits for Sofeia AI. My IP address is: ${ip}`
                }
              }));
              return;
            }
            
            // Check if the message needs clarification first
            const clarification = needsClarification(message.content);
            
            if (clarification.needs) {
              // Return clarification questions without using credits
              const clarificationResponse = formatClarificationResponse(clarification.questions);
              ws.send(JSON.stringify({ 
                type: 'response', 
                content: clarificationResponse,
                timestamp: new Date().toISOString(),
                sessionId: message.sessionId,
                service: 'Sofeia AI (Clarification)',
                creditsUsed: 0,
                creditsRemaining: ipCredit.isUnlimited ? 'unlimited' : ipCredit.credits,
                needsClarification: true
              }));
              return;
            }
            
            // Send thinking message first
            ws.send(JSON.stringify({ 
              type: 'thinking', 
              content: '🤔 Sofeia AI is thinking...',
              timestamp: new Date().toISOString()
            }));
            
            const serviceType = detectServiceType(message.content);
            const aiRequest: AIRequest = {
              type: serviceType,
              content: message.content
            };
            
            const result = await processAIRequest(aiRequest);
            const formattedResponse = formatAIResponse(result.response, result.service, result.creditsUsed);
            
            // Deduct credits for non-unlimited IPs
            if (!ipCredit.isUnlimited) {
              const newCredits = ipCredit.credits - result.creditsUsed;
              await storage.updateIpCredits(ip, Math.max(0, newCredits));
            }
            
            ws.send(JSON.stringify({ 
              type: 'response', 
              content: formattedResponse,
              timestamp: new Date().toISOString(),
              service: result.service,
              creditsUsed: result.creditsUsed,
              creditsRemaining: ipCredit.isUnlimited ? 'unlimited' : Math.max(0, ipCredit.credits - result.creditsUsed)
            }));
          } catch (error: any) {
            console.error('AI processing error:', error);
            ws.send(JSON.stringify({ 
              type: 'error', 
              content: `Sorry, I encountered an error: ${error.message}`,
              timestamp: new Date().toISOString()
            }));
          }
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });

  // Security middleware
  app.use((req, res, next) => {
    const securityInfo = extractSecurityInfo(req);
    req.securityInfo = securityInfo;
    next();
  });

  // Simple user session for chat (no authentication) with credit check
  app.get('/api/user/session', async (req, res) => {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.connection.remoteAddress || 'unknown';
    
    // Check or create IP credits
    let ipCredit = await storage.getIpCredits(ip);
    if (!ipCredit) {
      ipCredit = await storage.createIpCredits(ip);
    }
    
    const sessionId = Math.random().toString(36).substring(2, 15);
    res.json({ 
      sessionId,
      isAnonymous: true,
      message: "Anonymous chat session created",
      credits: ipCredit.credits,
      isUnlimited: ipCredit.isUnlimited,
      ip: ip // For debugging/admin purposes
    });
  });

  // Check IP credits endpoint
  app.get('/api/credits/check', async (req, res) => {
    try {
      const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.connection.remoteAddress || 'unknown';
      
      let ipCredit = await storage.getIpCredits(ip);
      if (!ipCredit) {
        ipCredit = await storage.createIpCredits(ip);
      }
      
      res.json({
        credits: ipCredit.credits,
        isUnlimited: ipCredit.isUnlimited,
        email: ipCredit.email,
        ip: ip
      });
    } catch (error: any) {
      console.error('Check credits error:', error);
      res.status(500).json({ error: 'Failed to check credits' });
    }
  });

  // PayPal routes
  app.get("/api/paypal/setup", async (req, res) => {
    await loadPaypalDefault(req, res);
  });

  app.post("/api/paypal/order", async (req, res) => {
    await createPaypalOrder(req, res);
  });

  app.post("/api/paypal/order/:orderID/capture", async (req, res) => {
    await capturePaypalOrder(req, res);
  });

  // AI chat endpoint with IP credit system
  app.post('/api/chat/message', async (req, res) => {
    try {
      const { message, sessionId } = messageSchema.parse(req.body);
      const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.connection.remoteAddress || 'unknown';
      
      // Check IP credits first
      let ipCredit = await storage.getIpCredits(ip);
      if (!ipCredit) {
        ipCredit = await storage.createIpCredits(ip);
      }
      
      // Check if IP has enough credits (unless unlimited)
      if (!ipCredit.isUnlimited && ipCredit.credits <= 0) {
        return res.status(429).json({ 
          error: 'No credits remaining. Contact admin to add more credits to your IP address.',
          credits: ipCredit.credits,
          contactInfo: {
            whatsapp: '+31 628 073 996',
            message: `Hi, I need more credits for Sofeia AI. My IP address is: ${ip}`
          }
        });
      }
      
      // Check if the message needs clarification first
      const clarification = needsClarification(message);
      
      if (clarification.needs) {
        // Return clarification questions without using credits
        const clarificationResponse = formatClarificationResponse(clarification.questions);
        return res.json({ 
          response: clarificationResponse,
          sessionId,
          timestamp: new Date().toISOString(),
          service: 'Sofeia AI (Clarification)',
          creditsUsed: 0,
          creditsRemaining: ipCredit.isUnlimited ? 'unlimited' : ipCredit.credits,
          needsClarification: true
        });
      }
      
      // Detect service type and process with appropriate AI
      const serviceType = detectServiceType(message);
      const aiRequest: AIRequest = {
        type: serviceType,
        content: message
      };
      
      const result = await processAIRequest(aiRequest);
      const formattedResponse = formatAIResponse(result.response, result.service, result.creditsUsed);
      
      // Deduct credits for non-unlimited IPs
      if (!ipCredit.isUnlimited) {
        const newCredits = ipCredit.credits - result.creditsUsed;
        await storage.updateIpCredits(ip, Math.max(0, newCredits));
      }
      
      res.json({ 
        response: formattedResponse,
        sessionId,
        timestamp: new Date().toISOString(),
        service: result.service,
        creditsUsed: result.creditsUsed,
        creditsRemaining: ipCredit.isUnlimited ? 'unlimited' : Math.max(0, ipCredit.credits - result.creditsUsed)
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("AI chat error:", error);
      res.status(500).json({ message: `Failed to process message: ${error.message}` });
    }
  });

  // Simplified WebSocket chat endpoint
  app.post('/api/chat/send', async (req, res) => {
    try {
      const { message, sessionId } = messageSchema.parse(req.body);

      // Broadcast to WebSocket clients
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ 
            type: 'new_message', 
            data: { message, sessionId, timestamp: new Date().toISOString() }
          }));
        }
      });

      res.json({ 
        message: "Message sent via WebSocket",
        sessionId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Admin routes for IP credit management
  app.post('/api/admin/credits/add', async (req, res) => {
    try {
      const { ipAddress, credits, email, adminKey } = req.body;
      
      // Simple admin key check (should use proper authentication in production)
      if (adminKey !== process.env.ADMIN_KEY) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
      
      if (!ipAddress || typeof credits !== 'number') {
        return res.status(400).json({ error: 'IP address and credits amount required' });
      }
      
      const result = await storage.addCreditsToIp(ipAddress, credits, email);
      res.json({ 
        message: `Added ${credits} credits to IP ${ipAddress}`,
        newTotal: result.credits,
        email: result.email
      });
    } catch (error: any) {
      console.error('Admin add credits error:', error);
      res.status(500).json({ error: 'Failed to add credits' });
    }
  });

  app.post('/api/admin/credits/unlimited', async (req, res) => {
    try {
      const { ipAddress, unlimited, adminKey } = req.body;
      
      if (adminKey !== process.env.ADMIN_KEY) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
      
      if (!ipAddress) {
        return res.status(400).json({ error: 'IP address required' });
      }
      
      const result = await storage.setUnlimitedForIp(ipAddress, unlimited === true);
      res.json({ 
        message: `Set IP ${ipAddress} to ${unlimited ? 'unlimited' : 'limited'} credits`,
        isUnlimited: result?.isUnlimited,
        credits: result?.credits
      });
    } catch (error: any) {
      console.error('Admin set unlimited error:', error);
      res.status(500).json({ error: 'Failed to set unlimited status' });
    }
  });

  app.get('/api/admin/credits/list', async (req, res) => {
    try {
      const { adminKey } = req.query;
      
      if (adminKey !== process.env.ADMIN_KEY) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
      
      const allCredits = await storage.getAllIpCredits();
      res.json(allCredits);
    } catch (error: any) {
      console.error('Admin list credits error:', error);
      res.status(500).json({ error: 'Failed to list credits' });
    }
  });

  // Simple status endpoint
  app.get('/api/status', async (req, res) => {
    res.json({ 
      status: "online",
      message: "Sofeia AI Chat is running",
      timestamp: new Date().toISOString()
    });
  });

  return httpServer;
}

declare global {
  namespace Express {
    interface Request {
      securityInfo: {
        ipAddress: string;
        userAgent: string;
        riskLevel: 'low' | 'medium' | 'high';
      };
    }
  }
}