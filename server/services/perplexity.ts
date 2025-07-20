interface PerplexityResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  citations?: string[];
}

export async function conductResearch(topic: string): Promise<{ content: string; citations: string[] }> {
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
            content: 'You are a professional research assistant. Provide comprehensive, well-sourced information with accurate citations.'
          },
          {
            role: 'user',
            content: `Research the following topic and provide detailed information with sources: ${topic}`
          }
        ],
        temperature: 0.2,
        max_tokens: 2048,
        return_citations: true,
        return_images: false,
        return_related_questions: false,
        search_recency_filter: 'month',
        top_p: 0.9,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`);
    }

    const data: PerplexityResponse = await response.json();
    
    return {
      content: data.choices[0]?.message?.content || "Unable to conduct research on this topic.",
      citations: data.citations || []
    };
  } catch (error) {
    console.error("Perplexity API error:", error);
    throw new Error("Failed to conduct research with Perplexity API");
  }
}