'use client';

import React from 'react';
import styles from './dashboard.module.css';
import { useFetchJson } from '@/lib/hooks/useFetch';
import type { FinancialSummary, Transaction } from '@/types';
import TransactionList from '@/app/components/TransactionList';

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function DashboardContent() {
  const { data, error, loading } = useFetchJson<{ transactions: Transaction[] }>('/api/transactions');
  const transactions = data?.transactions ?? [];

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar transações.</div>;

  // ✅ Calcula o resumo
  const summary = transactions.reduce<FinancialSummary>(
    (acc, t) => {
      if (t.type === 'income') acc.incomes += t.value;
      else if (t.type === 'expense') acc.expenses += t.value;
      acc.balance = acc.incomes - acc.expenses;
      return acc;
    },
    { incomes: 0, expenses: 0, balance: 0 }
  );

  const balanceClass = summary.balance >= 0 ? styles.valueIncome : styles.valueExpense;

  // ✅ Filtra por tipo
  const incomes = transactions.filter((t) => t.type === 'income');
  const expenses = transactions.filter((t) => t.type === 'expense');

  return (
    <>
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

        {/* ✅ Listas de transações */}
        <div className={styles.transactionSection}>
          <TransactionList title="Entradas" transactions={incomes} emptyMessage="Nenhuma entrada registrada." />
          <TransactionList title="Saídas" transactions={expenses} emptyMessage="Nenhuma saída registrada." />
        </div>
      </div>
    </>
  );
}
