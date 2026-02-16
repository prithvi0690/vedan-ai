import { Outlet, Link } from 'react-router-dom';

const PublicLayout = () => {
    return (
        <div className="bg-white font-display text-gray-700 min-h-screen flex flex-col">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        {/* Logo */}
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                                </svg>
                            </div>
                            <span className="font-bold text-xl tracking-tight text-gray-900">
                                Vedan<span className="text-primary">-AI</span>
                            </span>
                        </Link>

                        {/* Right Side */}
                        <div className="flex items-center gap-4">
                            <Link
                                to="/chat"
                                className="bg-primary hover:bg-blue-700 text-white font-medium text-sm py-2 px-5 rounded-lg transition-colors"
                            >
                                Try Vedan-AI
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
