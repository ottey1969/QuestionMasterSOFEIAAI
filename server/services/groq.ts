import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function askGeneralQuestion(question: string): Promise<string> {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are Sofeia AI, an advanced autonomous AI assistant. Provide helpful, accurate, and concise responses to user questions. Be professional yet friendly."
        },
        {
          role: "user",
          content: question
        }
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      max_tokens: 1024,
    });

    return completion.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";
  } catch (error: any) {
    console.error('Groq API error:', error);
    throw new Error(`Failed to get response from Groq: ${error.message}`);
  }
}