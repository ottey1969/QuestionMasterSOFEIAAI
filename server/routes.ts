import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault } from "./paypal";
import { extractSecurityInfo, generateFingerprint } from "./services/security";
import { processAIRequest, detectServiceType, formatAIResponse, type AIRequest } from "./services/aiRouter";
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
  
  wss.on('connection', (ws) => {
    console.log('New WebSocket connection established');
    
    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        console.log('WebSocket message received:', message);
        
        // Process AI chat messages
        if (message.type === 'chat') {
          try {
            const serviceType = detectServiceType(message.content);
            const aiRequest: AIRequest = {
              type: serviceType,
              content: message.content
            };
            
            const result = await processAIRequest(aiRequest);
            const formattedResponse = formatAIResponse(result.response, result.service, result.creditsUsed);
            
            ws.send(JSON.stringify({ 
              type: 'response', 
              content: formattedResponse,
              timestamp: new Date().toISOString(),
              service: result.service,
              creditsUsed: result.creditsUsed
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

  // Simple user session for chat (no authentication)
  app.get('/api/user/session', async (req, res) => {
    // Generate a simple session ID for anonymous users
    const sessionId = Math.random().toString(36).substring(2, 15);
    res.json({ 
      sessionId,
      isAnonymous: true,
      message: "Anonymous chat session created"
    });
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

  // AI chat endpoint with intelligent routing
  app.post('/api/chat/message', async (req, res) => {
    try {
      const { message, sessionId } = messageSchema.parse(req.body);
      
      // Detect service type and process with appropriate AI
      const serviceType = detectServiceType(message);
      const aiRequest: AIRequest = {
        type: serviceType,
        content: message
      };
      
      const result = await processAIRequest(aiRequest);
      const formattedResponse = formatAIResponse(result.response, result.service, result.creditsUsed);
      
      res.json({ 
        response: formattedResponse,
        sessionId,
        timestamp: new Date().toISOString(),
        service: result.service,
        creditsUsed: result.creditsUsed
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