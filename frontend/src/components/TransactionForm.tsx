"use client";
import { authenticatedFetch } from "../lib/api";

import { useState, useRef, useEffect } from "react";
import { PlusCircle, IndianRupee, Tag, FileText, ChevronDown } from "lucide-react";

const COMMON_CATEGORIES = [
  "Food", "Transport", "Shopping", "Entertainment",
  "Health", "Bills", "Rent", "Salary", "Investment", "Education", "Travel"
];

interface Transaction {
  category: string;
}

export default function TransactionForm({ onTransactionAdded, transactions = [] }: { onTransactionAdded: () => void, transactions?: Transaction[] }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // Autocomplete state
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute unique categories from history + common list
  const getSuggestions = () => {
    const historyCategories = transactions.map(t => t.category).filter(Boolean);
    const allCategories = Array.from(new Set([...COMMON_CATEGORIES, ...historyCategories]));

    if (!category) return allCategories.sort();

    return allCategories
      .filter(c => c.toLowerCase().includes(category.toLowerCase()))
      .sort();
  };

  const suggestions = getSuggestions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const response = await authenticatedFetch(`/transactions/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          category,
          description,
        }),
      });

      if (response.ok) {
        setAmount("");
        setCategory("");
        setDescription("");
        onTransactionAdded();
        setShowSuggestions(false);
      } else {
        const errorText = await response.text();
        console.error("Failed to add transaction:", response.status, response.statusText, errorText);
        alert(`Failed to add transaction: ${response.status} ${response.statusText}\n${errorText}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(`Error adding transaction: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 p-6 rounded-xl shadow-sm border border-white/10 mb-6">
      <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
        <PlusCircle className="w-5 h-5 text-blue-500" />
        Add New Transaction
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IndianRupee className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="pl-10 w-full p-2.5 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-500"
            required
          />
        </div>

        <div className="relative" ref={dropdownRef}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Tag className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Category (Optional)"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="pl-10 w-full p-2.5 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-500"
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl max-h-[190px] overflow-y-auto custom-scrollbar overflow-hidden">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setCategory(suggestion);
                    setShowSuggestions(false);
                  }}
                  className="px-5 py-4 hover:bg-white/10 cursor-pointer text-base md:text-lg text-gray-200 transition-colors flex items-center gap-3 border-b border-white/5 last:border-0"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FileText className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="pl-10 w-full p-2.5 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? "Adding..." : "Add Transaction"}
        </button>
      </form>
    </div>
  );
}
