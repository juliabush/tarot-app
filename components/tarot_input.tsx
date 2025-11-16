"use client";

import { useState } from "react";

export default function TarotInput() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [displayedText, setDisplayedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Error state

  async function handleAsk() {
    if (!question.trim()) {
      setError("Please enter a question before asking.");
      return;
    }

    setError(""); // Clear error if input is valid
    setLoading(true);
    setResponse(null);
    setDisplayedText("");

    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();
    const fullText = data.answer || "";

    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        const char = fullText.charAt(i);
        setDisplayedText((prev) => prev + char);
        i++;
      } else {
        clearInterval(interval);
        setResponse(fullText);
        setLoading(false);
      }
    }, 20);
  }

  // Helper to ensure question ends with a question mark
  const formatQuestion = (q: string) => {
    const trimmed = q.trim();
    return trimmed.endsWith("?") ? trimmed : trimmed + "?";
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col w-full max-w-2xl">
        <div className="flex items-center bg-white text-black rounded-full px-6 py-3 shadow-xl">
          <input
            className="flex-1 bg-transparent outline-none text-lg"
            placeholder="Input your question here..."
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              if (error) setError(""); // clear error on input
            }}
          />
          <button
            onClick={handleAsk}
            className="ml-4 bg-purple-600 text-white rounded-full px-5 py-2"
          >
            Ask
          </button>
        </div>
        {error && <p className="text-red-600 text-sm mt-2 px-6">{error}</p>}
      </div>

      {/* Response Modal */}
      {(loading || response) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md z-50">
          <div className="bg-white text-black rounded-3xl p-10 max-w-3xl w-full shadow-2xl">
            <h2 className="text-3xl font-bold mb-6 text-center">
              {formatQuestion(question)}
            </h2>
            <p className="mb-8 text-lg leading-snug text-center break-words">
              {displayedText || "Consulting the cards..."}
            </p>
            {!loading && (
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    setResponse(null);
                    setDisplayedText("");
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
