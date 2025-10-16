

import ExpenseList from '@/app/components/ExpenseList';
import styles from './dashboard.module.css';

// Dados Estáticos para o Gráfico (6 Meses de Despesas/Gastos)
const chartData = [
  { month: 'Abr', expenses: 3500, income: 5000 },
  { month: 'Mai', expenses: 4200, income: 6000 },
  { month: 'Jun', expenses: 3800, income: 5500 },
  { month: 'Jul', expenses: 4500, income: 7000 },
  { month: 'Ago', expenses: 5100, income: 6500 },
  { month: 'Set', expenses: 4000, income: 5800 },
];

const mockExpenses = [
  { id: '1', description: 'Conta de Luz', amount: 120.5, dueDate: '2025-10-05', status: 'paid' },
  { id: '2', description: 'Aluguel', amount: 1200.0, dueDate: '2025-10-10', status: 'pending' },
  { id: '3', description: 'Internet', amount: 99.9, dueDate: '2025-10-20', status: 'overdue' },
];


// Dados Estáticos para o Resumo Mensal (Foco no último mês, Set)
const lastMonthSummary = {
  month: 'Setembro',
  entradas: 5800.00,
  saidas: 4000.00,
};

const balance = lastMonthSummary.entradas - lastMonthSummary.saidas;
const balanceClass = balance >= 0 ? styles.positive : styles.negative;


// Funções de Ajuda para Renderização do Gráfico
// Encontra o valor máximo para dimensionar as barras
const maxExpense = Math.max(...chartData.map(d => d.expenses));

// Formata o valor para BRL
const formatCurrency = (value: number) => 
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });


export default function DashboardPage() {
    return (
        <div className={styles.dashboardContainer}>
            <h1 className={styles.header}>Dashboard Financeira</h1>

            {/* ---------------------------------------------------- */}
            {/* 1. SEÇÃO DE RESUMO MENSAL (Entradas, Saídas, Balanço) */}
            {/* ---------------------------------------------------- */}
            <div className={styles.summaryGrid}>
                
                {/* Cartão de Entradas */}
                <div className={styles.summaryCard}>
                    <div className={styles.cardTitle}>Entradas em {lastMonthSummary.month}</div>
                    <div className={styles.cardValue} style={{ color: 'var(--color-success)' }}>
                        {formatCurrency(lastMonthSummary.entradas)}
                    </div>
                </div>

                {/* Cartão de Saídas */}
                <div className={styles.summaryCard}>
                    <div className={styles.cardTitle}>Saídas em {lastMonthSummary.month}</div>
                    <div className={styles.cardValue} style={{ color: 'var(--color-danger)' }}>
                        {formatCurrency(lastMonthSummary.saidas)}
                    </div>
                </div>

                {/* Cartão de Balanço */}
                <div className={styles.summaryCard}>
                    <div className={styles.cardTitle}>Balanço Mensal</div>
                    <div className={`${styles.cardValue} ${styles.cardBalance} ${balanceClass}`}>
                        {formatCurrency(balance)}
                    </div>
                </div>
            </div>


            {/* ---------------------------------------------------- */}
            {/* 2. GRÁFICO (Comparativo Despesas Últimos 6 Meses)    */}
            {/* ---------------------------------------------------- */}
            <div className={styles.chartSection}>
                <h2 className={styles.chartTitle}>Comparativo de Despesas (Últimos 6 Meses)</h2>
                
                <div className={styles.chartContainer}>
                    <div className={styles.chartBarContainer}>
                        
                        {chartData.map((data, index) => {
                            // Altura da barra baseada na proporção do gasto máximo
                            const heightPercentage = (data.expenses / maxExpense) * 90; 
                            
                            return (
                                <div key={index} className={styles.barWrapper}>
                                    <div 
                                        className={styles.bar} 
                                        style={{ height: `${heightPercentage}%` }}
                                        title={`Despesas: ${formatCurrency(data.expenses)}`}
                                    >
                                        <span className={styles.barLabel}>{formatCurrency(data.expenses / 1000)}k</span>
                                    </div>
                                    <div className={styles.barMonth}>{data.month}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            
            {/* Aqui será adicionado o componente de listagem de transações (próxima tarefa) */}

        <div>
             <ExpenseList expenses={mockExpenses} />
        </div>
        </div>
    );
}