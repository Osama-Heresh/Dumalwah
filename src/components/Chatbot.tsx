import React, { useState, useRef, useEffect } from "react";
import { Message, Language } from "../types";
import { translations } from "../translations";
import { Send, Sparkles, MessageCircle, ArrowRight, User } from "lucide-react";

interface ChatbotProps {
  language: Language;
}

export default function Chatbot({ language }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "model",
      text: translations[language].chatWelcomeText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const t = translations[language];

  const suggestions = [
    t.chatSuggest1,
    t.chatSuggest2,
    t.chatSuggest3,
    t.chatSuggest4
  ];

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Adjust welcome message language when switching language
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].id === "welcome") {
        return [{
          id: "welcome",
          role: "model",
          text: translations[language].chatWelcomeText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }];
      }
      return prev;
    });
  }, [language]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Package conversation history for context
      const chatHistory = messages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: chatHistory,
          isEnglish: language === "en"
        })
      });

      const data = await response.json();

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: "model",
        text: data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      // Fallback message
      const errorMsg: Message = {
        id: `ai-err-${Date.now()}`,
        role: "model",
        text: language === "en" 
          ? "I am currently having trouble connecting to my central hive. Please try again in a few moments, or ask me another question."
          : "أواجه حالياً صعوبة في الاتصال بالخلية المركزية. يرجى المحاولة بعد لحظات، أو طرح سؤال آخر.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#FFFFFF] border-2 border-amber-200/80 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[600px] relative qamariyah-grid" id="ai-chatbot-panel">
      {/* Header Banner with vibrant Qamariyah stained-glass colors */}
      <div className="bg-gradient-to-r from-qamariyah-blue via-qamariyah-purple to-qamariyah-amber p-4 md:p-5 text-white flex items-center justify-between border-b-2 border-white/20 shadow-md relative overflow-hidden" id="chatbot-header">
        <div className="absolute inset-0 bg-black/15 mix-blend-overlay"></div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-11 h-11 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-white shadow-inner animate-pulse">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="text-right">
            <h3 className="font-extrabold text-base md:text-lg tracking-tight text-white font-sans drop-shadow-sm">
              {t.chatHeaderTitle}
            </h3>
            <p className="text-xs text-white/90 font-mono tracking-wider">
              {t.chatHeaderSubtitle}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 relative z-10">
          <span className="w-2.5 h-2.5 bg-qamariyah-green-light rounded-full animate-ping"></span>
          <span className="w-2.5 h-2.5 bg-qamariyah-green-light rounded-full absolute"></span>
        </div>
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans bg-[#FCFAF7]/40 backdrop-blur-xs" id="chatbot-messages-window">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex w-full ${isUser ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              id={`chat-msg-${msg.id}`}
            >
              <div className={`flex items-start gap-2 max-w-[85%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`w-8.5 h-8.5 rounded-full flex items-center justify-center shrink-0 border-2 shadow-sm ${
                  isUser 
                    ? "bg-gradient-to-br from-qamariyah-amber to-amber-500 border-white text-white" 
                    : "bg-gradient-to-br from-qamariyah-blue to-qamariyah-purple border-white text-white"
                }`}>
                  {isUser ? <User className="w-4.5 h-4.5" /> : <Sparkles className="w-4.5 h-4.5" />}
                </div>
                
                <div>
                  <div className={`rounded-2xl p-3.5 text-sm leading-relaxed shadow-md ${
                    isUser 
                      ? "bg-gradient-to-r from-qamariyah-amber to-amber-600 text-white rounded-tr-none" 
                      : "bg-white text-[#4A2F13] border border-amber-100 rounded-tl-none whitespace-pre-line"
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-[#4A2F13]/40 mt-1 block px-1 text-right font-mono font-bold">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Bubble */}
        {loading && (
          <div className="flex justify-start" id="chatbot-loading-indicator">
            <div className="flex items-start gap-2 max-w-[80%]">
              <div className="w-8.5 h-8.5 rounded-full bg-gradient-to-br from-qamariyah-blue to-qamariyah-purple border-2 border-white text-white flex items-center justify-center animate-spin">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <div className="bg-white border border-amber-100 rounded-2xl rounded-tl-none p-4 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-qamariyah-blue-light rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2.5 h-2.5 bg-qamariyah-purple-light rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2.5 h-2.5 bg-qamariyah-amber-light rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Slider with colorful buttons */}
      <div className="bg-[#FAF6ED] border-t border-amber-200/40 p-3 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2 relative z-10" id="chatbot-suggestions">
        {suggestions.map((sug, idx) => {
          // Cycle through beautiful colors for suggestions
          const colors = [
            "hover:border-qamariyah-blue hover:bg-qamariyah-blue/5 text-qamariyah-blue",
            "hover:border-qamariyah-red hover:bg-qamariyah-red/5 text-qamariyah-red",
            "hover:border-qamariyah-green hover:bg-qamariyah-green/5 text-qamariyah-green",
            "hover:border-qamariyah-amber hover:bg-qamariyah-amber/5 text-qamariyah-amber"
          ];
          const colorClass = colors[idx % colors.length];
          return (
            <button
              key={idx}
              disabled={loading}
              onClick={() => handleSendMessage(sug)}
              className={`inline-flex items-center gap-1.5 bg-white font-bold font-sans text-xs border border-[#EADFC9] rounded-full px-4 py-2 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sm ${colorClass}`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              {sug}
            </button>
          );
        })}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(input);
        }}
        className="p-3 bg-[#FFFFFF] border-t-2 border-amber-100 flex items-center gap-2 relative z-10"
        id="chatbot-input-form"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.chatInputPlaceholder}
          disabled={loading}
          className="flex-1 bg-[#FCFAF7] border-2 border-amber-200/50 focus:border-qamariyah-blue-light focus:ring-1 focus:ring-qamariyah-blue-light rounded-xl px-4 py-3 text-sm text-[#4A2F13] placeholder-[#4A2F13]/40 outline-none transition"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-qamariyah-blue to-qamariyah-purple hover:from-qamariyah-blue-light hover:to-qamariyah-purple-light disabled:from-stone-200 disabled:to-stone-300 text-white flex items-center justify-center transition-all duration-300 cursor-pointer shadow-md disabled:shadow-none hover:shadow-lg hover:-translate-y-0.5"
          id="chatbot-send-button"
        >
          <Send className={`w-5 h-5 ${language === "ar" ? "rotate-180" : ""}`} />
        </button>
      </form>
    </div>
  );
}
