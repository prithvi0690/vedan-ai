import { Outlet, Link } from 'react-router-dom';
import Logo from '../components/Logo';

const PublicLayout = () => {
    return (
        <div className="bg-white font-display text-gray-700 min-h-screen flex flex-col">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        {/* Logo */}
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                            <Logo className="w-9 h-9 drop-shadow-sm" />
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
