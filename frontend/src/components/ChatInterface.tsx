"use client";
import { authenticatedFetch } from "../lib/api";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatInterface() {
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await authenticatedFetch(`/chat/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            });

            if (response.ok) {
                const data = await response.json();
                const aiMessage = { role: "assistant", content: data.response };
                setMessages((prev) => [...prev, aiMessage]);
            } else {
                setMessages((prev) => [...prev, { role: "assistant", content: "Error: Could not get response." }]);
            }
        } catch (error) {
            setMessages((prev) => [...prev, { role: "assistant", content: "Error: Network issue." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            {/* Backdrop for Mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden pointer-events-auto"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed inset-0 m-auto w-[90%] max-w-[350px] h-[500px] md:static md:w-[400px] md:h-[500px] md:mb-4 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col animate-in zoom-in-95 md:animate-in md:slide-in-from-bottom-5 duration-300 z-50 pointer-events-auto">
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 relative rounded-lg overflow-hidden pb-1">
                                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-white">Financial Advisor</h2>

                            </div>
                        </div>
                        {/* Mobile Close Button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="md:hidden text-white/80 hover:text-white"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                        {messages.length === 0 && (
                            <div className="text-center text-gray-400 mt-10">
                                <Bot className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                <p className="text-sm">Hi! I can help with:</p>
                                <div className="flex flex-wrap gap-2 justify-center mt-4">
                                    <button
                                        className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:bg-violet-50 hover:border-violet-200 transition-colors"
                                        onClick={() => setInput("How can I save money?")}
                                    >
                                        Saving Tips
                                    </button>
                                    <button
                                        className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:bg-violet-50 hover:border-violet-200 transition-colors"
                                        onClick={() => setInput("Analyze my spending")}
                                    >
                                        Spend Analysis
                                    </button>
                                </div>
                            </div>
                        )}
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "user" ? "bg-blue-100" : "bg-violet-100"
                                    }`}>
                                    {msg.role === "user" ? (
                                        <User className="w-3 h-3 text-blue-600" />
                                    ) : (
                                        <Bot className="w-3 h-3 text-violet-600" />
                                    )}
                                </div>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                                    ? "bg-blue-600 text-white rounded-tr-none"
                                    : "bg-white border border-gray-100 text-gray-700 shadow-sm rounded-tl-none"
                                    }`}>

                                    {msg.role === "assistant" ? (
                                        <div className="prose prose-sm prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-gray-800 prose-pre:p-2 prose-pre:rounded-lg">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-4 mb-2" {...props} />,
                                                    ol: ({ node, ...props }) => <ol className="list-decimal list-outside ml-4 mb-2" {...props} />,
                                                    li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                                    p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                    strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900" {...props} />,
                                                    a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                                                }}
                                            >
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        msg.content
                                    )}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex gap-2">
                                <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-3 h-3 text-violet-600" />
                                </div>
                                <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm">
                                    <div className="flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                                        <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                                        <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-3 bg-white border-t border-gray-100">
                        <div className="flex gap-2 relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                                placeholder="Ask about finances..."
                                className="flex-1 p-2.5 pl-4 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all text-gray-800 placeholder-gray-400"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!input.trim() || loading}
                                className="p-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toggle Button (FAB) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center pointer-events-auto ${isOpen
                    ? "bg-gray-800 text-white rotate-90"
                    : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                    }`}
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                ) : (
                    <Bot className="w-8 h-8" />
                )}
            </button>
        </div>
    );
}
