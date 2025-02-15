import { GoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "langchain/prompts";

export async function POST(req) {
  try {
    const { question } = await req.json();

    if (!question) {
      return Response.json({ error: "Question is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Initialize LangChain with Gemini
    const model = new GoogleGenerativeAI({ model: "gemini-pro", apiKey });

    // Create a chat prompt template
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", "You are a helpful AI assistant."],
      ["human", "Question: {question}"],
    ]);

    // Chain prompt with the model
    const chain = prompt.pipe(model);

    // Invoke the chain with user input
    const response = await chain.invoke({ question });

    return Response.json({ answer: response.text });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
