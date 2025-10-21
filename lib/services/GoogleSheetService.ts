import { env } from "@/env";
import { getGoogleSheetsClient } from "../google-sheet-api";
import { Transaction } from "@/types";
import { sheets_v4 } from "googleapis";
import { TransactionsRepository } from "../repositories/TransactionsRepository";
import { HEADER_SHEETS_TO_CODE, HeaderEN, HeaderPT } from "@/constants/db-mapping";


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

    private async openConnectionWithAPI() {
        this.sheetAPI = await getGoogleSheetsClient();
    }


    async fetchAll(): Promise<void/*Transaction[]*/> {

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
              
    const parts = String(row[i]).split(/[\/\-]/); 
    if (parts.length == 3) {
      const [day, month, year] = parts.map((p) => p.padStart(2, '0'));
      cellValue = `${year}-${month}-${day}`;
     return [mappedKey ?? key, cellValue];
    }
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

  
}