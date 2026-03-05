import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/* ─────────────────── Helper Functions ─────────────────── */
const formatSourceName = (filename) => {
    if (!filename) return 'Unknown Document';

    // Exact mapping for known high-profile documents
    const knownDocs = {
        'UNKNOWN-General-2017-04-12': 'CGST Act 2017',
        'UNKNOWN-General-2017-06-28': 'CGST Rules 2017'
    };

    if (knownDocs[filename]) {
        return knownDocs[filename];
    }

    // Fallback cleanup for other parsed filenames
    return filename
        .replace(/^UNKNOWN-General-/, '') // Remove prefix
        .replace(/-/g, ' ')               // Replace dashes with spaces
        .replace(/(\d{4}) (\d{2}) (\d{2})/, '$1-$2-$3'); // Restore YYYY-MM-DD date format
};

/* ─────────────────── Source Card Component ─────────────────── */
const SourceCard = ({ source, index }) => {
    const [expanded, setExpanded] = useState(true);

    return (
        <div id={`source-${index + 1}`} className="w-full">
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
                        <p className="text-xs font-semibold text-gray-800 truncate" title={source.source}>
                            {formatSourceName(source.source)}
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
        </div>
    );
};

/* ─────────────────── Sources Section ─────────────────── */
const SourcesSection = ({ sources }) => {
    const [showSources, setShowSources] = useState(true);

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
    const messagesEndRef = useRef(null);
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

    // Scroll to top for first messages, scroll to bottom for subsequent messages
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (messages.length <= 2) {
                chatContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
        return () => clearTimeout(timeoutId);
    }, [messages, isLoading]);

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
        <div className="chat-layout flex flex-col h-full bg-gray-50 overflow-hidden">
            {/* Chat History Container */}
            <div className="message-list flex-1 overflow-y-auto overscroll-contain p-4 md:p-8 pt-8 md:pt-12 space-y-8" ref={chatContainerRef}>
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-6">
                        <div className="flex flex-col items-center opacity-60">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 mb-4">
                                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                            </svg>
                            <p className="text-lg font-medium">Ready to assist with GST queries</p>
                            <p className="text-sm mt-1">Type a question below to get started</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2 max-w-2xl px-4 mt-4">
                            {['What are the latest GST rates for electronics?', 'How to file GSTR-1?', 'Explain Input Tax Credit'].map((suggestion, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSend(null, suggestion)}
                                    className="bg-white border border-gray-200 hover:border-primary hover:text-primary hover:bg-blue-50 px-4 py-2 rounded-full text-[13px] font-medium text-gray-500 transition-colors shadow-sm"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-4 max-w-4xl mx-auto w-full ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center overflow-hidden shadow-sm ${msg.type === 'user' ? 'bg-primary' : 'bg-primary shadow-primary/20'}`}>
                                {msg.type === 'user' ? (
                                    <span className="text-sm font-bold text-white uppercase">U</span>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                                    </svg>
                                )}
                            </div>
                            <div className={`flex flex-col ${msg.type === 'user' ? 'items-end max-w-[85%] md:max-w-[75%]' : 'items-start max-w-[90%] md:max-w-[85%]'}`}>
                                <div className={`px-5 py-3.5 rounded-2xl shadow-sm ${msg.type === 'user' ? 'bg-primary text-white rounded-tr-sm' : 'bg-white border border-gray-200 rounded-tl-sm w-full overflow-hidden'}`}>
                                    {msg.type === 'user' ? (
                                        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                    ) : (
                                        <div className="text-sm md:text-base leading-relaxed text-gray-700 prose prose-sm max-w-none prose-p:leading-relaxed prose-li:my-0.5">
                                            <ReactMarkdown
                                                components={{
                                                    a: ({ node, ...props }) => {
                                                        const href = props.href || '';
                                                        if (href.startsWith('#source-')) {
                                                            return (
                                                                <a {...props} className="inline-flex items-center justify-center bg-primary/10 text-primary hover:bg-primary/20 hover:text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded ml-1 cursor-pointer transition-colors no-underline">
                                                                    {props.children}
                                                                </a>
                                                            );
                                                        }
                                                        return <a {...props} className="text-primary hover:underline" />;
                                                    }
                                                }}
                                            >
                                                {msg.text.replace(/\[Source\s*(\d+)\]/gi, ' [Source $1](#source-$1) ')}
                                            </ReactMarkdown>
                                        </div>
                                    )}

                                    {/* Sources section for AI messages */}
                                    {msg.type === 'ai' && msg.sources && (
                                        <SourcesSection sources={msg.sources} />
                                    )}

                                    {/* Disclaimer inside AI card */}
                                    {msg.type === 'ai' && (
                                        <div className="mt-4 pt-3 border-t border-gray-100/50">
                                            <p className="text-[10px] text-gray-400">
                                                Vedan-AI responses are for informational purposes only. Please verify with official documents before filing.
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <span className="text-xs text-gray-400 mt-1 mr-1 self-end">{msg.timestamp}</span>
                            </div>
                        </div>
                    ))
                )}
                {/* Loading indicator */}
                {isLoading && (
                    <div className="flex gap-4 max-w-4xl mx-auto w-full">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center bg-primary shadow-lg shadow-primary/20 overflow-hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                            </svg>
                        </div>
                        <div className="flex flex-col items-start px-5 py-4 bg-white border border-gray-200 rounded-2xl rounded-tl-sm shadow-sm h-[52px] justify-center">
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '-0.3s' }}></div>
                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '-0.15s' }}></div>
                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} className="h-2"></div>
            </div>

            {/* Input Area Footer */}
            <div className="input-bar flex-shrink-0 bg-gray-50/90 backdrop-blur-md border-t border-gray-200/50 p-4 md:px-8 md:py-6 z-10 sticky bottom-0"
                style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 32px)' }}>
                <div className="max-w-4xl mx-auto relative">
                    {/* Input Container */}
                    <form onSubmit={handleSend} className={`relative bg-white border border-gray-200 rounded-xl shadow-lg transition-all duration-200 flex flex-col ${isLoading ? 'opacity-80' : 'focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary'}`}>
                        {/* Text Area */}
                        <textarea
                            className="w-full bg-transparent border-0 text-gray-800 placeholder-gray-400 focus:ring-0 resize-none py-3.5 px-4 pr-16 min-h-[56px] max-h-32 focus:outline-none disabled:bg-gray-50/50"
                            placeholder="Ask a legal question or describe your tax scenario..."
                            rows="1"
                            value={input}
                            disabled={isLoading}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                        ></textarea>
                        {/* Input Actions Toolbar */}
                        <div className="flex items-center justify-between px-2 pb-2 pt-0">
                            {/* Left Actions */}
                            <div className="flex items-center gap-1">
                                <button type="button" disabled={isLoading} className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-primary hover:bg-primary/5 px-2 py-1.5 rounded-lg transition-colors group disabled:opacity-50 disabled:hover:bg-transparent">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 group-hover:text-primary">
                                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15.01l1.41 1.41L11 14.84V19h2v-4.16l1.59 1.59L16 15.01 12.01 11 8 15.01z" />
                                    </svg>
                                    <span className="hidden sm:inline">Upload PDF</span>
                                </button>
                            </div>
                            {/* Send Button */}
                            <button type="submit" disabled={isLoading || !input.trim()} className="bg-primary hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 text-white rounded-lg p-2 flex items-center justify-center transition-colors shadow-sm disabled:shadow-none shadow-primary/30">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Chat;
