"use client";
import { useState, useEffect, useRef } from "react";

export default function ChatPage() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!question.trim()) return;

    const newMessages = [...messages, { role: "user", content: question }];
    setMessages(newMessages);
    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch("/api/langchain-gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      setMessages([...newMessages, { role: "gemini", content: data.answer }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([...newMessages, { role: "gemini", content: "Failed to fetch response" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="p-4 bg-white shadow-md text-center text-2xl font-bold">Chat with Google Gemini</header>

      {/* Chat Box */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto flex flex-col space-y-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 max-w-[75%] rounded-lg ${
                msg.role === "user"
                  ? "bg-blue-500 text-white self-end"
                  : "bg-gray-300 text-gray-800 self-start"
              }`}
            >
              <strong>{msg.role === "user" ? "You" : "Gemini"}:</strong> {msg.content}
            </div>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md flex items-center max-w-4xl mx-auto w-full">
        <input
          type="text"
          placeholder="Type a message..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
          className="flex-1 p-3 border rounded-lg bg-gray-100 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="ml-3 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Thinking..." : "Send"}
        </button>
      </form>
    </div>
  );
}
