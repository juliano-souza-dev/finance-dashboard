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


    async fetchAll(): Promise<void/*Transaction[]*/> {

        await this.ensureConnection();
        const {data} = await this.sheetAPI.spreadsheets.values.get({
            spreadsheetId: this.sheetID,
            range: this.range
        })


    
        const {values} = data ?? [];

        const headers: string[] = values?.shift() ?? []; 
        const rows = values ?? []; 
        

        const transactionsInJson = rows.map(row =>
        
        Object.fromEntries(
       
        headers.map((key, i) => {

        let cellValue: String | number = "";

        const mappedKey = HEADER_SHEETS_TO_CODE[key as HeaderPT];
              if (mappedKey == 'date') {
              cellValue = normalizeDateToDB(row[i])
              console.log(cellValue)
              return [mappedKey ?? key, cellValue];
    
  }
    if(mappedKey == "value") {
      cellValue = Number(
        String(row[i])
            .replace(/[^\d,.-]/g, '') 
            .replace(',', '.')     
    );

    
            
return [mappedKey ?? key, cellValue];
        }
  
        return [mappedKey ?? key, row[i]];
        })
    )
    );
        
     this.transactionsRepository.saveToCache(transactionsInJson as Transaction[]);
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