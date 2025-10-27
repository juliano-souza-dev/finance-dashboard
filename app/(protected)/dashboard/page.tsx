'use client';

import React, { useEffect, useState } from 'react';
import styles from './dashboard.module.css';
import type { FinancialSummary, Transaction } from '@/types';
import TransactionList from '@/app/components/TransactionList';
import { AddTransactionButton } from '@/app/components/AddTransactionButton';
import AddTransactionForm from '@/app/components/AddTransactionForm';
import LoaderOverlay from '@/app/components/LoaderOverlay';
const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function DashboardContent() {
 
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState(false)
  const handleOpenForm = () => {

  setIsFormOpen(true)
}
const handleCloseForm = () => {
  setIsFormOpen(false)
}

async function loadTransactions() {
  try {
      setIsLoading(true)
      const res = await fetch("/api/transactions");
      const data = await res.json();
      setTransactions(data.transactions);
    } catch (err) {
      setError(true)
      console.error("Erro ao carregar transações:", err);
    } finally {
      setIsLoading(false);
    }
}
useEffect(() => {
  (async () => {
    await loadTransactions();
  })();
}, []);

  if (error) return <div>Erro ao carregar transações.</div>;
  
  const summary = transactions?.reduce<FinancialSummary>(
    (acc, t) => {
      if (t.type === 'income') acc.incomes += t.value;
      else if (t.type === 'expense') acc.expenses += t.value;
      acc.balance = acc.incomes - acc.expenses;
      return acc;
    },
    { incomes: 0, expenses: 0, balance: 0 }
  );

  const balanceClass = summary.balance >= 0 ? styles.valueIncome : styles.valueExpense;

  const incomes = transactions.filter((t) => t.type === 'income');
  const expenses = transactions.filter((t) => t.type === 'expense');

  return (
    <>
      {loading && <LoaderOverlay />}

      
      <div className={styles.topBar}>
        <div className={styles.monthSelector}>
          <button className={styles.iconButton} style={{ fontSize: '1rem' }}>
            ↑↓
          </button>
          <span>{new Date().toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }).toUpperCase()}</span>
        </div>
      </div>

      <div className={styles.dashboardContainer}>
        <div className={styles.balanceSection}>
          <div className={styles.balanceIcon}>⚖️</div>
          <div className={styles.balanceTitle}>Balanço do mês</div>
          <div className={`${styles.balanceValue} ${balanceClass}`}>
            {formatCurrency(summary.balance)}
          </div>

          <div className={styles.summaryRow}>
            <div className={styles.summaryItem}>
              <div className={styles.itemLabel}>Despesas</div>
              <div className={`${styles.itemValue} ${styles.valueExpense}`}>
                - {formatCurrency(summary.expenses)}
              </div>
            </div>

            <div className={styles.summaryItem}>
              <div className={styles.itemLabel}>Receitas</div>
              <div className={`${styles.itemValue} ${styles.valueIncome}`}>
                + {formatCurrency(summary.incomes)}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.transactionSection}>
          <TransactionList title="Entradas" transactions={incomes} emptyMessage="Nenhuma entrada registrada." />
          <TransactionList title="Saídas" transactions={expenses} emptyMessage="Nenhuma saída registrada." />
        </div>

        <AddTransactionButton onClick={handleOpenForm} />
        {isFormOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <AddTransactionForm onClose={handleCloseForm} onSubmitSuccess={loadTransactions} setLoading={setIsLoading}/>
                    </div>
                </div>
            )}
      </div>
    </>
  );
}
