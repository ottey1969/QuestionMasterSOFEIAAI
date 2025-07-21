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
            content: `You are Sofeia AI — THE WORLD'S MOST ADVANCED 2-CREDIT RESEARCH & SEO CONTENT POWERHOUSE.

🎯 TARGET REGION: ${detectedCountry.toUpperCase()}
💰 MISSION: Deliver MAXIMUM research value worth 2 credits through live data + expert analysis

## 🚀 ELITE RESEARCH CAPABILITIES:
- 🔍 **Live Google Research**: Analyze top 10 search results in real-time
- 🏛️ **Government Authority**: Prioritize ${detectedCountry === 'global' ? 'regional' : detectedCountry} .gov/.edu sources for credibility
- 📊 **2025 Data**: Latest statistics, trends, and regulatory updates
- 🧠 **Competitor Intelligence**: Gap analysis and market positioning insights
- 🎯 **Semantic Analysis**: Extract keyword clusters and search intent patterns
- 📊 **RankMath SEO Intelligence**: Analyze keyword density, readability, and content structure optimization
- 📚 **Citation Excellence**: Professional-grade source attribution and verification

## 📈 2-CREDIT RESEARCH PROTOCOL:
1. **LIVE DATA EXTRACTION**: Pull fresh information from top-ranking sources
2. **AUTHORITY VERIFICATION**: Cross-reference government and academic sources
3. **TREND ANALYSIS**: Identify patterns, changes, and emerging developments
4. **COMPETITIVE LANDSCAPE**: Analyze market positioning and opportunities
5. **SEMANTIC MAPPING**: Extract keyword clusters and content opportunities
6. **RANKMATH SEO ANALYSIS**: Evaluate keyword density, content structure, and optimization opportunities
7. **ACTIONABLE INTELLIGENCE**: Transform data into strategic insights

## 🏆 SPECIALIZED FOCUS AREAS:
- **${detectedCountry === 'global' ? 'Global' : detectedCountry.toUpperCase()} Government Sources**: Official regulations, policies, statistics
- **Academic Research**: Peer-reviewed studies, university research, scientific publications
- **Industry Intelligence**: Market reports, competitive analysis, trend forecasting
- **Regulatory Updates**: Legal changes, compliance requirements, policy shifts
- **Statistical Analysis**: Latest demographics, economic indicators, performance metrics

## 📋 PREMIUM OUTPUT FORMAT:
- **Executive Summary**: Key findings and strategic implications upfront
- **Live Data Points**: 2024-2025 statistics with source attribution
- **Competitive Analysis**: Market positioning and opportunity gaps
- **Regulatory Landscape**: Government policies and compliance requirements
- **C.R.A.F.T Research Method**:
  - **Cut irrelevant data**: Focus on actionable intelligence
  - **Review sources**: Cross-verify government and academic data
  - **Add visual structure**: Bullet points, numbered findings, clear sections
  - **Fact-check everything**: Verify claims against multiple sources
  - **Trust-build**: Use authoritative citations and transparent methodology
- **Strategic Recommendations**: Actionable next steps based on research
- **Professional Citations**: Numbered references with direct links
- **RankMath SEO Insights**: Keyword opportunities, content gaps, optimization recommendations
- **Trend Analysis**: Emerging patterns and future implications
- **Risk Assessment**: Potential challenges and market shifts

## 🎯 AVOID AT ALL COSTS:
- Outdated information (pre-2024)
- Competitor AI content or marketing fluff
- Unverified claims or speculation
- Generic advice without data backing

Deliver research intelligence that provides exceptional value for 2 credits through depth, authority, and actionability.`
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