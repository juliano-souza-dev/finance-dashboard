'use client';
import React, { useState } from 'react';
import styles from './styles.module.css'; // O arquivo de estilos para o formulário

const MOCK_CATEGORIES = [
  { id: 'C1', name: 'Alimentação' },
  { id: 'C2', name: 'Transporte' },
  { id: 'C3', name: 'Lazer' },
  { id: 'C4', name: 'Salário' },
  { id: 'C5', name: 'Outros' },
];

type Props = {
  onClose: () => void;
  onSubmitSuccess: () => void; 
  setLoading:(value: boolean) => void;
};

type FormState = {
  date: string,
  description: string;
  category: string;
  value: number;
  type: string; // 'income' | 'expense'
  status: string; // 'pending' | 'paid'
};


interface ToggleButtonGroupProps {
  name: keyof FormState; 
  options: { value: string; label: string }[];
  currentValue: string;
  onChange: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const ToggleButtonGroup: React.FC<ToggleButtonGroupProps> = ({ name, options, currentValue, onChange }) => (
  <div className={styles.toggleGroup}>
    {options.map((option) => (
      <button
        key={option.value}
        name={name}
        value={option.value}
        onClick={onChange}
        type="button" 
        className={`${styles.toggleButton} ${currentValue === option.value ? styles.active : ''}`}
      >
        {option.label}
      </button>
    ))}
  </div>
);


export default function AddTransactionForm({ onClose, onSubmitSuccess,setLoading }: Props) {
  const [form, setForm] = useState<FormState>({
    date: '',
    description: '',
    category: '',
    value: 0,
    type: 'Saída', 
    status: 'Pendente',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleButtonClick(e: React.MouseEvent<HTMLButtonElement>) {
    const { name, value } = e.currentTarget;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true)

   await fetch('/api/transactions',{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    await fetch('/api/sync')
    onSubmitSuccess();
    setLoading(false)
    onClose();
  }

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Nova Transação</h2>
        <label>Data</label>
              <input
                type="date"
                name="date"
             value={form.date}
          onChange={handleChange}
          required
        />



        <label>Descrição</label>
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <label>Categoria</label>
        <select 
          name="category" 
          value={form.category} 
          onChange={handleChange} 
          required
        >
          <option value="" disabled>Selecione uma categoria</option>
          {MOCK_CATEGORIES.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <label>Valor</label>
        <input
          type="number"
          name="value"
          value={form.value}
          onChange={(e) =>
          setForm({ ...form, value: Number(e.target.value) })
  }
          required
        />




        <label>Tipo</label>
        <ToggleButtonGroup
          name="type"
          currentValue={form.type}
          onChange={handleButtonClick}
          options={[
            { value: 'Entrada', label: 'Entrada' },
            { value: 'Saída', label: 'Saída' },
          ]}
        />

        <label>Status</label>
        <ToggleButtonGroup
          name="status"
          currentValue={form.status}
          onChange={handleButtonClick}
          options={[
            { value: 'Pago', label: 'Pago' },
            { value: 'Pendente', label: 'Pendente' },
          ]}
        />

        <div className={styles.actions}>
          <button type="button" onClick={onClose} className={styles.cancelBtn}>
            Cancelar
          </button>
          <button type="submit" className={styles.saveBtn}>
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}