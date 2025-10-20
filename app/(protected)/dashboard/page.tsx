'use client';

import React from 'react';
import styles from './dashboard.module.css';
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
    
    // const { transactions, isLoading, isError } = useTransactions();
    // if (isLoading) return <div>Carregando...</div>;

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
                        {formatCurrency(summaryData.balanco)}
                    </div>

                    <div className={styles.summaryRow}>
                        
                        <div className={styles.summaryItem}>
                            <div className={styles.itemLabel}>Despesas</div>
                            <div className={`${styles.itemValue} ${styles.valueExpense}`}>
                                - {formatCurrency(summaryData.saidas)}
                            </div>
                        </div>

                        <div className={styles.summaryItem}>
                            <div className={styles.itemLabel}>Receitas</div>
                            <div className={`${styles.itemValue} ${styles.valueIncome}`}>
                                + {formatCurrency(summaryData.entradas)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Aqui entrará o Gráfico e a Lista de Transações (o restante da tela) */}
                {/* <div className={styles.chartSection}>
                    ... seu gráfico ...
                </div> 
                */}

            </div>
            
            {/* ---------------------------------------------------- */}
            {/* C. NAVEGAÇÃO INFERIOR FIXA                           */}
            {/* ---------------------------------------------------- */}
          
        </>
    );
}