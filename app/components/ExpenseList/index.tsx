'use client';

import React from 'react';
import './expenselist.module.css'

interface Expense {
  id: string;
  description: string;
  value: number;
  dueDate: string;
  status: 'Pago' | 'Pendente';
}

const expenses: Expense[] = [
  { id: '1', description: 'Internet', value: 120, dueDate: '10/10/2025', status: 'Pago' },
  { id: '2', description: 'Energia', value: 240, dueDate: '15/10/2025', status: 'Pendente' },
  { id: '3', description: 'Cartão Nubank', value: 980, dueDate: '25/10/2025', status: 'Pendente' },
];

export default function ExpensesList() {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-3 text-gray-700">Despesas do mês</h2>

      <div className="space-y-3">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="flex items-start justify-between bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-all"
          >
            {/* Esquerda */}
            <div>
              <p className="font-medium text-gray-800">{expense.description}</p>
              <p className="text-sm text-gray-500 mt-1">Venc: {expense.dueDate}</p>
            </div>

            {/* Direita */}
            <div className="text-right">
              <p className="font-semibold text-gray-800">R$ {expense.value.toFixed(2)}</p>
              <p
                className={`text-sm mt-1 font-medium ${
                  expense.status === 'Pago' ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {expense.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
