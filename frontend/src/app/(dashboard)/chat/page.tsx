"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import type { ChatMessage } from "@/lib/types";

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get<ChatMessage[]>("/api/v1/chat").then(setMessages);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const content = input;
    setInput("");
    setMessages((prev) => [
      ...prev,
      { message_id: Date.now(), role: "user", content, created_at: new Date().toISOString() },
    ]);
    setSending(true);
    try {
      const reply = await api.post<ChatMessage>("/api/v1/chat", { content });
      setMessages((prev) => [...prev, reply]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col rounded-xl border border-zinc-200 bg-white">
      <div className="flex-1 space-y-3 overflow-y-auto p-6">
        {messages.map((m) => (
          <div key={m.message_id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-md rounded-2xl px-4 py-2 text-sm ${
                m.role === "user" ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-800"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2 border-t border-zinc-200 p-4">
        <input
          className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          placeholder="무엇이든 물어보세요"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          disabled={sending}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          전송
        </button>
      </form>
    </div>
  );
}
