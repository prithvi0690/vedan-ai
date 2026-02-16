import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const Chat = () => {
    const location = useLocation();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const chatContainerRef = useRef(null);

    // If navigated from Home with a query, auto-send it
    useEffect(() => {
        if (location.state?.query) {
            const query = location.state.query;
            // Clear the state so refreshing doesn't re-send
            window.history.replaceState({}, document.title);

            const userMsg = {
                id: Date.now(),
                type: 'user',
                text: query,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages([userMsg]);

            // Simulate AI response (placeholder for backend)
            setTimeout(() => {
                const aiMsg = {
                    id: Date.now() + 1,
                    type: 'ai',
                    text: "I'm connected and ready. Once the backend is integrated, I'll provide real-time legal citations from official PDF sources here.",
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => [...prev, aiMsg]);
            }, 1000);
        }
    }, []);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = (e) => {
        if (e) e.preventDefault();
        if (!input.trim()) return;

        const userMsg = {
            id: Date.now(),
            type: 'user',
            text: input,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Simulate AI response (placeholder for backend)
        setTimeout(() => {
            const aiMsg = {
                id: Date.now() + 1,
                type: 'ai',
                text: "I'm connected and ready. Once the backend is integrated, I'll provide real-time legal citations from official PDF sources here.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, aiMsg]);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-full relative bg-gray-50">
            {/* Chat History Container */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth" ref={chatContainerRef}>
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
                                    <p className={`text-sm md:text-base leading-relaxed ${msg.type === 'ai' ? 'text-gray-700' : ''}`}>{msg.text}</p>
                                </div>
                                <span className="text-xs text-gray-400 mt-1 mr-1">{msg.timestamp}</span>
                            </div>
                        </div>
                    ))
                )}
                {/* Spacer for bottom input area */}
                <div className="h-24"></div>
            </div>

            {/* Input Area Footer */}
            <div className="absolute bottom-0 left-0 right-0 bg-gray-50/90 backdrop-blur-md border-t border-gray-200 p-4 md:px-8 md:py-6 z-10">
                <div className="max-w-4xl mx-auto relative">
                    {/* Input Container */}
                    <form onSubmit={handleSend} className="relative bg-white border border-gray-200 rounded-xl shadow-lg focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all duration-200 flex flex-col">
                        {/* Text Area */}
                        <textarea
                            className="w-full bg-transparent border-0 text-gray-800 placeholder-gray-400 focus:ring-0 resize-none py-3.5 px-4 pr-16 min-h-[56px] max-h-32 focus:outline-none"
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
                        <div className="flex items-center justify-between px-2 pb-2 pt-0">
                            {/* Left Actions */}
                            <div className="flex items-center gap-1">
                                <button type="button" className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-primary hover:bg-primary/5 px-2 py-1.5 rounded-lg transition-colors group">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 group-hover:text-primary">
                                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15.01l1.41 1.41L11 14.84V19h2v-4.16l1.59 1.59L16 15.01 12.01 11 8 15.01z" />
                                    </svg>
                                    <span>Upload PDF</span>
                                </button>
                            </div>
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
