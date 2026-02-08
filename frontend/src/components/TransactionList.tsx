"use client";
import { authenticatedFetch } from "../lib/api";
import { useEffect, useState } from "react";
import { Calendar, Tag, FileText, Trash2, Edit2, X, Check } from "lucide-react";

interface Transaction {
  id: number;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export default function TransactionList({ transactions, onTransactionChange }: { transactions: Transaction[], onTransactionChange: () => void }) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Transaction>>({});
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    setLoadingId(id);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {

      const response = await authenticatedFetch(`/transactions/${id}`, { method: "DELETE" });
      if (response.ok) {
        onTransactionChange();
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    } finally {
      setLoadingId(null);
    }
  };

  const startEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditForm(transaction);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setLoadingId(editingId);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {

      const response = await authenticatedFetch(`/transactions/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (response.ok) {
        setEditingId(null);
        onTransactionChange();
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-white/5 rounded-xl shadow-sm border border-white/10 overflow-hidden">
      <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
        <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
        <button
          onClick={() => {
            const csv = ["ID,Date,Category,Description,Amount", ...transactions.map(t => `${t.id},${t.date},${t.category},${t.description},${t.amount}`)].join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "transactions.csv";
            a.click();
          }}
          className="text-sm text-gray-400 hover:text-blue-400 font-medium transition-colors"
        >
          Download CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
              <th className="py-3 px-4 md:px-6 text-left font-medium whitespace-nowrap">Date</th>
              <th className="py-3 px-4 md:px-6 text-left font-medium hidden sm:table-cell">Category</th>
              <th className="py-3 px-4 md:px-6 text-left font-medium">Description</th>
              <th className="py-3 px-4 md:px-6 text-right font-medium">Amount</th>
              <th className="py-3 px-4 md:px-6 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-white/5 transition-colors">
                <td className="py-4 px-4 md:px-6 text-sm text-gray-300 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400 hidden sm:inline" />
                    {new Date(transaction.date).toLocaleDateString()}
                  </div>
                </td>
                <td className="py-4 px-4 md:px-6 text-sm text-gray-300 hidden sm:table-cell">
                  {editingId === transaction.id ? (
                    <input
                      className="border border-gray-700 bg-gray-900/50 text-white rounded p-1 text-xs w-full"
                      value={editForm.category || ""}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    />
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
                      <Tag className="w-3 h-3" />
                      {transaction.category}
                    </span>
                  )}
                </td>
                <td className="py-4 px-4 md:px-6 text-sm text-gray-300">
                  {editingId === transaction.id ? (
                    <input
                      className="border border-gray-700 bg-gray-900/50 text-white rounded-md p-1.5 text-xs w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      value={editForm.description || ""}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400 hidden sm:inline" />
                      <span className="truncate max-w-[100px] sm:max-w-none block">{transaction.description}</span>
                    </div>
                  )}
                </td>
                <td className="py-4 px-4 md:px-6 text-sm text-right font-semibold text-white whitespace-nowrap">
                  {editingId === transaction.id ? (
                    <input
                      type="number"
                      className="border border-gray-700 bg-gray-900/50 text-white rounded p-1 text-xs w-16 text-right"
                      value={editForm.amount || 0}
                      onChange={(e) => setEditForm({ ...editForm, amount: parseFloat(e.target.value) })}
                    />
                  ) : (
                    `-₹${transaction.amount.toFixed(2)}`
                  )}
                </td>
                <td className="py-4 px-4 md:px-6 text-sm text-right align-middle whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    {editingId === transaction.id ? (
                      <>
                        <button onClick={saveEdit} disabled={loadingId === transaction.id} className="p-1 text-green-600 hover:bg-green-50 rounded disabled:opacity-50">
                          {loadingId === transaction.id ? <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
                        </button>
                        <button onClick={cancelEdit} className="p-1 text-gray-400 hover:bg-gray-50 rounded">
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(transaction)} className="p-1.5 text-gray-400 hover:bg-white/10 rounded transition-colors group" title="Edit">
                          <Edit2 className="w-4 h-4 text-gray-400 group-hover:text-white" />
                        </button>
                        <button onClick={() => handleDelete(transaction.id)} disabled={loadingId === transaction.id} className="p-1.5 text-gray-400 hover:bg-white/10 rounded transition-colors group disabled:opacity-50" title="Delete">
                          {loadingId === transaction.id ? <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" /> : <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500" />}
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400 text-sm">
                  No transactions found. Start adding some!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
