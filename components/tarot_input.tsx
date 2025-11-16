"use client";

import { useState } from "react";
import tarotCards from "../public/tarot-json /tarot-loop.json";

interface TarotCard {
  name: string;
  url: string;
}

export default function TarotInput() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [displayedText, setDisplayedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCards, setSelectedCards] = useState<TarotCard[]>([]);

  function pickRandomCards(cards: TarotCard[], count = 3) {
    const copy = [...cards];
    const picked: TarotCard[] = [];
    while (picked.length < count && copy.length > 0) {
      const index = Math.floor(Math.random() * copy.length);
      picked.push(copy.splice(index, 1)[0]);
    }
    return picked;
  }

  async function handleAsk() {
    if (!question.trim()) {
      setError("Please enter a question before asking.");
      return;
    }

    setError("");
    setLoading(true);
    setResponse(null);
    setDisplayedText("");

    const cards = pickRandomCards(tarotCards, 3);
    setSelectedCards(cards);

    const cardNames = cards.map((c) => c.name).join(", ");
    const prompt = `Question: ${question.trim()}${
      question.trim().endsWith("?") ? "" : "?"
    } 
Tarot cards drawn: ${cardNames}. Include these cards in your answer.`;

    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: prompt }),
    });

    const data = await res.json();
    const fullText = data.answer || "";

    // Fix first-character trimming
    if (fullText.length > 0) {
      setDisplayedText(fullText.charAt(0)); // initialize with first character
    }

    let i = 1; // start loop from second character
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setDisplayedText((prev) => prev + fullText.charAt(i));
        i++;
      } else {
        clearInterval(interval);
        setResponse(fullText);
        setLoading(false);
      }
    }, 20);
  }

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
              if (error) setError("");
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
            {/* User question as modal title */}
            <h2 className="text-3xl font-bold mb-6 text-center">
              {question.trim().endsWith("?")
                ? question.trim()
                : question.trim() + "?"}
            </h2>

            <div className="flex justify-center gap-6 mb-6 flex-wrap">
              {selectedCards.map((card) => (
                <div key={card.name} className="flex flex-col items-center">
                  <img
                    src={card.url}
                    alt={card.name}
                    className="w-24 h-36 object-cover rounded-lg border-2 border-purple-600"
                  />
                  <span className="mt-2 font-semibold text-purple-600 text-center">
                    {card.name}
                  </span>
                </div>
              ))}
            </div>

            <p className="mb-8 text-lg leading-snug text-center break-words">
              {displayedText || "Consulting the cards..."}
            </p>

            {!loading && (
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    setResponse(null);
                    setDisplayedText("");
                    setSelectedCards([]);
                    setQuestion("");
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
