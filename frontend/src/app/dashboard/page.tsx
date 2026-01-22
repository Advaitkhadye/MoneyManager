"use client";

import { useState, useEffect } from "react";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import ChatInterface from "@/components/ChatInterface";
import SummaryCards from "@/components/SummaryCards";
import ExpensePieChart from "@/components/ExpensePieChart";
import { LayoutDashboard } from "lucide-react";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { authenticatedFetch } from "@/lib/api";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleTransactionAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);

        const response = await authenticatedFetch(`/transactions/`);
        if (response.ok) {
          const data = await response.json();
          setTransactions(data.reverse());
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, [refreshTrigger]);

  return (
    <main className="min-h-screen bg-[#1a1b1e] p-6 md:p-12 font-sans w-full overflow-x-hidden text-white">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 text-center md:text-left">
          <ScrollReveal direction="right" delay={0.1}>
            <Link href="/" className="flex flex-col md:flex-row items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 md:w-12 md:h-12 relative rounded-xl shadow-lg shadow-blue-500/20 overflow-hidden">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  FinanceManager
                </h1>
                <p className="text-gray-400">Track, Analyze, and Optimize your wealth</p>
              </div>
            </Link>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={0.1}>
            <Link href="/" className="bg-black text-white border border-transparent px-5 py-2.5 rounded-full font-medium text-sm hover:bg-gray-900 transition-colors flex items-center gap-2 shadow-sm">
              <span>Home</span>
            </Link>
          </ScrollReveal>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-500 animate-pulse">Loading your financial data...</p>
          </div>
        ) : (
          <>
            <SummaryCards transactions={transactions} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <ScrollReveal direction="up" delay={0.2} width="100%">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2">
                      <TransactionForm onTransactionAdded={handleTransactionAdded} transactions={transactions} />
                    </div>
                  </div>
                </ScrollReveal>
                <ScrollReveal direction="up" delay={0.3} width="100%">
                  <TransactionList transactions={transactions} onTransactionChange={handleTransactionAdded} />
                </ScrollReveal>
              </div>

              <div className="space-y-8 h-full">
                <ScrollReveal direction="up" delay={0.4} width="100%">
                  <ExpensePieChart transactions={transactions} />
                </ScrollReveal>
              </div>
            </div>
          </>
        )}
        <ChatInterface />
      </div>
    </main>
  );
}
