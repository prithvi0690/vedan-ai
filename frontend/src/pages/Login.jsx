import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaLinkedin } from 'react-icons/fa';

const Login = () => {
    return (
        <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased h-screen overflow-hidden flex">
            {/* Left Section: Branding & Trust */}
            <section className="hidden lg:flex lg:w-1/2 relative bg-corporate-navy overflow-hidden items-center justify-center p-12">
                {/* Decorative Background Element */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                </div>
                <div className="relative z-10 max-w-lg">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                            <span className="material-icons text-white text-3xl">gavel</span>
                        </div>
                        <span className="text-3xl font-bold text-white tracking-tight">Vedan<span className="text-primary">-AI</span></span>
                    </div>
                    {/* Content */}
                    <div className="space-y-8">
                        <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                            Verified Accuracy for Legal &amp; Tax Professionals.
                        </h1>
                        <div className="relative">
                            <span className="material-icons text-primary text-5xl absolute -top-6 -left-8 opacity-40">format_quote</span>
                            <p className="text-xl text-slate-300 italic pl-4 border-l-2 border-primary/30">
                                "Precision in every citation. Navigating GST and Income Tax with the authority of official PDF sources."
                            </p>
                        </div>
                        <div className="flex flex-col gap-6 mt-12">
                            <div className="flex items-center gap-4 text-white/80">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                    <span className="material-icons text-primary text-sm">verified_user</span>
                                </div>
                                <p className="text-sm font-medium">100% Citation-backed responses</p>
                            </div>
                            <div className="flex items-center gap-4 text-white/80">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                    <span className="material-icons text-primary text-sm">description</span>
                                </div>
                                <p className="text-sm font-medium">Real-time GST &amp; Income Tax updates</p>
                            </div>
                        </div>
                    </div>
                    {/* Footer Image/Graphic Overlay */}
                    <div className="mt-20">
                        <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl h-48 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center group">
                            {/* Abstract Abstract Representation of a Library */}
                            <div className="absolute inset-0 opacity-30 flex gap-1 transform -rotate-12 scale-110">
                                <div className="w-4 h-full bg-white/5"></div>
                                <div className="w-6 h-full bg-white/10"></div>
                                <div className="w-2 h-full bg-white/5"></div>
                                <div className="w-8 h-full bg-white/10"></div>
                                <div className="w-4 h-full bg-white/5"></div>
                                <div className="w-12 h-full bg-white/10"></div>
                                <div className="w-6 h-full bg-white/5"></div>
                                <div className="w-8 h-full bg-white/10"></div>
                                <div className="w-4 h-full bg-white/5"></div>
                                <div className="w-20 h-full bg-white/10"></div>
                            </div>
                            <div className="relative z-10 text-center">
                                <span className="material-icons text-5xl text-white/20 mb-2 group-hover:text-primary/50 transition-colors">library_books</span>
                                <p className="text-sm font-medium text-white/40 uppercase tracking-widest">Digital Archive</p>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-corporate-navy via-transparent to-transparent"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Right Section: Login Form */}
            <section className="w-full lg:w-1/2 bg-white dark:bg-background-dark flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32">
                <div className="max-w-md w-full mx-auto">
                    {/* Mobile Logo (visible only on small screens) */}
                    <div className="flex lg:hidden items-center gap-2 mb-10">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                            <span className="material-icons text-white text-2xl">gavel</span>
                        </div>
                        <span className="text-2xl font-bold tracking-tight dark:text-white">Vedan-AI</span>
                    </div>
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h2>
                        <p className="text-slate-500 dark:text-slate-400">Step 1: Enter your credentials to access your legal assistant.</p>
                    </div>

                    {/* Social Logins */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <button className="flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200">
                            <FcGoogle className="text-xl" />
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Google</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200">
                            <FaLinkedin className="text-xl text-[#0077b5]" />
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">LinkedIn</span>
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative flex items-center mb-8">
                        <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                        <span className="flex-shrink mx-4 text-xs font-medium text-slate-400 uppercase tracking-widest">Or continue with email</span>
                        <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                    </div>

                    {/* Login Form */}
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" htmlFor="email">Email Address</label>
                            <div className="relative">
                                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">alternate_email</span>
                                <input
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-900 dark:text-white"
                                    id="email" name="email" placeholder="name@company.com" required type="email"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="password">Password</label>
                                <a className="text-xs font-bold text-primary hover:underline" href="#">Forgot Password?</a>
                            </div>
                            <div className="relative">
                                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock_outline</span>
                                <input
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-900 dark:text-white"
                                    id="password" name="password" placeholder="••••••••" required type="password"
                                />
                                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" type="button">
                                    <span className="material-icons text-xl">visibility_off</span>
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <input
                                className="w-4 h-4 rounded text-primary focus:ring-primary bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                                id="remember" type="checkbox"
                            />
                            <label className="ml-2 text-sm text-slate-600 dark:text-slate-400" htmlFor="remember">Keep me logged in</label>
                        </div>
                        {/* Link to Chat for demo purposes */}
                        <Link to="/chat" className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]">
                            <span>Next Step</span>
                            <span className="material-icons text-sm">arrow_forward</span>
                        </Link>
                    </form>

                    {/* Footer */}
                    <p className="mt-10 text-center text-slate-500 dark:text-slate-400 text-sm">
                        New to Vedan-AI?
                        <a className="text-primary font-bold hover:underline ml-1" href="#">Create an account</a>
                    </p>

                    {/* Secure Badge */}
                    <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2">
                        <span className="material-icons text-green-500 text-lg">verified</span>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Secure Cloud Environment</span>
                    </div>
                </div>

                {/* Tiny Footer Links */}
                <div className="mt-auto py-8 text-center text-xs text-slate-400 space-x-4">
                    <a className="hover:text-slate-600 dark:hover:text-slate-300" href="#">Privacy Policy</a>
                    <span>•</span>
                    <a className="hover:text-slate-600 dark:hover:text-slate-300" href="#">Terms of Service</a>
                    <span>•</span>
                    <a className="hover:text-slate-600 dark:hover:text-slate-300" href="#">Help Center</a>
                </div>
            </section>
        </div>
    );
};

export default Login;
