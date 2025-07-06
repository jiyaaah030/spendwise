'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

interface Transaction {
  amount: number;
  date: string;
  description: string;
}

interface ChartData {
  month: string;
  amount: number;
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [form, setForm] = useState<{ amount: string; date: string; description: string }>({
    amount: '',
    date: '',
    description: '',
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.amount || !form.date || !form.description) {
      alert('Fill all fields');
      return;
    }
    setTransactions([
      ...transactions,
      { ...form, amount: parseFloat(form.amount) },
    ]);
    setForm({ amount: '', date: '', description: '' });
  };

  const handleDelete = (index: number) => {
    setTransactions(transactions.filter((_, i) => i !== index));
  };

  const monthlyData: Record<string, number> = transactions.reduce((acc, t) => {
    const month = t.date.slice(0, 7);
    acc[month] = (acc[month] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData: ChartData[] = Object.keys(monthlyData).map(month => ({
    month,
    amount: monthlyData[month],
  }));

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold text-center text-purple-600 drop-shadow">
          SpendWise 💖
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white/70 backdrop-blur-md shadow-lg rounded-2xl p-6 transition hover:scale-[1.02]"
        >
          <div className="flex flex-col gap-3">
            <input
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, amount: e.target.value })}
              className="p-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />
            <input
              type="date"
              value={form.date}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, date: e.target.value })}
              className="p-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />
            <input
              type="text"
              placeholder="Description"
              value={form.description}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, description: e.target.value })}
              className="p-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />
            <button
              type="submit"
              className="mt-2 bg-purple-400 hover:bg-purple-500 text-white font-semibold py-3 rounded-lg shadow transition-transform hover:scale-105"
            >
              Add Transaction
            </button>
          </div>
        </form>

        <div className="bg-white/70 backdrop-blur-md shadow-lg rounded-2xl p-6 transition hover:scale-[1.02]">
          <h2 className="text-2xl font-bold mb-4 text-purple-700">Transactions</h2>
          <ul className="space-y-3">
            {transactions.map((t, i) => (
              <li
                key={i}
                className="flex justify-between items-center bg-purple-50 px-4 py-3 rounded-lg shadow hover:scale-[1.01] transition"
              >
                <span>
                  {t.date}: ₹{t.amount}{' '}
                  <span className="italic text-gray-600">({t.description})</span>
                </span>
                <button
                  onClick={() => handleDelete(i)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
            {transactions.length === 0 && (
              <li className="text-gray-500">No transactions yet.</li>
            )}
          </ul>
        </div>

        <div className="bg-white/70 backdrop-blur-md shadow-lg rounded-2xl p-6 transition hover:scale-[1.02]">
          <h2 className="text-2xl font-bold mb-4 text-purple-700">Monthly Expenses</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#a78bfa" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}
