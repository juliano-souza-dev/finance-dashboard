'use client';
import React from 'react';
import type { Transaction } from '@/types';
import styles from './transactionIem.module.css'

type Props = {
  transaction: Transaction; // espera type: 'income' | 'expense' e status: 'paid' | 'pending'
};

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const formatDate = (isoDate: string) => {
  const d = new Date(isoDate);
  return isNaN(d.getTime()) ? isoDate : d.toLocaleDateString('pt-BR');
};

export default function TransactionItem({ transaction }: Props) {
  const { description, value, date, type, status, category } = transaction;

  const typeClass = type === 'income' ? styles.income : styles.expense;
  const statusClass = status === 'paid' ? styles.paid : styles.pending;

  return (
    <div className={`${styles.item} ${typeClass}`} role="listitem" aria-label={description}>
      <div className={styles.left}>
        <span className={styles.description}>{description}</span>
        <span className={styles.category}>{category}</span>
        <span className={styles.date}>{formatDate(date)}</span>
      </div>

      <div className={styles.right}>
        <span className={styles.value}>{formatCurrency(value)}</span>
        <span className={`${styles.status} ${statusClass}`}>
          {status === 'paid' ? 'Pago' : 'Pendente'}
        </span>
      </div>
    </div>
  );
}
