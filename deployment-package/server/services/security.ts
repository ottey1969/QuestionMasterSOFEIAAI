import type { Request } from 'express';
import crypto from 'crypto';

export interface SecurityInfo {
  ipAddress: string;
  userAgent: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export function extractSecurityInfo(req: Request): SecurityInfo {
  const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() 
    || req.socket.remoteAddress 
    || '127.0.0.1';
  
  const userAgent = req.headers['user-agent'] || '';
  
  // Simple risk assessment based on patterns
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  
  // Check for suspicious patterns
  if (!userAgent || userAgent.length < 10) {
    riskLevel = 'high';
  } else if (userAgent.includes('bot') || userAgent.includes('crawler')) {
    riskLevel = 'medium';
  } else if (ipAddress.startsWith('10.') || ipAddress.startsWith('192.168.') || ipAddress === '127.0.0.1') {
    riskLevel = 'low'; // Local/private IPs are generally safe
  }
  
  return {
    ipAddress,
    userAgent,
    riskLevel
  };
}

export function generateFingerprint(req: Request): string {
  const components = [
    req.headers['user-agent'] || '',
    req.headers['accept-language'] || '',
    req.headers['accept-encoding'] || '',
    req.headers['accept'] || '',
    extractSecurityInfo(req).ipAddress
  ];
  
  const fingerprint = crypto
    .createHash('sha256')
    .update(components.join('|'))
    .digest('hex');
    
  return fingerprint.substring(0, 16); // Use first 16 characters
}