import { Link } from 'react-router-dom';

const Plans = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col">
            {/* Top Navigation / Header */}
            <nav className="w-full py-6 px-8 flex justify-between items-center bg-white dark:bg-slate-900 border-b border-primary/10">
                <Link to="/" className="flex items-center gap-2">
                    <div className="bg-primary p-1.5 rounded-lg">
                        <span className="material-icons-outlined text-white">gavel</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-primary">Vedan-AI</span>
                </Link>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">1</span>
                        <span className="text-sm font-medium text-slate-400">Account</span>
                    </div>
                    <div className="h-px w-8 bg-slate-200 dark:bg-slate-700"></div>
                    <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">2</span>
                        <span className="text-sm font-semibold">Plan</span>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center w-full flex-grow">
                {/* Headline Section */}
                <div className="text-center mb-16 max-w-2xl">
                    <h1 className="text-4xl font-extrabold mb-4 text-slate-900 dark:text-white">Choose the right plan for your professional needs</h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400">Access verified GST, Income Tax, and Government Scheme data with official citations directly from government PDFs.</p>
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                    {/* Free Tier Card */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 flex flex-col hover:shadow-xl transition-shadow duration-300">
                        <div className="mb-8">
                            <span className="text-primary font-bold text-sm uppercase tracking-widest">Basic</span>
                            <h3 className="text-2xl font-bold mt-2">Free</h3>
                            <div className="mt-4 flex items-baseline gap-1">
                                <span className="text-4xl font-extrabold">₹0</span>
                                <span className="text-slate-500 text-sm">/ forever</span>
                            </div>
                        </div>
                        <div className="flex-grow">
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <span className="material-icons-outlined text-primary text-sm mt-1">check_circle</span>
                                    <span className="text-slate-600 dark:text-slate-300">5 AI searches per day</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-icons-outlined text-primary text-sm mt-1">check_circle</span>
                                    <span className="text-slate-600 dark:text-slate-300">Standard PDF citations</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-icons-outlined text-primary text-sm mt-1">check_circle</span>
                                    <span className="text-slate-600 dark:text-slate-300">1 Saved research folder</span>
                                </li>
                                <li className="flex items-start gap-3 opacity-40">
                                    <span className="material-icons-outlined text-slate-400 text-sm mt-1">block</span>
                                    <span className="text-slate-600 dark:text-slate-300">PDF source highlighting</span>
                                </li>
                            </ul>
                        </div>
                        <Link to="/chat" className="mt-10 w-full py-3 px-6 rounded-lg border-2 border-primary text-primary font-bold hover:bg-primary/5 transition-colors text-center">
                            Get Started
                        </Link>
                    </div>

                    {/* Pro Tier Card (Most Popular) */}
                    <div className="relative bg-white dark:bg-slate-900 border-2 border-primary rounded-xl p-8 flex flex-col shadow-2xl scale-105 z-10">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest">
                            Most Popular
                        </div>
                        <div className="mb-8">
                            <span className="text-primary font-bold text-sm uppercase tracking-widest">Professional</span>
                            <h3 className="text-2xl font-bold mt-2">Pro</h3>
                            <div className="mt-4 flex items-baseline gap-1">
                                <span className="text-4xl font-extrabold">₹999</span>
                                <span className="text-slate-500 text-sm">/ month</span>
                            </div>
                            <p className="text-xs text-primary/70 mt-2 font-medium">Billed annually at ₹8,990</p>
                        </div>
                        <div className="flex-grow">
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <span className="material-icons-outlined text-primary text-sm mt-1">check_circle</span>
                                    <span className="text-slate-600 dark:text-slate-300 font-medium">Unlimited searches</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-icons-outlined text-primary text-sm mt-1">check_circle</span>
                                    <span className="text-slate-600 dark:text-slate-300">Direct PDF source highlighting</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-icons-outlined text-primary text-sm mt-1">check_circle</span>
                                    <span className="text-slate-600 dark:text-slate-300 font-medium">10 Saved research folders</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-icons-outlined text-primary text-sm mt-1">check_circle</span>
                                    <span className="text-slate-600 dark:text-slate-300">Case law integration</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-icons-outlined text-primary text-sm mt-1">check_circle</span>
                                    <span className="text-slate-600 dark:text-slate-300">Priority AI processing</span>
                                </li>
                            </ul>
                        </div>
                        <Link to="/chat" className="mt-10 w-full py-3 px-6 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 text-center">
                            Select Pro Plan
                        </Link>
                    </div>

                    {/* Enterprise Tier Card */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 flex flex-col hover:shadow-xl transition-shadow duration-300">
                        <div className="mb-8">
                            <span className="text-primary font-bold text-sm uppercase tracking-widest">Organization</span>
                            <h3 className="text-2xl font-bold mt-2">Enterprise</h3>
                            <div className="mt-4 flex items-baseline gap-1">
                                <span className="text-3xl font-extrabold">Custom</span>
                            </div>
                            <p className="text-sm text-slate-500 mt-2">For law firms and tax agencies</p>
                        </div>
                        <div className="flex-grow">
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <span className="material-icons-outlined text-primary text-sm mt-1">check_circle</span>
                                    <span className="text-slate-600 dark:text-slate-300">Multi-user team dashboard</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-icons-outlined text-primary text-sm mt-1">check_circle</span>
                                    <span className="text-slate-600 dark:text-slate-300 font-medium">API access for integrations</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-icons-outlined text-primary text-sm mt-1">check_circle</span>
                                    <span className="text-slate-600 dark:text-slate-300">Dedicated Account Manager</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-icons-outlined text-primary text-sm mt-1">check_circle</span>
                                    <span className="text-slate-600 dark:text-slate-300">Custom PDF database training</span>
                                </li>
                            </ul>
                        </div>
                        <button className="mt-10 w-full py-3 px-6 rounded-lg border-2 border-slate-800 dark:border-slate-100 text-slate-800 dark:text-slate-100 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            Contact Sales
                        </button>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-12 text-center">
                    <Link to="/chat" className="text-slate-500 hover:text-primary transition-colors text-sm font-medium">Skip for now, I'll use the free version</Link>
                    <div className="mt-12 flex flex-col items-center gap-6">
                        <div className="flex items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all">
                            <img alt="GST Logo" className="h-8 w-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcNz6WyuF3VZjRdcSwty-S02ZPGoEQIevdYplMTbLouEJ6Jf8zaZ9YIznKbDR33PDPly2-oLp0bqumDxL9-SKngSbu6aWisx1DA1F-FTk8GlU7JDGe3nkkLw5sIZ8OgwQmzFpIkPpigWdtfqepQKsBft9qqd4H0rDDwCrZ-pi7HT2XSdvfd4FSIdl3OBIwLkg0f2t5y_26VIl3etJjmgPl7S0rjUjyVqz3b7fDdPg2R6EZPSX3DZjfKi6nAAqpUio9LZdUheuhjND7" />
                            <img alt="Income Tax Logo" className="h-10 w-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUoDVtH2ncTeEw00u2_GefH0YPTBuUk7Af31-BJA9JI9K1KYJQo-zyxm4Z2J7TCZRKm6_qPE0mwYlrQ-k1x4-_fBxh7YjGsoH4q-4O2JDgLLndJvL0BSImBzF7CIKfopPR7rBxXPQK9laZna6Lp7I3YxGHjVlAXmU5swe41h6LRuG8ZdRP0RhZ4EK-Pi-Y_XICrGQOgdZeGsla6dZGIVBCcmdISbI-QafafAh57Hbi0H5MhWxObzxkHXXd8BzspyR7FE2vm18Ur94v" />
                            <img alt="NIC Logo" className="h-8 w-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXoe5n9qG0Obl-sMnT8_JT4QcNoYSwqo8c1JAWtY7mbP_R31BfOrqmgXhBTwgiJmFcQCvEE37mdBHLEpGdiJe5zLGCHl2MZYgNlI_nXJiBVPk2MjGfOeInm1dHuU_BLx51HMaC_3cZSPT9hT8CxqCnawUBepR2IhU6VsKEYXQPtqNZ2Lm5fXgevIDJeXrEnZbRJpfUd6dIuyvSH-x3pfLuGKzt6nTyH4Vr8ZPAaqxia9IllwlfARiqF1JPPT9Py8xWYEF_JCaInFMN" />
                        </div>
                        <div className="flex items-center gap-4 text-slate-400 text-xs uppercase tracking-widest font-bold">
                            <span className="material-icons-outlined text-sm">lock</span>
                            Secure Payment &amp; SSL Encrypted
                        </div>
                    </div>
                </div>
            </main>

            {/* Background Pattern Decoration */}
            <div className="fixed top-0 right-0 -z-10 w-1/3 h-1/2 bg-gradient-to-bl from-primary/5 to-transparent blur-3xl opacity-50 pointer-events-none"></div>
            <div className="fixed bottom-0 left-0 -z-10 w-1/3 h-1/2 bg-gradient-to-tr from-primary/5 to-transparent blur-3xl opacity-50 pointer-events-none"></div>
        </div>
    );
};

export default Plans;
