import { Outlet, Link } from 'react-router-dom';
import { useState } from 'react';
import Logo from '../components/Logo';

const PublicLayout = () => {
    // Mock authentication state for demonstration
    const [isLoggedIn] = useState(false);

    return (
        <div className="bg-white font-display text-gray-700 min-h-screen flex flex-col">
            {/* Premium Navigation */}
            <nav className="sticky top-0 z-50 w-full bg-white/75 backdrop-blur-lg border-b border-gray-200/50 shadow-sm/30 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center min-h-[80px] py-2">
                        {/* Logo & Brand (Left) */}
                        <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
                            <Logo className="w-11 h-11 drop-shadow-md group-hover:scale-105 transition-transform" />
                            <span className="font-extrabold text-2xl tracking-tight text-slate-900 drop-shadow-sm">
                                Vedan<span className="text-primary">-AI</span>
                            </span>
                        </Link>

                        {/* Centered Navigation Links (Desktop) */}
                        <div className="hidden md:flex items-center gap-10 font-medium text-[15px] text-gray-600">
                            <a href="#how-it-works" className="hover:text-primary transition-colors">How it works</a>
                            <a href="#for-cas" className="hover:text-primary transition-colors">For CAs</a>
                        </div>

                        {/* CTA Button (Right) */}
                        <div className="flex items-center gap-4">
                            <Link
                                to="/chat"
                                className="bg-primary hover:bg-blue-700 text-white font-semibold text-[15px] py-2.5 px-6 rounded-lg transition-all hover:shadow-md hover:-translate-y-0.5"
                            >
                                {isLoggedIn ? 'Go to Chat \u2192' : 'Sign Up Free \u2192'}
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="w-full border-t border-gray-100">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                        <div className="mb-4 md:mb-0">
                            © 2025 Vedan-AI. All rights reserved.
                        </div>
                        <div className="flex space-x-6">
                            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
