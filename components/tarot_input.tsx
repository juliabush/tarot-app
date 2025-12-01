"use client";

import { useState, useEffect } from "react";
import tarotCards from "../tarot-json/tarot-loop.json";

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

  async function typeWriterAppend(text: string, delay = 0) {
    for (let i = 0; i < text.length; i++) {
      setDisplayedText((prev) => prev + text[i]);
      await new Promise((res) => setTimeout(res, delay));
    }
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
    setSelectedCards([]);

    const cards = pickRandomCards(tarotCards, 3);
    setSelectedCards(cards);

    const cardNames = cards.map((c) => c.name).join(", ");
    const prompt = `Question: ${question.trim()}${
      question.trim().endsWith("?") ? "" : "?"
    } 
Tarot cards drawn: ${cardNames}. Include these cards in your answer.`;

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: prompt }),
      });

      if (!res.body) throw new Error("No response body.");

      const queue: string[] = [];
      let fullText = "";
      let animationActive = true;

      async function runTypewriter() {
        while (animationActive) {
          if (queue.length > 0) {
            const nextChar = queue.shift()!;
            setDisplayedText((prev) => prev + nextChar);
          }
          await new Promise((r) => setTimeout(r, 0));
        }
      }

      runTypewriter();

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let done = false;
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter(Boolean);
          for (const line of lines) {
            try {
              const parsed = JSON.parse(line);
              if (
                parsed.type === "response.output_text.delta" &&
                parsed.delta
              ) {
                queue.push(...parsed.delta.split(""));
                fullText += parsed.delta;
              }
            } catch (e) {
              console.error("Failed to parse line:", line, e);
            }
          }
        }
      }

      animationActive = false;
      setResponse(fullText);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      setError("Failed to fetch the response. Please try again.");
      console.error(err);
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && (loading || response)) {
        setResponse(null);
        setDisplayedText("");
        setSelectedCards([]);
        setQuestion("");
        setError("");
        setLoading(false);
      }
      if (e.key === "Enter") {
        handleAsk();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loading, response, question]);

  function renderResponseWithTitles(text: string) {
    const cleanedText = text.replace(/\d+\.\s*/g, "").replace(/:\s*/g, "");
    const parts = cleanedText.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        const title = part.slice(2, -2);
        return (
          <p key={idx} className="mb-4">
            <strong>{title}</strong>
          </p>
        );
      } else {
        return (
          <p key={idx} className="mb-4">
            {part}
          </p>
        );
      }
    });
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

      {(loading || response) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md z-50">
          <div className="bg-white text-black rounded-3xl p-10 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
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
                    className="w-36 h-56 object-cover rounded-lg border-2 border-purple-600"
                  />
                  <span className="mt-2 font-semibold text-purple-600 text-center">
                    {card.name}
                  </span>
                </div>
              ))}
            </div>

            <div className="mb-8 text-lg leading-snug text-center break-words">
              {displayedText
                ? renderResponseWithTitles(displayedText)
                : "Consulting the cards..."}
            </div>

            {!loading && (
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    setResponse(null);
                    setDisplayedText("");
                    setSelectedCards([]);
                    setQuestion("");
                    setError("");
                    setLoading(false);
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
