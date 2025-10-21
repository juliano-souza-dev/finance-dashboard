'use client';
import React from 'react';
import type { Transaction } from '@/types';

import styles from './transactionList.module.css';
import TransactionItem from '../TransactionItem';

interface TransactionListProps {
  transactions: Transaction[];
  title?: string;
  emptyMessage?: string;
}

export default function TransactionList({
  transactions,
  title = 'Transações',
  emptyMessage = 'Nenhuma transação encontrada.',
}: TransactionListProps) {
  return (
    <section className={styles.transactionList}>
      <h2 className={styles.transactionListTitle}>{title}</h2>

      {transactions.length === 0 ? (
        <p className={styles.transactionListEmpty}>{emptyMessage}</p>
      ) : (
        <div className={styles.transactionListItems}>
          {transactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </div>
      )}
    </section>
  );
}
