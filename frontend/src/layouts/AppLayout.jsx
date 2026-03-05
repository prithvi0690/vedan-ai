import { Outlet, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Logo from '../components/Logo';

const AppLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [viewportHeight, setViewportHeight] = useState('100vh');

    // Fix mobile keyboard viewport height
    useEffect(() => {
        const updateHeight = () => {
            if (window.visualViewport) {
                setViewportHeight(`${window.visualViewport.height}px`);
            } else {
                setViewportHeight(`${window.innerHeight}px`);
            }
        };

        updateHeight();
        window.visualViewport?.addEventListener('resize', updateHeight);
        window.addEventListener('resize', updateHeight);

        return () => {
            window.visualViewport?.removeEventListener('resize', updateHeight);
            window.removeEventListener('resize', updateHeight);
        };
    }, []);

    // Also lock document body scroll entirely to prevent dual scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        return () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.height = '';
        };
    }, []);

    return (
        <div
            className="font-display bg-gray-50 text-slate-800 overflow-hidden flex transition-colors duration-200"
            style={{ height: viewportHeight }}
        >
            {/* Sidebar Navigation (Desktop) */}
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-full flex-shrink-0 z-20 hidden md:flex">
                {/* App Header */}
                <div className="p-6 flex items-center gap-3 border-b border-gray-100 min-h-[80px]">
                    <Link to="/" className="flex items-center gap-3 group">
                        <Logo className="w-11 h-11 drop-shadow-md group-hover:scale-105 transition-transform" />
                        <div>
                            <h1 className="font-extrabold text-xl leading-tight tracking-tight text-slate-900">Vedan-AI</h1>
                            <p className="text-[10px] text-primary font-bold uppercase tracking-wider">Verified Legal Intelligence</p>
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
                        <Link to="/" className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 text-slate-500 transition-colors flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
                            </svg>
                            How it works
                        </Link>
                        <Link to="/" className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 text-slate-500 transition-colors flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                            For CAs
                        </Link>
                    </div>
                </div>

                {/* Recent Queries */}
                <div className="px-4 pt-4 pb-2 flex-1 overflow-y-auto">
                    <h3 className="text-[11px] font-semibold text-slate-400 tracking-wider mb-2 pl-1 uppercase">Recent Queries</h3>
                    <div className="flex flex-col gap-1">
                        {['What are the latest GST rates for electronics?', 'How to file GSTR-1?', 'Latest notification on GST on services'].map((query, idx) => (
                            <Link key={idx} to="/chat" state={{ query }} className="px-3 py-2 text-xs text-slate-500 hover:bg-gray-50 hover:text-slate-900 rounded-lg truncate transition-colors" title={query}>
                                {query}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* User Profile at bottom */}
                <div className="mt-auto p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 w-full p-2">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-sm">
                            <span className="text-xs font-bold text-white uppercase">U</span>
                        </div>
                        <div className="flex-1 text-left min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">User</p>
                            <div className="flex items-center gap-2">
                                <p className="text-xs text-slate-400 truncate">Free Plan</p>
                                <button className="text-[10px] font-bold text-primary hover:underline whitespace-nowrap">
                                    Upgrade &rarr;
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full relative">
                {/* Mobile Header (Sticky Premium Navbar) */}
                <div className="md:hidden sticky top-0 z-50 flex items-center justify-between px-4 py-2 min-h-[72px] bg-white/75 backdrop-blur-lg border-b border-gray-200/50 shadow-sm/30 transition-all duration-300">
                    <Link to="/" className="flex items-center gap-3">
                        <Logo className="w-10 h-10 drop-shadow-sm" />
                        <h1 className="font-extrabold text-2xl tracking-tight text-slate-900">Vedan<span className="text-primary">-AI</span></h1>
                    </Link>
                    <div className="flex items-center gap-3 relative">
                        <div className="hidden sm:flex items-center gap-4 text-sm font-medium text-slate-500 mr-2">
                            <Link to="/" className="hover:text-primary transition-colors">How it works</Link>
                            <Link to="/" className="hover:text-primary transition-colors">For CAs</Link>
                        </div>
                        {/* Avatar Dropdown Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="h-10 w-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-md hover:ring-2 hover:ring-primary/50 transition-all"
                        >
                            <span className="text-sm font-bold text-white uppercase">U</span>
                        </button>
                    </div>
                </div>

                {/* Mobile Dropdown (Avatar Menu) */}
                {isMobileMenuOpen && (
                    <div className="absolute top-[80px] right-4 bg-white border border-gray-200 z-50 p-2 shadow-xl rounded-xl md:hidden w-56 flex flex-col gap-1 origin-top-right">
                        {/* User info snippet */}
                        <div className="p-3 mb-2 flex flex-col items-center border-b border-gray-100">
                            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center shadow-sm mb-2">
                                <span className="text-lg font-bold text-white uppercase">U</span>
                            </div>
                            <p className="text-sm font-bold text-slate-900">User</p>
                            <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mt-1">Free Plan</p>
                        </div>
                        <nav className="flex flex-col gap-1">
                            <Link to="/chat" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2.5 bg-primary/10 text-primary rounded-lg font-medium text-sm flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
                                New Chat
                            </Link>
                            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2.5 hover:bg-gray-50 text-slate-700 rounded-lg font-medium text-sm transition-colors flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
                                Home
                            </Link>
                        </nav>
                        <div className="mt-1 pt-2 border-t border-gray-100">
                            <button onClick={() => setIsMobileMenuOpen(false)} className="w-full text-left px-3 py-2.5 hover:bg-gray-50 text-red-600 rounded-lg font-medium text-sm transition-colors">
                                Sign Out
                            </button>
                        </div>
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
