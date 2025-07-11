'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface Transaction {
  amount: number;
  date: string;
  description: string;
  category: string;
}

interface ChartData {
  month: string;
  amount: number;
}

interface PieData {
  name: string;
  value: number;
}

const COLORS = ['#f6c1ff', '#b5d8ff', '#ffd9b3', '#c8e6c9', '#f8bbd0'];

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [form, setForm] = useState<{ amount: string; date: string; description: string; category: string }>({
    amount: '',
    date: '',
    description: '',
    category: '',
  });

  const [budgets, setBudgets] = useState<{ [category: string]: number }>({});
  const [budgetForm, setBudgetForm] = useState<{ category: string; amount: string }>({ category: '', amount: '' });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.amount || !form.date || !form.description || !form.category) {
      alert('Fill all fields');
      return;
    }
    setTransactions([
      ...transactions,
      { ...form, amount: parseFloat(form.amount) },
    ]);
    setForm({ amount: '', date: '', description: '', category: '' });
  };

  const handleDelete = (index: number) => {
    setTransactions(transactions.filter((_, i) => i !== index));
  };

  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);

  const categorySums = transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.keys(categorySums).reduce((top, category) =>
    categorySums[category] > (categorySums[top] || 0) ? category : top, "");

  const mostRecent = transactions
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))[0];

  const monthlyData: Record<string, number> = transactions.reduce((acc, t) => {
    const month = t.date.slice(0, 7);
    acc[month] = (acc[month] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData: ChartData[] = Object.keys(monthlyData).map(month => ({
    month,
    amount: monthlyData[month],
  }));

  const pieData: PieData[] = Object.keys(categorySums).map(category => ({
    name: category,
    value: categorySums[category],
  }));

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold text-center text-purple-700 drop-shadow">
          SpendWise 💖
        </h1>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/80 backdrop-blur-md p-4 rounded-xl shadow hover:scale-[1.02] transition text-center">
            <h3 className="text-lg font-semibold text-purple-800">Total Spent</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">₹{totalSpent}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-md p-4 rounded-xl shadow hover:scale-[1.02] transition text-center">
            <h3 className="text-lg font-semibold text-purple-800">Top Category</h3>
            <p className="text-xl text-gray-900 mt-1">{topCategory || "—"}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-md p-4 rounded-xl shadow hover:scale-[1.02] transition text-center">
            <h3 className="text-lg font-semibold text-purple-800">Most Recent</h3>
            <p className="text-sm text-gray-900 mt-1">
              {mostRecent ? `${mostRecent.date} - ${mostRecent.description}` : "—"}
            </p>
          </div>
        </div>

        {/* TRANSACTION FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-6 transition hover:scale-[1.02]"
        >
          <div className="flex flex-col gap-3">
            <input
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, amount: e.target.value })}
              className="p-3 border border-purple-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
            <input
              type="date"
              value={form.date}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, date: e.target.value })}
              className="p-3 border border-purple-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
            <input
              type="text"
              placeholder="Description"
              value={form.description}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, description: e.target.value })}
              className="p-3 border border-purple-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
            <select
              value={form.category}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm({ ...form, category: e.target.value })}
              className="p-3 border border-purple-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition bg-white"
            >
              <option value="">Select Category</option>
              <option value="Food">🍔 Food</option>
              <option value="Travel">🚗 Travel</option>
              <option value="Shopping">🛍️ Shopping</option>
              <option value="Bills">💡 Bills</option>
              <option value="Other">📝 Other</option>
            </select>

            <button
              type="submit"
              className="mt-2 bg-purple-400 hover:bg-purple-500 text-white font-semibold py-3 rounded-lg shadow transition-transform hover:scale-105"
            >
              Add Transaction
            </button>
          </div>
        </form>

        {/* TRANSACTION LIST */}
<ul className="mt-6 space-y-2">
  {transactions.map((t, index) => (
    <li     
      key={index}
      className="flex justify-between items-center bg-white/70 backdrop-blur-md p-3 rounded-lg shadow hover:scale-[1.01] transition"
    >
      <span className="text-gray-700">
        {t.date} - {t.description} - ₹{t.amount} ({t.category})
      </span>
      <button
        onClick={() => handleDelete(index)}
        className="ml-2 px-3 py-1 bg-red-300 hover:bg-red-400 text-white rounded transition"
      >
        Delete
      </button>
    </li>
  ))}
</ul>


        {/* BUDGET FORM */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!budgetForm.category || !budgetForm.amount) {
              alert("Please select category and enter budget amount.");
              return;
            }
            setBudgets({ ...budgets, [budgetForm.category]: parseFloat(budgetForm.amount) });
            setBudgetForm({ category: '', amount: '' });
          }}
          className="mt-8 bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-6 transition hover:scale-[1.02]"
        >
          <h2 className="text-xl font-bold mb-4 text-purple-700">Set Category Budgets</h2>
          <div className="flex flex-col gap-3">
            <select
              value={budgetForm.category}
              onChange={(e) => setBudgetForm({ ...budgetForm, category: e.target.value })}
              className="p-3 border border-purple-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition bg-white"
            >
              <option value="">Select Category</option>
              <option value="Food">🍔 Food</option>
              <option value="Travel">🚗 Travel</option>
              <option value="Shopping">🛍️ Shopping</option>
              <option value="Bills">💡 Bills</option>
              <option value="Other">📝 Other</option>
            </select>
            <input
              type="number"
              placeholder="Budget Amount"
              value={budgetForm.amount}
              onChange={(e) => setBudgetForm({ ...budgetForm, amount: e.target.value })}
              className="p-3 border border-purple-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
            <button
              type="submit"
              className="mt-2 bg-purple-400 hover:bg-purple-500 text-white font-semibold py-3 rounded-lg shadow transition-transform hover:scale-105"
            >
              Save Budget
            </button>
          </div>
        </form>

        {/* BUDGET SUMMARY */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(budgets).length === 0 && (
            <p className="text-gray-600">No budgets set yet.</p>
          )}
          {Object.entries(budgets).map(([category, amount]) => (
            <div
              key={category}
              className="bg-purple-50 p-4 rounded-lg shadow hover:scale-[1.01] transition"
            >
              <h3 className="text-lg font-semibold text-purple-800">{category}</h3>
              <p className="text-gray-900 mt-1">Budget: ₹{amount}</p>
              <p className="text-sm text-gray-700">
                Spent: ₹{categorySums[category] || 0} 
                {categorySums[category] > amount ? 
                  <span className="text-red-600"> ⚠️ Over Budget</span> :
                  <span className="text-green-600"> ✅ Under Budget</span>
                }
              </p>
            </div>
          ))}
        </div>

        {/* CHARTS */}
        <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-6 transition hover:scale-[1.02]">
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

        <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-6 transition hover:scale-[1.02]">
          <h2 className="text-2xl font-bold mb-4 text-purple-700">Expenses by Category</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                dataKey="value"
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}
