import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function askGeneralQuestion(question: string): Promise<string> {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that provides accurate, concise, and well-structured answers to general questions. Focus on being informative while remaining approachable."
        },
        {
          role: "user",
          content: question,
        },
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      max_tokens: 2048,
    });

    return chatCompletion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response to your question.";
  } catch (error) {
    console.error("Groq API error:", error);
    throw new Error("Failed to process your question with Groq API");
  }
}