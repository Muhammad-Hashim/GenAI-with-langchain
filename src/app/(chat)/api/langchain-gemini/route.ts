import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";


export async function POST(req: { json: () => PromiseLike<{ question: any; }> | { question: any; }; }) {
  try {
    const { question } = await req.json();
console.log(question)
    if (!question) {
      return Response.json({ error: "Question is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Initialize LangChain with Gemini
    const model = new ChatGoogleGenerativeAI({ model: "gemini-pro", apiKey });

    // Create a chat prompt template
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", "You are a helpful AI assistant."],
      ["human", "Question: {question}"],
    ]);

    // Chain prompt with the model
    const chain = prompt.pipe(model);

    // Invoke the chain with user input
    const response = await chain.invoke({ question });
  console.log(response.text)
    return Response.json({ answer: response.text });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
