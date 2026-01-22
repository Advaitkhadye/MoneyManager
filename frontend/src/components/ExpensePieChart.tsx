"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useState, useEffect } from "react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];
// Timestamp: Thu Dec 11 2025 - Fix Verified Locally

interface Transaction {
    amount: number;
    category: string;
}

export default function ExpensePieChart({ transactions }: { transactions: Transaction[] }) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const data = transactions.reduce((acc: any[], curr) => {
        const existing = acc.find((item) => item.name === curr.category);
        if (existing) {
            existing.value += curr.amount;
        } else {
            acc.push({ name: curr.category, value: curr.amount });
        }
        return acc;
    }, []);

    if (data.length === 0) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center h-64">
                <p className="text-gray-400">No data to display</p>
            </div>
        );
    }

    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="bg-white/5 p-6 rounded-xl shadow-sm border border-white/10 h-full flex flex-col">
            <h2 className="text-lg font-semibold mb-4 text-white">Expenses by Category</h2>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={isMobile ? 40 : 60}
                            outerRadius={isMobile ? 55 : 80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            label={({ x, y, cx, name, percent, index }) => (
                                <text
                                    x={x}
                                    y={y}
                                    fill={COLORS[index % COLORS.length]}
                                    textAnchor={x > cx ? 'start' : 'end'}
                                    dominantBaseline="central"
                                    className="text-[9px] md:text-[11px] font-medium"
                                >
                                    {`${(name || '').charAt(0).toUpperCase() + (name || '').slice(1)} ${((percent || 0) * 100).toFixed(0)}%`}
                                </text>
                            )}
                            labelLine={true}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.1)" />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: number) => `₹${value.toFixed(2)}`}
                            contentStyle={{ backgroundColor: '#1a1b1e', borderColor: '#374151', color: '#fff' }}
                        />
                        <Legend
                            formatter={(value, entry: any) => {
                                const percent = ((entry.payload.value / total) * 100).toFixed(0);
                                const safeValue = (value || '').toString();
                                return <span className="text-xs md:text-sm text-gray-400 ml-1">{safeValue.charAt(0).toUpperCase() + safeValue.slice(1)} ({percent}%)</span>;
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div >
        </div >
    );
}
