import { Outlet, Link } from 'react-router-dom';

const PublicLayout = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-gray-700 dark:text-gray-300 min-h-screen flex flex-col geometric-bg">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        {/* Logo */}
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white">
                                <span className="material-icons-outlined text-lg">gavel</span>
                            </div>
                            <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
                                Vedan<span className="text-primary">-AI</span>
                            </span>
                        </Link>

                        {/* Desktop Nav Links */}
                        <div className="hidden md:flex items-center space-x-6">
                            <Link to="/notifications" className="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors flex items-center gap-1">
                                <span className="material-icons-outlined text-lg">notifications</span>
                                Notifications
                            </Link>
                            <Link to="/library" className="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors flex items-center gap-1">
                                <span className="material-icons-outlined text-lg">library_books</span>
                                Library
                            </Link>
                            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>
                            <Link to="/login" className="flex items-center gap-2 group">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <span className="material-icons-outlined text-sm">person</span>
                                </div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                    Login
                                </span>
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
            <footer className="w-full bg-white/50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                        <div className="mb-4 md:mb-0">
                            © 2024 Vedan-AI. All rights reserved.
                        </div>
                        <div className="flex space-x-6">
                            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-primary transition-colors">Official Sources</a>
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-center text-gray-400 dark:text-gray-600">
                        Disclaimer: Vedan-AI provides information based on official citations but does not substitute professional legal or financial advice.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
