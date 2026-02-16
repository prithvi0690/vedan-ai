import { Outlet, Link } from 'react-router-dom';
import { useState } from 'react';

const AppLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="font-display bg-gray-50 text-slate-800 h-screen overflow-hidden flex transition-colors duration-200">
            {/* Sidebar Navigation (Desktop) */}
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-full flex-shrink-0 z-20 hidden md:flex">
                {/* App Header */}
                <div className="p-5 flex items-center gap-3 border-b border-gray-100">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="font-bold text-lg leading-tight tracking-tight text-slate-900">Vedan-AI</h1>
                            <p className="text-xs text-primary font-medium">Verified Legal Intelligence</p>
                        </div>
                    </Link>
                </div>

                {/* New Chat Button */}
                <div className="px-4 py-4">
                    <Link to="/chat" className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors shadow-sm shadow-primary/20">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                        </svg>
                        New Analysis
                    </Link>
                </div>

                {/* Navigation */}
                <div className="px-4 pb-2">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 pl-1">Navigation</h3>
                    <div className="flex flex-col gap-1">
                        <Link to="/chat" className="px-3 py-2 rounded-lg text-sm font-medium bg-primary/5 text-primary transition-colors flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                            </svg>
                            Chat
                        </Link>
                        <Link to="/" className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 text-slate-500 transition-colors flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                            </svg>
                            Home
                        </Link>
                    </div>
                </div>

                {/* User Profile at bottom */}
                <div className="mt-auto p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 w-full p-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-primary">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-slate-900">User</p>
                            <p className="text-xs text-slate-400">Free Plan</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full relative">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-100">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                            </svg>
                        </div>
                        <h1 className="font-bold text-lg text-slate-900">Vedan-AI</h1>
                    </Link>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 text-slate-500 hover:bg-gray-50 rounded-lg"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu (Overlay) */}
                {isMobileMenuOpen && (
                    <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 z-50 p-4 shadow-xl md:hidden">
                        <nav className="flex flex-col gap-2">
                            <Link to="/chat" onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-primary/10 text-primary rounded-lg font-medium">New Analysis</Link>
                            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="p-3 hover:bg-gray-100 rounded-lg">Home</Link>
                        </nav>
                    </div>
                )}

                <div className="flex-1 overflow-hidden relative">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AppLayout;
