'use client';

import React, { useEffect, useState } from 'react';
import styles from './dashboard.module.css';
import { TransactionsRepository } from '@/lib/repositories/TransactionsRepository';
import { useFetchJson } from '@/lib/hooks/useFetch';
import { FinancialSummary, Transaction, TransactionFilters } from '@/types';
// import { useTransactions } from '@/hooks/useTransactions'; // Usaremos depois

// Dados Estáticos de Exemplo (Ainda embutidos para o mockup)
const summaryData = {
    month: 'out, 2025',
    entradas: 0.00,
    saidas: 0.00,
    balanco: 0.00,
};

const formatCurrency = (value: number) => 
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function DashboardContent() {
    
const { data, error, loading } = useFetchJson<{ transactions: Transaction[] }>('/api/transactions');

const transactions = data?.transactions ?? []; 

if(loading) {
    return <div>Carregando...</div>
}

    const initialSummary: FinancialSummary = {
        incomes: 0,
        expenses: 0,
        balance: 0, 
    };
    const summary = transactions?.reduce((_acc:Omit<FinancialSummary,'balance'>, transaction: Transaction) => {
        const value = transaction.value

        if(transaction.type === 'income') {
            _acc.incomes+= value
        } else {
            _acc.expenses+= value
        }

        return _acc;
    },initialSummary)

    const balanceClass = summaryData.balanco >= 0 ? styles.valueIncome : styles.valueExpense;


    return (
        <>
      
            <div className={styles.topBar}>
            
            
                {}
                <div className={styles.monthSelector}>
                    <button className={styles.iconButton} style={{ fontSize: '1rem' }}>
                        ↑↓
                    </button>
                    <span>{summaryData.month.toUpperCase()}</span>
                </div>
                
            </div>

        
            <div className={styles.dashboardContainer}>
            
                <div className={styles.balanceSection}>
                    <div className={styles.balanceIcon}>
                         ⚖️ 
                    </div>
                    <div className={styles.balanceTitle}>Balanço do mês</div>
                    <div className={`${styles.balanceValue} ${balanceClass}`}>
                        {formatCurrency(summary?.incomes - summary.expenses)}
                    </div>

                    <div className={styles.summaryRow}>
                        
                        <div className={styles.summaryItem}>
                            <div className={styles.itemLabel}>Despesas</div>
                            <div className={`${styles.itemValue} ${styles.valueExpense}`}>
                                - {formatCurrency(summary?.expenses ?? 0)}
                            </div>
                        </div>

                        <div className={styles.summaryItem}>
                            <div className={styles.itemLabel}>Receitas</div>
                            <div className={`${styles.itemValue} ${styles.valueIncome}`}>
                                + {formatCurrency(summary?.incomes ?? 0)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Aqui entrará o Gráfico e a Lista de Transações (o restante da tela) */}
                {/* <div className={styles.chartSection}>
                    ... seu gráfico ...
                </div> 
                */}

                <div>
                    <h2>Entradas</h2>
                    {
                        transactions.map(transaction => {
                            
                        })
                    }
                </div>



            </div>
            
           

            {/* ---------------------------------------------------- */}
            {/* C. NAVEGAÇÃO INFERIOR FIXA                           */}
            {/* ---------------------------------------------------- */}
          
        </>
    );
}