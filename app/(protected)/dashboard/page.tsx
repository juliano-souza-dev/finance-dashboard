'use client';
import React, { useEffect, useState } from 'react';
import styles from './dashboard.module.css';
import type { FinancialSummary, Transaction } from '@/types';
import TransactionList from '@/app/components/TransactionList';
import { AddTransactionButton } from '@/app/components/AddTransactionButton';
import AddTransactionForm from '@/app/components/AddTransactionForm';
import LoaderOverlay from '@/app/components/LoaderOverlay';
import { parseDateSafe } from '@/lib/helpers/date-normalize-helper';

const formatCurrency = (value?: number | null) =>
  (value ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function calculateSummary(transactions: Transaction[]): FinancialSummary {
  if (!Array.isArray(transactions) || transactions.length === 0)
    return { incomes: 0, expenses: 0, balance: 0 };

  return transactions.reduce<FinancialSummary>(
    (acc, t) => {
      const v = t?.value ?? 0;
      if (t?.type === 'income') acc.incomes += v;
      else if (t?.type === 'expense') acc.expenses += v;
      acc.balance = acc.incomes - acc.expenses;
      return acc;
    },
    { incomes: 0, expenses: 0, balance: 0 }
  );
}

export default function DashboardContent() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pendingPayments, setPendingPayments] = useState<Transaction[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  async function loadFilteredTransactions() {
    try {
      setIsLoading(true);
      setError(false);
      const month = String(selectedMonth + 1).padStart(2, '0');
      const res = await fetch(`/api/transactions?month=${month}&year=${selectedYear}`);
      const data = await res.json();
      setTransactions(Array.isArray(data.transactions) ? data.transactions : []);
    } catch (err) {
      console.error('Erro ao carregar transações:', err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }

async function loadPendingTransactions() {
  try {
    // Se sua API aceita esse filtro, ótimo. Senão, mantenha só status=pending
    const res = await fetch(`/api/transactions?status=pending`);
    const data = await res.json();

    if (!Array.isArray(data.transactions)) {
      setPendingPayments([]);
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // normaliza para meia-noite

    const pendingOverdue = data.transactions.filter((t: Transaction) => {
      // Tipos possíveis, dependendo de como você salva: "saída", "saida" ou "expense"
      const type = t.type?.toString().toLowerCase();
      const isExpense =
        type === 'saída' || type === 'saida' || type === 'expense';

      // Status possíveis: "pendente" ou "pending"
      const status = t.status?.toString().toLowerCase();
      const isPending = status === 'pendente' || status === 'pending';

      const dateObj = parseDateSafe(t.date);
      const isPastDue = !!dateObj && dateObj < today;

      return isExpense && isPending && isPastDue;
    });

    setPendingPayments(pendingOverdue);
  } catch (err) {
    console.error('Erro ao buscar contas pendentes:', err);
    setPendingPayments([]);
  }
}


  // 🔁 Efeitos
  useEffect(() => {
    loadFilteredTransactions();
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    loadPendingTransactions();
  }, []);

  const summary = calculateSummary(transactions);
  const balanceClass = summary.balance >= 0 ? styles.valueIncome : styles.valueExpense;
  const incomes = transactions.filter((t) => t.type === 'income');
  const expenses = transactions.filter((t) => t.type === 'expense');

  if (error)
    return (
      <div className={styles.errorState}>
        ❌ Erro ao carregar transações.
        <button onClick={loadFilteredTransactions}>Tentar novamente</button>
      </div>
    );

  return (
    <>
      {loading && <LoaderOverlay />}

      {/* ======== TOPO ======== */}
      <div className={styles.topBar}>
        <div className={styles.monthSelector}>
          <button className={styles.iconButton} title="Trocar mês/ano">↑↓</button>

          <div className={styles.dateSelectors}>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className={styles.customSelect}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(0, i).toLocaleString('pt-BR', { month: 'long' })}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className={styles.customSelect}
            >
              {Array.from({ length: 6 }, (_, i) => {
                const year = new Date().getFullYear() - 3 + i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      {/* ======== DASHBOARD ======== */}
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

        {/* 🔹 Mostra o aviso global de contas pendentes */}
        {pendingPayments.length > 0 && (
          <div className={styles.summaryLinkContainer}>
            <button
              className={styles.summaryLink}
              onClick={() =>
                alert('No futuro: abrirá a listagem de contas pendentes.')
              }
            >
              💸 Você tem {pendingPayments.length}{' '}
              {pendingPayments.length === 1 ? 'conta a pagar' : 'contas a pagar'}.
            </button>
          </div>
        )}

        {/* ======== LISTAGEM ======== */}
        {transactions.length === 0 && !loading ? (
          <div className={styles.emptyState}>Nenhuma transação neste período.</div>
        ) : (
          <div className={styles.transactionSection}>
            <TransactionList title="Entradas" transactions={incomes} emptyMessage="Nenhuma entrada." />
            <TransactionList title="Saídas" transactions={expenses} emptyMessage="Nenhuma saída." />
          </div>
        )}

        <AddTransactionButton onClick={() => setIsFormOpen(true)} />
        {isFormOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <AddTransactionForm
                onClose={() => setIsFormOpen(false)}
                onSubmitSuccess={() => {
                  loadFilteredTransactions();
                  loadPendingTransactions();
                }}
                setLoading={setIsLoading}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
