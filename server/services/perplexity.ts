export async function searchWithPerplexity(query: string): Promise<string> {
  try {
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
            content: 'You are Sofeia AI research assistant. Prioritize information from official government sources (.gov, .gov.uk, .europa.eu, .gc.ca, .gov.au, .rijksoverheid.nl), educational institutions (.edu, .ac.uk), and high-authority domains (WHO, World Bank, OECD, UN). Focus on the most relevant regional/country-specific sources for the query. Avoid competitor AI content or marketing materials. Provide accurate, well-researched information with direct citations from official authoritative sources. Be concise but comprehensive.'
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
        search_domain_filter: [
          // US Government
          "gov", "fda.gov", "cdc.gov", "nih.gov", "epa.gov", "sec.gov",
          // UK Government  
          "gov.uk", "nhs.uk", "parliament.uk",
          // EU Government
          "europa.eu", "ema.europa.eu",
          // Canada Government
          "gc.ca", "canada.ca",
          // Australia Government
          "gov.au", "aph.gov.au",
          // Netherlands Government
          "rijksoverheid.nl", "government.nl",
          // Educational Institutions
          "edu", "ac.uk", "edu.au",
          // High Authority Sources
          "org", "wikipedia.org", "reuters.com", "bbc.com", "bloomberg.com",
          "nature.com", "science.org", "who.int", "worldbank.org", "imf.org",
          "oecd.org", "un.org", "unicef.org"
        ],
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