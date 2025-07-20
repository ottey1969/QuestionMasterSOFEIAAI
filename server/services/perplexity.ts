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
            content: 'You are Sofeia AI research assistant. Provide accurate, well-researched information with citations when possible. Be concise but comprehensive.'
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
        search_recency_filter: 'month',
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
      result += "\n\nSources:\n" + data.citations.slice(0, 3).map((citation: string, index: number) => 
        `${index + 1}. ${citation}`
      ).join('\n');
    }
    
    return result;
  } catch (error: any) {
    console.error('Perplexity API error:', error);
    throw new Error(`Failed to search with Perplexity: ${error.message}`);
  }
}