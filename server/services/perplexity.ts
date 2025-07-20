// Country-specific domain mappings
const countryDomains = {
  india: ["gov.in", "nic.in", "rbi.org.in", "sebi.gov.in", "irdai.gov.in", "cbdt.gov.in", "incometaxindia.gov.in"],
  usa: ["gov", "fda.gov", "cdc.gov", "nih.gov", "epa.gov", "sec.gov", "treasury.gov"],
  uk: ["gov.uk", "nhs.uk", "parliament.uk", "ofcom.org.uk", "fca.org.uk"],
  canada: ["gc.ca", "canada.ca", "bankofcanada.ca", "cra-arc.gc.ca"],
  australia: ["gov.au", "aph.gov.au", "rba.gov.au", "asic.gov.au"],
  netherlands: ["rijksoverheid.nl", "government.nl", "dnb.nl"],
  germany: ["bund.de", "bundesregierung.de", "bundesbank.de"],
  france: ["gouv.fr", "service-public.fr", "banque-france.fr"],
  singapore: ["gov.sg", "mas.gov.sg", "moh.gov.sg"],
  japan: ["go.jp", "mof.go.jp", "boj.or.jp"],
  china: ["gov.cn", "pbc.gov.cn", "csrc.gov.cn"],
  brazil: ["gov.br", "bcb.gov.br", "receita.fazenda.gov.br"],
  mexico: ["gob.mx", "banxico.org.mx"]
};

// Detect target country from query
function detectTargetCountry(query: string): { domains: string[], country: string } {
  const lowerQuery = query.toLowerCase();
  
  // Direct country mentions
  for (const [country, domains] of Object.entries(countryDomains)) {
    if (lowerQuery.includes(country) || 
        (country === 'usa' && (lowerQuery.includes('united states') || lowerQuery.includes('america'))) ||
        (country === 'uk' && (lowerQuery.includes('united kingdom') || lowerQuery.includes('britain'))) ||
        (country === 'singapore' && lowerQuery.includes('sg'))) {
      return { domains, country };
    }
  }
  
  // Default to comprehensive global list
  const globalDomains = [
    // Major Government Sources
    "gov.in", "nic.in", "rbi.org.in", "sebi.gov.in", // India
    "gov", "fda.gov", "cdc.gov", "nih.gov", "epa.gov", "sec.gov", // USA
    "gov.uk", "nhs.uk", "parliament.uk", // UK
    "europa.eu", "ema.europa.eu", // EU
    "gc.ca", "canada.ca", // Canada
    "gov.au", "aph.gov.au", // Australia
    "gov.sg", "mas.gov.sg", // Singapore
    "go.jp", "mof.go.jp", // Japan
    // Educational
    "edu", "ac.uk", "edu.au", "ac.in",
    // International Organizations
    "who.int", "worldbank.org", "imf.org", "oecd.org", "un.org"
  ];
  
  return { domains: globalDomains, country: 'global' };
}

export async function searchWithPerplexity(query: string): Promise<string> {
  try {
    const { domains: targetDomains, country: detectedCountry } = detectTargetCountry(query);
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: `You are Sofeia AI research assistant. Target region detected: ${detectedCountry.toUpperCase()}. Prioritize information from relevant ${detectedCountry === 'global' ? 'regional' : detectedCountry} government sources, educational institutions, and high-authority domains. Focus on official government websites, regulatory bodies, and authoritative sources for ${detectedCountry === 'global' ? 'the most relevant region' : detectedCountry}. Avoid competitor AI content or marketing materials. Provide accurate, well-researched information with direct citations from official sources. Be concise but comprehensive.`
          },
          {
            role: 'user',
            content: query
          }
        ],
        max_tokens: 1024,
        temperature: 0.2,
        top_p: 0.9,
        return_citations: true,
        return_images: false,
        return_related_questions: false,
        search_recency_filter: 'month',
        search_domain_filter: targetDomains,
        stream: false
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    let result = data.choices[0]?.message?.content || "I couldn't find information on this topic.";
    
    // Add citations if available
    if (data.citations && data.citations.length > 0) {
      result += "\n\n**📚 Sources:**\n" + data.citations.slice(0, 5).map((citation: string, index: number) => 
        `${index + 1}. [${citation}](${citation})`
      ).join('\n');
    }
    
    return result;
  } catch (error: any) {
    console.error('Perplexity API error:', error);
    throw new Error(`Failed to search with Perplexity: ${error.message}`);
  }
}