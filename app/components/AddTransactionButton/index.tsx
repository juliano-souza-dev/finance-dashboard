// app/(app)/dashboard/components/FabButton.tsx

'use client'; 

import React from 'react';

import styles from './styles.module.css'
interface FabButtonProps {
    targetRoute?: string; 
    label?: string;
}
interface FabButtonProps {
    onClick: () => void;
}
export const AddTransactionButton: React.FC<FabButtonProps> = ({ onClick }) => {
   
    
    return (
        <button 
            className={styles.fabButton}
            onClick={onClick} 
            title="Adicionar Nova Transação"
            aria-label="Adicionar Nova Transação"
        >
            <span className={styles.fabIcon}>+</span> 
        </button>
    );
};