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

export const headerGoogleSheetsMap  = {
  "Descrição": "description",
  "Valor": "value",
  "Data": "date",
  "Tipo": "type",
  "Status": "status"
} as const;

export const HEADER_SHEETS_TO_CODE = {
 "ID": "id",
  "Descrição": "description",
  "Categoria":"category",
  "Valor": "value",
  "Data": "date",
  "Tipo": "type",
  "Status": "status"
} as const

// Tipos de ajuda para o TypeScript (opcional, mas bom)
export type DbType = keyof typeof TYPE_DB_TO_CODE;    
export type CodeType = typeof TYPE_DB_TO_CODE[DbType];

export type DbStatus = keyof typeof STATUS_DB_TO_CODE;    
export type CodeStatus = typeof STATUS_DB_TO_CODE[DbStatus];

export type HeaderPT = keyof typeof HEADER_SHEETS_TO_CODE; 
export type HeaderEN = typeof HEADER_SHEETS_TO_CODE[HeaderPT]