import { Outlet, Link } from 'react-router-dom';
import { useState } from 'react';

const AppLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="font-display bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 h-screen overflow-hidden flex transition-colors duration-200">
            {/* Sidebar Navigation (Desktop) */}
            <aside className="w-72 bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark flex flex-col h-full flex-shrink-0 z-20 hidden md:flex">
                {/* App Header */}
                <div className="p-5 flex items-center gap-3 border-b border-border-light dark:border-border-dark">
                    <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white">
                        <span className="material-icons-round text-xl">gavel</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight tracking-tight text-slate-900 dark:text-white">Vedan-AI</h1>
                        <p className="text-xs text-primary font-medium">Verified Legal Intelligence</p>
                    </div>
                </div>

                {/* New Chat Button */}
                <div className="px-4 py-4">
                    <Link to="/chat" className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white py-2.5 px-4 rounded-lg font-medium transition-colors shadow-sm shadow-primary/20">
                        <span className="material-icons-round text-sm">add</span>
                        New Analysis
                    </Link>
                </div>

                {/* Navigation Links (Simulated Category Filters for now, could be routes) */}
                <div className="px-4 pb-2">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 pl-1">Knowledge Base</h3>
                    <div className="flex flex-col gap-1">
                        <Link to="/dashboard" className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-background-light dark:hover:bg-background-dark text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-2">
                            <span className="material-icons-round text-lg text-slate-400">dashboard</span>
                            Dashboard
                        </Link>
                        <Link to="/library" className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-background-light dark:hover:bg-background-dark text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-2">
                            <span className="material-icons-round text-lg text-slate-400">library_books</span>
                            Citation Library
                        </Link>
                        <Link to="/plans" className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-background-light dark:hover:bg-background-dark text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-2">
                            <span className="material-icons-round text-lg text-slate-400">payments</span>
                            Plans
                        </Link>
                    </div>
                </div>

                {/* User Profile */}
                <div className="mt-auto p-4 border-t border-border-light dark:border-border-dark">
                    <button className="flex items-center gap-3 w-full hover:bg-background-light dark:hover:bg-background-dark/50 p-2 rounded-lg transition-colors">
                        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                            <span className="material-icons-round text-slate-500">person</span>
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-slate-900 dark:text-white">User</p>
                            <p className="text-xs text-slate-500">Free Plan</p>
                        </div>
                        <span className="material-icons-round text-slate-400 text-sm">settings</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full relative">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between p-4 bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white">
                            <span className="material-icons-round text-xl">gavel</span>
                        </div>
                        <h1 className="font-bold text-lg text-slate-900 dark:text-white">Vedan-AI</h1>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 text-slate-500 hover:bg-background-light rounded-lg"
                    >
                        <span className="material-icons-round">menu</span>
                    </button>
                </div>

                {/* Mobile Menu (Overlay) */}
                {isMobileMenuOpen && (
                    <div className="absolute top-16 left-0 right-0 bg-white dark:bg-background-dark border-b border-gray-200 z-50 p-4 shadow-xl md:hidden">
                        <nav className="flex flex-col gap-2">
                            <Link to="/chat" className="p-3 bg-primary/10 text-primary rounded-lg font-medium">New Analysis</Link>
                            <Link to="/dashboard" className="p-3 hover:bg-gray-100 rounded-lg">Dashboard</Link>
                            <Link to="/library" className="p-3 hover:bg-gray-100 rounded-lg">Library</Link>
                            <Link to="/plans" className="p-3 hover:bg-gray-100 rounded-lg">Plans</Link>
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
