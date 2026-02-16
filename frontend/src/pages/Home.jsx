import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="w-full flex flex-col items-center">
            {/* Hero Section */}
            <div className="text-center max-w-3xl w-full mb-12">
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                    Your AI Legal Assistant
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                    Search official government citations for GST.
                    <span className="block text-sm mt-2 text-primary font-medium bg-primary/5 dark:bg-primary/10 py-1 px-3 rounded-full inline-block">
                        <span className="material-icons-outlined text-sm align-middle mr-1">verified</span> Powered by Official PDF Citations
                    </span>
                </p>
                <div className="relative w-full max-w-2xl mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="material-icons-outlined text-primary text-2xl">search</span>
                    </div>
                    <input
                        className="block w-full pl-12 pr-32 py-4 border-2 border-gray-100 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-primary transition-colors text-lg"
                        placeholder="Ask a question about GST laws..."
                        type="text"
                    />
                    <div className="absolute inset-y-0 right-2 flex items-center">
                        <Link to="/chat" className="bg-primary hover:bg-blue-700 text-white font-medium py-2 px-6 rounded shadow-md transition-colors flex items-center gap-2">
                            <span>Ask Vedan</span>
                            <span className="material-icons-outlined text-sm">arrow_forward</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-16">
                {/* Active Card: GST */}
                <Link to="/chat" className="group relative bg-white dark:bg-gray-800 p-6 rounded-xl border-2 border-primary shadow-lg hover:shadow-xl transition-all duration-300 ring-4 ring-primary/5">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-icons-outlined text-8xl text-primary">receipt_long</span>
                    </div>
                    <div className="flex flex-col h-full relative z-10">
                        <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mb-4 text-white">
                            <span className="material-icons-outlined text-2xl">percent</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">GST</h3>
                            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Active</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex-grow">
                            Browse Acts, Rules, and latest Notifications regarding Goods and Services Tax.
                        </p>
                        <div className="flex items-center text-primary text-sm font-bold">
                            Explore Citations <span className="material-icons-outlined text-sm ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </div>
                    </div>
                </Link>

                {/* Inactive Card: Income Tax */}
                <div className="group relative bg-white/60 dark:bg-gray-800/60 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm opacity-60 cursor-not-allowed overflow-hidden">
                    <div className="absolute top-4 right-4 z-20">
                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">Coming Soon</span>
                    </div>
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <span className="material-icons-outlined text-8xl text-gray-400">account_balance</span>
                    </div>
                    <div className="flex flex-col h-full relative z-10">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4 text-gray-400">
                            <span className="material-icons-outlined text-2xl">account_balance_wallet</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-400 dark:text-gray-500 mb-2">Income Tax</h3>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mb-4 flex-grow">
                            Search Sections, Deductions, and Case Laws relevant to direct taxation.
                        </p>
                        <div className="flex items-center text-gray-400 text-sm font-medium">
                            Explore Citations <span className="material-icons-outlined text-sm ml-1">lock</span>
                        </div>
                    </div>
                </div>

                {/* Inactive Card: Govt Schemes */}
                <div className="group relative bg-white/60 dark:bg-gray-800/60 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm opacity-60 cursor-not-allowed overflow-hidden">
                    <div className="absolute top-4 right-4 z-20">
                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">Coming Soon</span>
                    </div>
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <span className="material-icons-outlined text-8xl text-gray-400">handshake</span>
                    </div>
                    <div className="flex flex-col h-full relative z-10">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4 text-gray-400">
                            <span className="material-icons-outlined text-2xl">policy</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-400 dark:text-gray-500 mb-2">Govt Schemes</h3>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mb-4 flex-grow">
                            Find eligibility criteria and benefits for central and state government schemes.
                        </p>
                        <div className="flex items-center text-gray-400 text-sm font-medium">
                            Explore Citations <span className="material-icons-outlined text-sm ml-1">lock</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Suggestions */}
            <div className="w-full max-w-4xl text-center">
                <h4 className="text-sm uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 mb-4">Quick Start GST Queries</h4>
                <div className="flex flex-wrap justify-center gap-3">
                    <button className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary px-4 py-2 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors flex items-center shadow-sm">
                        <span className="material-icons-outlined text-base mr-2 text-primary/70">search</span>
                        What are the latest GST rates for electronics?
                    </button>
                    <button className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary px-4 py-2 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors flex items-center shadow-sm">
                        <span className="material-icons-outlined text-base mr-2 text-primary/70">search</span>
                        How to file GSTR-1?
                    </button>
                    <button className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary px-4 py-2 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors flex items-center shadow-sm">
                        <span className="material-icons-outlined text-base mr-2 text-primary/70">search</span>
                        Latest notification on GST on services
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
