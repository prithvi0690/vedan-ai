import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/* ─────────────────── Source Card Component ─────────────────── */
const SourceCard = ({ source, index }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <button
            onClick={() => setExpanded(!expanded)}
            className="w-full text-left bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-3 transition-all duration-200 cursor-pointer group"
        >
            <div className="flex items-start gap-2">
                {/* Source number badge */}
                <span className="flex-shrink-0 bg-primary/10 text-primary text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center mt-0.5">
                    {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                    {/* Title */}
                    <p className="text-xs font-semibold text-gray-800 truncate">
                        {source.source}
                    </p>
                    {/* Notification + Section */}
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        {source.notification_number && source.notification_number !== 'N/A' && (
                            <span className="text-[10px] text-primary/70 font-medium">
                                📋 {source.notification_number}
                            </span>
                        )}
                        {source.section && (
                            <span className="text-[10px] text-gray-500">
                                §{source.section}
                            </span>
                        )}
                        {source.page > 0 && (
                            <span className="text-[10px] text-gray-400">
                                p.{source.page}
                            </span>
                        )}
                    </div>
                    {/* Expandable preview */}
                    {expanded && source.content && (
                        <p className="text-[11px] text-gray-500 mt-2 leading-relaxed border-t border-gray-100 pt-2">
                            {source.content}
                        </p>
                    )}
                </div>
                {/* Expand chevron */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={`w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-transform duration-200 flex-shrink-0 ${expanded ? 'rotate-180' : ''}`}
                >
                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                </svg>
            </div>
        </button>
    );
};

/* ─────────────────── Sources Section ─────────────────── */
const SourcesSection = ({ sources }) => {
    const [showSources, setShowSources] = useState(false);

    if (!sources || sources.length === 0) return null;

    return (
        <div className="mt-3 pt-2 border-t border-gray-100">
            <button
                onClick={() => setShowSources(!showSources)}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-primary transition-colors cursor-pointer"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                    <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h6v6h6v10H6z" />
                </svg>
                <span>{sources.length} source{sources.length > 1 ? 's' : ''}</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${showSources ? 'rotate-180' : ''}`}
                >
                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                </svg>
            </button>
            {showSources && (
                <div className="mt-2 space-y-1.5">
                    {sources.map((src, idx) => (
                        <SourceCard key={idx} source={src} index={idx} />
                    ))}
                </div>
            )}
        </div>
    );
};

/* ─────────────────── Chat Page ─────────────────── */
const Chat = () => {
    const location = useLocation();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef(null);
    const hasSentInitialQuery = useRef(false);

    // If navigated from Home with a query, auto-send it
    useEffect(() => {
        if (location.state?.query && !hasSentInitialQuery.current) {
            hasSentInitialQuery.current = true;
            const query = location.state.query;
            // Clear the state so refreshing doesn't re-send
            window.history.replaceState({}, document.title);

            // handleSend already adds the user message, so no need to add it here
            handleSend(null, query);
        }
    }, []); // Empty dependency array to run only once on mount

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e, initialQuery = null) => {
        if (e) e.preventDefault();
        const question = initialQuery || input.trim();

        if (!question || isLoading) return;

        // Add user message
        const userMsg = {
            id: Date.now(),
            type: 'user',
            text: question,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        if (!initialQuery) { // Only clear input if it's not an initial query
            setInput('');
        }
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question, k: 10 }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();

            const aiMsg = {
                id: Date.now() + 1,
                type: 'ai',
                text: data.answer,
                sources: data.sources,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            const errorMsg = {
                id: Date.now() + 1,
                type: 'ai',
                text: `Sorry, I encountered an error: ${error.message}. Please try again.`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full relative bg-gray-50">
            {/* Chat History Container */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth pb-8" ref={chatContainerRef}>
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-60">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 mb-4">
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                        </svg>
                        <p className="text-lg font-medium">Ready to assist with GST queries</p>
                        <p className="text-sm mt-1">Type a question below to get started</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-4 max-w-4xl mx-auto w-full ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center overflow-hidden ${msg.type === 'user' ? 'bg-gray-200' : 'bg-primary shadow-lg shadow-primary/20'}`}>
                                {msg.type === 'user' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-500">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                                    </svg>
                                )}
                            </div>
                            <div className={`flex flex-col ${msg.type === 'user' ? 'items-end max-w-[85%] md:max-w-[75%]' : 'items-start max-w-[90%] md:max-w-[85%]'}`}>
                                <div className={`px-5 py-3.5 rounded-2xl shadow-sm ${msg.type === 'user' ? 'bg-primary text-white rounded-tr-sm' : 'bg-white border border-gray-200 rounded-tl-sm'}`}>
                                    <p className={`text-sm md:text-base leading-relaxed whitespace-pre-wrap ${msg.type === 'ai' ? 'text-gray-700' : ''}`}>{msg.text}</p>
                                    {/* Sources section for AI messages */}
                                    {msg.type === 'ai' && msg.sources && (
                                        <SourcesSection sources={msg.sources} />
                                    )}
                                </div>
                                <span className="text-xs text-gray-400 mt-1 mr-1">{msg.timestamp}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Input Area Footer */}
            <div className="flex-shrink-0 bg-gray-50 border-t border-gray-200 p-4 md:px-8 md:py-6 z-10 w-full">
                <div className="max-w-4xl mx-auto w-full relative">
                    {/* Input Container */}
                    <form onSubmit={handleSend} className="relative bg-white border border-gray-200 rounded-xl shadow-lg focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all duration-200 flex flex-col">
                        {/* Text Area */}
                        <textarea
                            className="w-full bg-transparent border-0 text-gray-800 placeholder-gray-400 focus:ring-0 resize-none py-3.5 pl-4 pr-12 min-h-[56px] max-h-32 focus:outline-none"
                            placeholder="Ask a legal question or describe your tax scenario..."
                            rows="1"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                        ></textarea>
                        {/* Input Actions Toolbar */}
                        <div className="absolute right-2 bottom-2">
                            {/* Send Button */}
                            <button type="submit" className="bg-primary hover:bg-blue-700 text-white rounded-lg p-2 flex items-center justify-center transition-colors shadow-sm shadow-primary/30">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                                </svg>
                            </button>
                        </div>
                    </form>
                    {/* Disclaimer Footer */}
                    <div className="text-center mt-3">
                        <p className="text-[10px] md:text-xs text-gray-400">
                            Vedan-AI responses are for informational purposes only. Please verify with official documents before filing.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
