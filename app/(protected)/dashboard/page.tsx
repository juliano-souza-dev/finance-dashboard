'use client';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import styles from './dashboard.module.css';
import type { FinancialSummary, Transaction } from '@/types';
import TransactionList from '@/app/components/TransactionList';
import { AddTransactionButton } from '@/app/components/AddTransactionButton';
import AddTransactionForm from '@/app/components/AddTransactionForm';
import LoaderOverlay from '@/app/components/LoaderOverlay';
import { parseDateSafe } from '@/lib/helpers/date-normalize-helper';

const formatCurrency = (value?: number | string | null) => {
  const numeric = Number(value) || 0;
  return numeric.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};


const calculateSummary = (transactions: Transaction[]): FinancialSummary => {
  if (!Array.isArray(transactions) || transactions.length === 0)
    return { incomes: 0, expenses: 0, balance: 0 };

  return transactions.reduce<FinancialSummary>(
    (acc, t) => {
      const v = Number(t?.value) || 0;
      const type = t?.type?.toLowerCase?.() ?? '';
      if (['income', 'entrada'].includes(type)) acc.incomes += v;
      else if (['expense', 'saída', 'saida'].includes(type)) acc.expenses += v;
      acc.balance = acc.incomes - acc.expenses;
      return acc;
    },
    { incomes: 0, expenses: 0, balance: 0 }
  );
};

export default function DashboardContent() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pendingPayments, setPendingPayments] = useState<Transaction[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const loadFilteredTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(false);

      const month = String(selectedMonth + 1).padStart(2, '0');
      const res = await fetch(`/api/transactions?month=${month}&year=${selectedYear}`, {
        cache: 'no-store',
      });

      const data = await res.json();
      const txs = Array.isArray(data.transactions) ? [...data.transactions] : [];
      setTransactions(txs);

      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Transações carregadas:', txs);
      }
    } catch (err) {
      console.error('❌ Erro ao carregar transações:', err);
      setError(true);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedMonth, selectedYear]);


  const loadPendingTransactions = useCallback(async () => {
    try {
      const res = await fetch(`/api/transactions?status=pending`, { cache: 'no-store' });
      const data = await res.json();
      if (!Array.isArray(data.transactions)) return setPendingPayments([]);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const filtered = data.transactions.filter((t: Transaction) => {
        const type = t?.type?.toLowerCase?.() ?? '';
        const status = t?.status?.toLowerCase?.() ?? '';
        const dateObj = parseDateSafe(t.date);
        const isExpense = ['expense', 'saída', 'saida'].includes(type);
        const isPending = ['pending', 'pendente'].includes(status);
        const isOverdue = !!dateObj && dateObj < today;
        return isExpense && isPending && isOverdue;
      });

      setPendingPayments(filtered);

      if (process.env.NODE_ENV === 'development') {
        console.log('⚠️ Contas vencidas:', filtered.length);
      }
    } catch (err) {
      console.error('Erro ao buscar contas pendentes:', err);
      setPendingPayments([]);
    }
  }, []);

  // ==============================
  // 🔹 Efeitos
  // ==============================
  useEffect(() => {
    loadFilteredTransactions();
  }, [loadFilteredTransactions]);

  useEffect(() => {
    loadPendingTransactions();
  }, [loadPendingTransactions]);

  // ==============================
  // 🔹 Normalização e Cálculos
  // ==============================
  const normalizedTransactions = useMemo(() => {
    return transactions.map((t) => {
      const rawType = t?.type?.toLowerCase?.().trim() ?? '';
      let normalizedType = rawType;

      if (['entrada', 'income'].includes(rawType)) normalizedType = 'income';
      else if (['saída', 'saida', 'expense'].includes(rawType)) normalizedType = 'expense';

      return { ...t, type: normalizedType };
    });
  }, [transactions]);

  const summary = useMemo(() => calculateSummary(normalizedTransactions), [normalizedTransactions]);
  const balanceClass = summary.balance >= 0 ? styles.valueIncome : styles.valueExpense;

  const incomes = useMemo(
    () => normalizedTransactions.filter((t) => t.type === 'income'),
    [normalizedTransactions]
  );
  const expenses = useMemo(
    () => normalizedTransactions.filter((t) => t.type === 'expense'),
    [normalizedTransactions]
  );

  // ==============================
  // 🔹 Renderização Condicional
  // ==============================
  if (error) {
    return (
      <div className={styles.errorState}>
        ❌ Erro ao carregar transações.
        <button onClick={loadFilteredTransactions}>Tentar novamente</button>
      </div>
    );
  }

  // ==============================
  // 🔹 Render Principal
  // ==============================
  return (
    <>
      {loading && <LoaderOverlay />}

      {/* ======== TOPO ======== */}
      <div className={styles.topBar}>
        <div className={styles.monthSelector}>
          <button className={styles.iconButton} title="Trocar mês/ano">
            ↑↓
          </button>

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

        {/* 🔹 Alerta de Contas Pendentes */}
        {pendingPayments.length > 0 && (
          <div className={styles.summaryLinkContainer}>
            <button
              className={styles.summaryLink}
              onClick={() => alert('Em breve: abrirá listagem detalhada das pendências.')}
            >
              💸 Você tem {pendingPayments.length}{' '}
              {pendingPayments.length === 1 ? 'conta pendente' : 'contas pendentes'} vencida
              {pendingPayments.length > 1 ? 's' : ''}.
            </button>
          </div>
        )}

        {/* ======== LISTAGENS ======== */}
        {normalizedTransactions.length === 0 && !loading ? (
          <div className={styles.emptyState}>Nenhuma transação neste período.</div>
        ) : (
          <div className={styles.transactionSection}>
            <TransactionList
              title="Entradas"
              transactions={incomes}
              emptyMessage="Nenhuma entrada."
            />
            <TransactionList
              title="Saídas"
              transactions={expenses}
              emptyMessage="Nenhuma saída."
            />
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
