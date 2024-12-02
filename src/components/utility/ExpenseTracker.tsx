import React, { useState, useEffect } from 'react';
import { DollarSign, PieChart, Plus, Trash } from 'lucide-react';
import { get, set } from 'idb-keyval';
import { format } from 'date-fns';

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
}

const CATEGORIES = [
  'Food',
  'Transport',
  'Entertainment',
  'Bills',
  'Shopping',
  'Other',
];

export function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    const stored = await get('expenses') || [];
    setExpenses(stored.map((exp: Expense) => ({
      ...exp,
      date: new Date(exp.date),
    })));
  };

  const addExpense = async () => {
    if (!amount || isNaN(Number(amount))) return;

    const expense: Expense = {
      id: `exp_${Date.now()}`,
      amount: Number(amount),
      category,
      description,
      date: new Date(),
    };

    const updated = [expense, ...expenses];
    await set('expenses', updated);
    setExpenses(updated);
    setAmount('');
    setDescription('');
  };

  const deleteExpense = async (id: string) => {
    const updated = expenses.filter(exp => exp.id !== id);
    await set('expenses', updated);
    setExpenses(updated);
  };

  const calculateTotal = () => {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  };

  const calculateCategoryTotal = (cat: string) => {
    return expenses
      .filter(exp => exp.category === cat)
      .reduce((sum, exp) => sum + exp.amount, 0);
  };

  return (
    <div className="h-full p-4">
      <div className="mb-4 pb-2 border-b border-[#00ff9d] flex items-center gap-2">
        <DollarSign className="h-4 w-4" />
        <h2 className="terminal-text text-xs">EXPENSE TRACKER</h2>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              className="terminal-input w-full"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="terminal-input w-full"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="terminal-input w-full"
            />
            <button
              onClick={addExpense}
              className="terminal-button w-full flex items-center justify-center gap-2"
            >
              <Plus className="h-3 w-3" />
              ADD EXPENSE
            </button>
          </div>

          <div className="border border-[#00ff9d] rounded p-2">
            <div className="flex items-center gap-2 mb-2">
              <PieChart className="h-4 w-4" />
              <h3 className="terminal-text text-[10px]">SUMMARY</h3>
            </div>
            <p className="terminal-text text-xs mb-2">
              Total: ${calculateTotal().toFixed(2)}
            </p>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => {
                const total = calculateCategoryTotal(cat);
                if (total === 0) return null;
                return (
                  <p key={cat} className="terminal-text text-[10px]">
                    {cat}: ${total.toFixed(2)}
                  </p>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="terminal-text text-[10px] text-[#00ff9d]/70">RECENT EXPENSES:</h3>
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center gap-2 p-2 border border-[#00ff9d] rounded"
            >
              <div className="flex-1">
                <p className="terminal-text text-[10px]">
                  ${expense.amount.toFixed(2)} - {expense.category}
                </p>
                {expense.description && (
                  <p className="terminal-text text-[8px] text-[#00ff9d]/70">
                    {expense.description}
                  </p>
                )}
                <p className="terminal-text text-[8px] text-[#00ff9d]/50">
                  {format(expense.date, 'MMM d, yyyy HH:mm')}
                </p>
              </div>
              <button
                onClick={() => deleteExpense(expense.id)}
                className="terminal-button p-1"
                aria-label="Delete expense"
              >
                <Trash className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}