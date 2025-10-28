'use client';

import React, { useState } from 'react';
import styles from './styles.module.css';
import type { Transaction } from '@/types';
import { format } from 'date-fns';
import {ptBR} from 'date-fns/locale/pt-BR';
import LoaderOverlay from '@/app/components/LoaderOverlay';

type Props = {
  title: string;
  transactions: Transaction[];
  emptyMessage?: string;
  onRefresh?: () => void; // 🔁 recarrega dashboard
};

export default function TransactionList({ title, transactions, emptyMessage, onRefresh }: Props) {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formatCurrency = (value: number | string | null | undefined) => {
    const num = Number(value) || 0;
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '-';
    try {
      return format(new Date(dateStr), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch {
      return dateStr;
    }
  };

  // =========================================
  // 🗑️ Excluir transação
  // =========================================
  const handleDelete = async () => {
    if (!selectedTransaction) return;
    const confirmDelete = confirm('Tem certeza que deseja excluir esta transação?');
    if (!confirmDelete) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/transactions?id=${selectedTransaction.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Erro ao excluir a transação.');

      setSelectedTransaction(null);
      onRefresh?.(); // recarrega dashboard
    } catch (err) {
      console.error('Erro ao excluir:', err);
      alert('Não foi possível excluir a transação.');
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================
  // 💸 Marcar como pago
  // =========================================
  const handleMarkAsPaid = async () => {
    if (!selectedTransaction) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/transactions?id=${selectedTransaction.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Pago' }),
      });

      if (!res.ok) throw new Error('Erro ao atualizar status.');

      setSelectedTransaction(null);
      onRefresh?.();
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      alert('Não foi possível atualizar o status da transação.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.transactionList}>
      {isLoading && <LoaderOverlay />}
      <h3 className={styles.listTitle}>{title}</h3>

      {transactions.length === 0 ? (
        <div className={styles.emptyMessage}>{emptyMessage}</div>
      ) : (
        transactions.map((t) => (
          <div
            key={t.id}
            className={`${styles.transactionItem} ${t.type === 'income' ? styles.income : styles.expense}`}
            onClick={() => setSelectedTransaction(t)}
          >
            <div>
              <div className={styles.description}>{t.description || 'Sem descrição'}</div>
              <div className={styles.date}>{formatDate(t.date)}</div>
            </div>
            <div className={styles.value}>{formatCurrency(t.value)}</div>
          </div>
        ))
      )}

      {/* 🔹 Popup de Detalhes */}
      {selectedTransaction && (
        <div className={styles.modalOverlay} onClick={() => setSelectedTransaction(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h4 className={styles.modalTitle}>💰 Detalhes da Transação</h4>

            <p><strong>Descrição:</strong> {selectedTransaction.description}</p>
            <p><strong>Categoria:</strong> {selectedTransaction.category}</p>
            <p><strong>Valor:</strong> {formatCurrency(selectedTransaction.value)}</p>
            <p><strong>Data:</strong> {formatDate(selectedTransaction.date)}</p>
            <p><strong>Status:</strong> {selectedTransaction.status}</p>
            <p><strong>Tipo:</strong> {selectedTransaction.type}</p>

            <div className={styles.modalActions}>
              <button
                className={`${styles.actionButton} ${styles.payButton}`}
                onClick={handleMarkAsPaid}
              >
                ✅ Marcar como Pago
              </button>

              <button
                className={`${styles.actionButton} ${styles.deleteButton}`}
                onClick={handleDelete}
              >
                🗑️ Excluir
              </button>
            </div>

            <button className={styles.closeButton} onClick={() => setSelectedTransaction(null)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
