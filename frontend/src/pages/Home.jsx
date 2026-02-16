import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate('/chat', { state: { query: query.trim() } });
        }
    };

    const handleSuggestionClick = (suggestion) => {
        navigate('/chat', { state: { query: suggestion } });
    };

    return (
        <div className="w-full flex flex-col items-center">
            {/* Hero Section */}
            <div className="text-center max-w-3xl w-full mb-12">
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                    Your AI Legal Assistant
                </h1>
                <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
                    Search official government citations for GST.
                </p>
                <div className="inline-flex items-center gap-1.5 text-sm text-primary font-medium bg-primary/5 py-1.5 px-4 rounded-full mb-8">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                    </svg>
                    Powered by Official PDF Citations
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="relative w-full max-w-2xl mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-primary">
                            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                        </svg>
                    </div>
                    <input
                        className="block w-full pl-12 pr-32 py-4 border-2 border-gray-100 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-primary transition-colors text-lg"
                        placeholder="Ask a question about GST laws..."
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-2 flex items-center">
                        <button
                            type="submit"
                            className="bg-primary hover:bg-blue-700 text-white font-medium py-2 px-6 rounded shadow-md transition-colors flex items-center gap-2"
                        >
                            <span>Ask Vedan</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-16">
                {/* Active Card: GST */}
                <Link to="/chat" className="group relative bg-white p-6 rounded-xl border-2 border-primary shadow-lg hover:shadow-xl transition-all duration-300 ring-4 ring-primary/5">
                    <div className="flex flex-col h-full relative z-10">
                        <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mb-4 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 10h-2v2c0 .55-.45 1-1 1s-1-.45-1-1v-2H9c-.55 0-1-.45-1-1s.45-1 1-1h2V9c0-.55.45-1 1-1s1 .45 1 1v2h2c.55 0 1 .45 1 1s-.45 1-1 1z" />
                            </svg>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors">GST</h3>
                            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Active</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-4 flex-grow">
                            Browse Acts, Rules, and latest Notifications regarding Goods and Services Tax.
                        </p>
                        <div className="flex items-center text-primary text-sm font-bold">
                            Explore Citations
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform">
                                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                            </svg>
                        </div>
                    </div>
                </Link>

                {/* Inactive Card: Income Tax */}
                <div className="group relative bg-white/60 p-6 rounded-xl border border-gray-200 shadow-sm opacity-60 cursor-not-allowed overflow-hidden">
                    <div className="absolute top-4 right-4 z-20">
                        <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">Coming Soon</span>
                    </div>
                    <div className="flex flex-col h-full relative z-10">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path d="M21 18v1c0 1.1-.9 2-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14c1.1 0 2 .9 2 2v1h-9a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-400 mb-2">Income Tax</h3>
                        <p className="text-sm text-gray-400 mb-4 flex-grow">
                            Search Sections, Deductions, and Case Laws relevant to direct taxation.
                        </p>
                        <div className="flex items-center text-gray-400 text-sm font-medium">
                            Explore Citations
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-1">
                                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Inactive Card: Govt Schemes */}
                <div className="group relative bg-white/60 p-6 rounded-xl border border-gray-200 shadow-sm opacity-60 cursor-not-allowed overflow-hidden">
                    <div className="absolute top-4 right-4 z-20">
                        <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">Coming Soon</span>
                    </div>
                    <div className="flex flex-col h-full relative z-10">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-400 mb-2">Govt Schemes</h3>
                        <p className="text-sm text-gray-400 mb-4 flex-grow">
                            Find eligibility criteria and benefits for central and state government schemes.
                        </p>
                        <div className="flex items-center text-gray-400 text-sm font-medium">
                            Explore Citations
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-1">
                                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Suggestions */}
            <div className="w-full max-w-4xl text-center">
                <h4 className="text-sm uppercase tracking-wider font-semibold text-gray-400 mb-4">Quick Start GST Queries</h4>
                <div className="flex flex-wrap justify-center gap-3">
                    <button
                        onClick={() => handleSuggestionClick('What are the latest GST rates for electronics?')}
                        className="bg-white border border-gray-200 hover:border-primary hover:text-primary px-4 py-2 rounded-full text-sm font-medium text-gray-600 transition-colors flex items-center shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2 text-primary/70">
                            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                        </svg>
                        What are the latest GST rates for electronics?
                    </button>
                    <button
                        onClick={() => handleSuggestionClick('How to file GSTR-1?')}
                        className="bg-white border border-gray-200 hover:border-primary hover:text-primary px-4 py-2 rounded-full text-sm font-medium text-gray-600 transition-colors flex items-center shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2 text-primary/70">
                            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                        </svg>
                        How to file GSTR-1?
                    </button>
                    <button
                        onClick={() => handleSuggestionClick('Latest notification on GST on services')}
                        className="bg-white border border-gray-200 hover:border-primary hover:text-primary px-4 py-2 rounded-full text-sm font-medium text-gray-600 transition-colors flex items-center shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2 text-primary/70">
                            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                        </svg>
                        Latest notification on GST on services
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
