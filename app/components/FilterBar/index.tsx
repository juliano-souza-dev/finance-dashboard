'use client';
import React from 'react';
import styles from './styles.module.css';

interface FilterBarProps {
  selectedType: string;
  setSelectedType: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  categories: string[];
}

export default function FilterBar({
  selectedType,
  setSelectedType,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  categories
}: FilterBarProps) {
  return (
    <div className={styles.filterBar}>
      {/* Tipo */}
      <div className={styles.filterGroup}>
        <label>Tipo</label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className={styles.select}
        >
          <option value="">Todos</option>
          <option value="income">Entrada</option>
          <option value="expense">Saída</option>
        </select>
      </div>

      {/* Categoria */}
      <div className={styles.filterGroup}>
        <label>Categoria</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={styles.select}
        >
          <option value="">Todas</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Status */}
      <div className={styles.filterGroup}>
        <label>Status</label>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className={styles.select}
        >
          <option value="">Todos</option>
          <option value="Pago">Pago</option>
          <option value="Pendente">Pendente</option>
        </select>
      </div>
    </div>
  );
}
