import { useState, useEffect, useRef } from 'react';

const Chat = () => {
    // State for chat messages
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const chatContainerRef = useRef(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = (e) => {
        if (e) e.preventDefault();
        if (!input.trim()) return;

        // Add user message
        const userMsg = {
            id: Date.now(),
            type: 'user',
            text: input,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Simulate AI response (placeholder for backend)
        // In a real app, you would make an API call here
        setTimeout(() => {
            const aiMsg = {
                id: Date.now() + 1,
                type: 'ai',
                text: "I'm connected and ready. Once you integrate the backend, I'll provide real-time legal citations here.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, aiMsg]);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-full relative">
            {/* Chat History Container */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth" id="chat-container" ref={chatContainerRef}>
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-60">
                        <span className="material-icons-round text-6xl mb-4">smart_toy</span>
                        <p className="text-lg font-medium">Ready to assist with GST & Income Tax queries</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-4 max-w-4xl mx-auto w-full ${msg.type === 'user' ? 'flex-row-reverse group' : ''}`}>
                            <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center overflow-hidden ${msg.type === 'user' ? 'bg-slate-200 dark:bg-slate-700' : 'bg-primary shadow-lg shadow-primary/20'}`}>
                                <span className="material-icons-round text-white">{msg.type === 'user' ? 'person' : 'smart_toy'}</span>
                            </div>
                            <div className={`flex flex-col ${msg.type === 'user' ? 'items-end max-w-[85%] md:max-w-[75%]' : 'items-start max-w-[90%] md:max-w-[85%]'}`}>
                                <div className={`px-5 py-3.5 rounded-2xl shadow-sm ${msg.type === 'user' ? 'bg-primary text-white rounded-tr-sm' : 'bg-surface-light dark:bg-surface-dark bg-white dark:bg-slate-800 border border-border-light dark:border-gray-700 rounded-tl-sm'}`}>
                                    <p className={`text-sm md:text-base leading-relaxed ${msg.type === 'ai' ? 'text-slate-700 dark:text-slate-300' : ''}`}>{msg.text}</p>
                                </div>
                                <span className="text-xs text-slate-400 mt-1 mr-1">{msg.timestamp}</span>
                            </div>
                        </div>
                    ))
                )}
                {/* Spacer for bottom input area */}
                <div className="h-24"></div>
            </div>

            {/* Input Area Footer */}
            <div className="absolute bottom-0 left-0 right-0 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-t border-border-light dark:border-gray-700 p-4 md:px-8 md:py-6 z-10">
                <div className="max-w-4xl mx-auto relative">
                    {/* Input Container */}
                    <div className="relative bg-surface-light dark:bg-slate-800 border border-border-light dark:border-gray-700 rounded-xl shadow-lg shadow-slate-200/50 dark:shadow-none focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all duration-200 flex flex-col">
                        {/* Text Area */}
                        <textarea
                            className="w-full bg-transparent border-0 text-slate-800 dark:text-white placeholder-slate-400 focus:ring-0 resize-none py-3.5 px-4 pr-32 min-h-[56px] max-h-32 focus:outline-none"
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
                                <button className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-primary/5 px-2 py-1.5 rounded-lg transition-colors group">
                                    <span className="material-icons-round text-lg group-hover:text-primary">upload_file</span>
                                    <span>Upload PDF</span>
                                </button>
                                <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1"></div>
                                <button className="p-1.5 text-slate-400 hover:text-primary rounded-lg transition-colors" title="Scan Image">
                                    <span className="material-icons-round text-lg">crop_free</span>
                                </button>
                            </div>
                            {/* Send Button */}
                            <button onClick={handleSend} className="bg-primary hover:bg-primary-dark text-white rounded-lg p-2 flex items-center justify-center transition-colors shadow-sm shadow-primary/30">
                                <span className="material-icons-round text-lg">send</span>
                            </button>
                        </div>
                    </div>
                    {/* Disclaimer Footer */}
                    <div className="text-center mt-3">
                        <p className="text-[10px] md:text-xs text-slate-400 dark:text-slate-500">
                            Vedan-AI responses are for informational purposes only. Please verify with <a className="underline hover:text-primary" href="#">official documents</a> before filing.
                        </p>
                    </div>
                </div>
            </div>

            {/* Background Decoration */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#1152d4 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        </div>
    );
};

export default Chat;
