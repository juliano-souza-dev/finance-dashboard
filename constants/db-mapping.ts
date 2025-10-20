// src/constants/db-mapping.ts

// Mapeamento para o campo 'type' (Tipo)
export const TYPE_DB_TO_CODE = {
    'Entrada': 'income',
    'Saída': 'expense',
} as const; // O 'as const' ajuda o TypeScript a inferir tipos literais.

// Mapeamento para o campo 'status' (Status)
export const STATUS_DB_TO_CODE = {
    'Pendente': 'pending',
    'Pago': 'paid',
} as const;

// Tipos de ajuda para o TypeScript (opcional, mas bom)
export type DbType = keyof typeof TYPE_DB_TO_CODE;    
export type CodeType = typeof TYPE_DB_TO_CODE[DbType];

export type DbStatus = keyof typeof STATUS_DB_TO_CODE;    
export type CodeStatus = typeof STATUS_DB_TO_CODE[DbStatus];