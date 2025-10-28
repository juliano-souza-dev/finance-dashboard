import { env } from "@/env";
import { getGoogleSheetsClient } from "../google-sheet-api";
import { Transaction } from "@/types";
import { sheets_v4 } from "googleapis";
import { TransactionsRepository } from "../repositories/TransactionsRepository";
import { HEADER_SHEETS_TO_CODE, HeaderEN, HeaderPT } from "@/constants/db-mapping";
import { normalizeDateToDB} from "../helpers/date-normalize-helper";


import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export class GoogleSheetService {

    private sheetID: string;
    private range: string;
    private sheetAPI!: sheets_v4.Sheets;
    private transactionsRepository: TransactionsRepository;
    constructor() {
        this.sheetID = env.spreadsheetId;
        this.range = 'Transactions!A1:G500'
        this.transactionsRepository = new TransactionsRepository();
        this.openConnectionWithAPI();
    }


    private async ensureConnection() {
        
    if (!this.sheetAPI) {
      this.sheetAPI = await getGoogleSheetsClient();
    }
  }

    private async openConnectionWithAPI() {
        this.sheetAPI = await getGoogleSheetsClient();
    }

async fetchAll() {
  await this.ensureConnection();

  const { data } = await this.sheetAPI.spreadsheets.values.get({
    spreadsheetId: this.sheetID,
    range: this.range,
  });

  // Garante que values seja um array
  const values = data?.values ?? [];
  if (!values.length) {
    console.warn('Nenhum dado encontrado na planilha.');
    return [];
  }

  // Extrai o cabeçalho e remove linhas totalmente vazias
  const headers: string[] = values.shift() ?? [];
  const rows = values.filter(
    (row) => Array.isArray(row) && row.some((cell) => String(cell ?? '').trim() !== '')
  );

  // Mapeia para JSON
  const transactionsInJson = rows
    .map((row) => {
      // Ignora linhas com menos colunas que o cabeçalho
      if (row.length < headers.length) return null;

      const obj = Object.fromEntries(
        headers.map((key, i) => {
          const mappedKey = HEADER_SHEETS_TO_CODE[key as HeaderPT];
          let cellValue: string | number = row[i] ?? '';

          // Normaliza data
          if (mappedKey === 'date') {
            cellValue = normalizeDateToDB(String(cellValue));
            return [mappedKey, cellValue];
          }

          // Converte valor numérico
          if (mappedKey === 'value') {
            const numeric = Number(
              String(cellValue).replace(/[^\d,.-]/g, '').replace(',', '.')
            );
            return [mappedKey, isNaN(numeric) ? 0 : numeric];
          }

          // Campos padrão
          return [mappedKey ?? key, String(cellValue ?? '').trim()];
        })
      );

      // Validação: ignora registros sem descrição, valor ou data
      if (!obj['description'] || !obj['date'] || !obj['value']) return null;

      return obj;
    })
    .filter(Boolean) as Transaction[];

  if (transactionsInJson.length > 0) {
    this.transactionsRepository.saveToCache(transactionsInJson);
  } else {
    console.warn('Nenhuma transação válida encontrada no Sheets.');
  }

  return transactionsInJson;
}


    async appendTransaction(data: Transaction): Promise<void> {
  // 🔹 Garante formato brasileiro dd/MM/yyyy
  let formattedDate = data.date;
  try {
    const parsed = new Date(data.date);
    if (!isNaN(parsed.getTime())) {
      formattedDate = format(parsed, "dd/MM/yyyy", { locale: ptBR });
    }
  } catch {
    console.warn("Data inválida recebida, mantendo formato original:", data.date);
  }

  const row: (string | number)[] = [
    data.id,
    formattedDate,
    data.description,
    data.category,
    data.value,
    data.type as string,
    data.status as string,
  ];

  await this.sheetAPI.spreadsheets.values.append({
    spreadsheetId: this.sheetID,
    range: "transactions!A:G",
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [row] },
  });
}

  
}