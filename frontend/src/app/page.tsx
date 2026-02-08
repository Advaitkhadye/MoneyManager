"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield, Zap, LayoutDashboard, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { motion } from "framer-motion";

export default function LandingPage() {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
        } catch (error) {
            console.error("Logout error:", error);
        }
        setUser(null);
        router.refresh();
    };

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setUser(session?.user ?? null);
            } catch (error) {
                console.warn("Auth check failed:", error);
                setUser(null);
            }
        };
        getUser();
    }, []);

    return (
        <div className="min-h-screen bg-[#1a1b1e] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden w-full relative">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 h-20 bg-[#1a1b1e]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 md:px-6 w-full max-w-[100vw] overflow-hidden">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 relative rounded-lg overflow-hidden">
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                    </div>
                    <span className="font-bold text-xl tracking-tight whitespace-nowrap">FinanceManager</span>
                </Link>
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="hidden md:block bg-white text-black px-5 py-2.5 rounded-full font-medium text-sm hover:bg-gray-100 transition-colors shrink-0"
                            >
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 text-white px-5 py-2.5 rounded-full font-medium text-sm hover:bg-red-700 transition-colors shrink-0 flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Sign Out</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="bg-white text-black px-5 py-2.5 rounded-full font-medium text-sm hover:bg-gray-100 transition-colors shrink-0"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/login"
                                className="hidden md:block bg-white text-black px-5 py-2.5 rounded-full font-medium text-sm hover:bg-gray-100 transition-colors shrink-0"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-6 pt-32 pb-32 w-full overflow-hidden">
                <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
                    <div className="space-y-8 flex flex-col items-center lg:items-start text-center lg:text-left w-full">
                        <ScrollReveal direction="up" delay={0.1}>
                            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] max-w-2xl mx-auto lg:mx-0">
                                Master Your <br />
                                <span className="text-blue-500">Finances</span> with <br />
                                Smart Insights
                            </h1>
                        </ScrollReveal>
                        <ScrollReveal direction="up" delay={0.2} width="100%">
                            <p className="text-gray-400 text-lg lg:text-xl max-w-lg leading-relaxed mx-auto lg:mx-0">
                                Track, Analyze, and Optimize Your Wealth Efficiently. Stop guessing and start growing your net worth today.
                            </p>
                        </ScrollReveal>
                        <ScrollReveal direction="up" delay={0.3}>
                            <div className="flex items-center gap-4 justify-center lg:justify-start">
                                <Link
                                    href={user ? "/dashboard" : "/login"}
                                    className="bg-blue-600 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-blue-700 transition-all flex items-center gap-2 group"
                                >
                                    {user ? "Go to Dashboard" : "Get Started"}
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Hero Image / Chart Representation */}
                    <div className="relative hidden lg:flex justify-center items-center">
                        <div className="absolute -inset-4 bg-blue-500/20 blur-3xl rounded-full opacity-50"></div>
                        <div className="relative p-8 bg-gray-800/50 rounded-2xl border border-gray-700 backdrop-blur-sm shadow-2xl">
                            {/* Chart Container */}
                            <div className="w-[340px] h-[300px] relative flex items-end justify-between px-4 pb-4">

                                {/* Bars */}
                                <motion.div initial={{ height: 0 }} whileInView={{ height: "30%" }} transition={{ duration: 1, delay: 0.1 }} viewport={{ once: true }} className="w-8 bg-gradient-to-t from-blue-700 to-blue-500 rounded-t-md"></motion.div>
                                <motion.div initial={{ height: 0 }} whileInView={{ height: "45%" }} transition={{ duration: 1, delay: 0.2 }} viewport={{ once: true }} className="w-8 bg-gradient-to-t from-blue-700 to-blue-500 rounded-t-md"></motion.div>
                                <motion.div initial={{ height: 0 }} whileInView={{ height: "40%" }} transition={{ duration: 1, delay: 0.3 }} viewport={{ once: true }} className="w-8 bg-gradient-to-t from-blue-700 to-blue-500 rounded-t-md"></motion.div>
                                <motion.div initial={{ height: 0 }} whileInView={{ height: "60%" }} transition={{ duration: 1, delay: 0.4 }} viewport={{ once: true }} className="w-8 bg-gradient-to-t from-blue-700 to-blue-500 rounded-t-md"></motion.div>
                                <motion.div initial={{ height: 0 }} whileInView={{ height: "55%" }} transition={{ duration: 1, delay: 0.5 }} viewport={{ once: true }} className="w-8 bg-gradient-to-t from-blue-700 to-blue-500 rounded-t-md"></motion.div>
                                <motion.div initial={{ height: 0 }} whileInView={{ height: "75%" }} transition={{ duration: 1, delay: 0.6 }} viewport={{ once: true }} className="w-8 bg-gradient-to-t from-blue-700 to-blue-500 rounded-t-md"></motion.div>
                                <motion.div initial={{ height: 0 }} whileInView={{ height: "90%" }} transition={{ duration: 1, delay: 0.7 }} viewport={{ once: true }} className="w-8 bg-gradient-to-t from-blue-700 to-blue-500 rounded-t-md"></motion.div>

                                {/* Trend Arrow SVG */}
                                <motion.svg initial={{ opacity: 0, pathLength: 0 }} whileInView={{ opacity: 1, pathLength: 1 }} transition={{ duration: 1.5, delay: 0.8 }} viewport={{ once: true }} className="absolute top-0 left-0 w-full h-full pointer-events-none drop-shadow-lg" viewBox="0 0 340 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <linearGradient id="arrowGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#3b82f6" />
                                            <stop offset="100%" stopColor="#60a5fa" />
                                        </linearGradient>
                                    </defs>
                                    {/* Arrow Line */}
                                    <motion.path
                                        initial={{ pathLength: 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                                        d="M20 200 L60 160 L100 180 L140 120 L180 140 L220 80 L320 20"
                                        stroke="url(#arrowGradient)"
                                        strokeWidth="8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    {/* Arrow Head */}
                                    <motion.path
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        transition={{ delay: 2, duration: 0.3 }}
                                        d="M290 20 L320 20 L320 50"
                                        stroke="url(#arrowGradient)"
                                        strokeWidth="8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </motion.svg>

                                {/* Bottom Curve */}
                                <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full opacity-80"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <StaggerContainer className="mt-32 grid md:grid-cols-3 gap-6 w-full justify-items-center md:justify-items-start">
                    <StaggerItem className="w-full">
                        <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-colors group flex flex-col items-center text-center md:items-start md:text-left max-w-[240px] md:max-w-none mx-auto md:mx-0 w-full h-full">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500 transition-colors">
                                <Zap className="w-6 h-6 text-blue-400 group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Smart Tracking</h3>
                            <p className="text-gray-400 leading-relaxed text-sm">
                                Track spending automatically. Clean and intuitive interface.
                            </p>
                        </div>
                    </StaggerItem>

                    <StaggerItem className="w-full">
                        <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-colors group flex flex-col items-center text-center md:items-start md:text-left max-w-[240px] md:max-w-none mx-auto md:mx-0 w-full h-full">
                            <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-violet-500 transition-colors">
                                <CheckCircle2 className="w-6 h-6 text-violet-400 group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Smart Advisor</h3>
                            <p className="text-gray-400 leading-relaxed text-sm">
                                Real-time professional financial advice.
                            </p>
                        </div>
                    </StaggerItem>

                    <StaggerItem className="w-full">
                        <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-colors group flex flex-col items-center text-center md:items-start md:text-left max-w-[240px] md:max-w-none mx-auto md:mx-0 w-full h-full">
                            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 transition-colors">
                                <Shield className="w-6 h-6 text-emerald-400 group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Secure</h3>
                            <p className="text-gray-400 leading-relaxed text-sm">
                                Your financial data is yours. Private & Secure.
                            </p>
                        </div>
                    </StaggerItem>
                </StaggerContainer>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/10 bg-[#16171a] pt-16 pb-8 w-full">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
                        <div className="col-span-2 lg:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 relative rounded-lg overflow-hidden">
                                    <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                                </div>
                                <span className="font-bold text-xl tracking-tight text-white">FinanceManager</span>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-6">
                                empowering individuals to take control of their financial future through smart, AI-driven insights and secure wealth management tools.
                            </p>
                            <div className="flex gap-4">
                                {/* Social placeholders */}
                                <div className="w-8 h-8 rounded-full bg-white/5 hover:bg-blue-500/20 flex items-center justify-center transition-colors cursor-pointer">
                                    <span className="sr-only">Twitter</span>
                                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white/5 hover:bg-blue-500/20 flex items-center justify-center transition-colors cursor-pointer">
                                    <span className="sr-only">GitHub</span>
                                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-white font-semibold mb-4">Product</h3>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Security</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Roadmap</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-white font-semibold mb-4">Company</h3>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-white font-semibold mb-4">Legal</h3>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-gray-500 text-sm">
                            © 2025 FinanceManager. All rights reserved.
                        </div>
                        <div className="flex gap-6 text-sm text-gray-500">
                            <span className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                Systems Operational
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
