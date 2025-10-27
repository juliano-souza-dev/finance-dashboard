import { env } from "@/env";
import { getGoogleSheetsClient } from "../google-sheet-api";
import { Transaction } from "@/types";
import { sheets_v4 } from "googleapis";
import { TransactionsRepository } from "../repositories/TransactionsRepository";
import { HEADER_SHEETS_TO_CODE, HeaderEN, HeaderPT } from "@/constants/db-mapping";
import { normalizeDateToDB} from "../helpers/date-normalize-helper";



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

        const row:( String|Number)[] = [
            data.id,
            data.date,
            data.description,
            data.category,
            data.value,
            data.type,
            data.status
        ] 

        this.sheetAPI.spreadsheets.values.append({
            spreadsheetId:this.sheetID,
            range: 'transactions!A:G',
            valueInputOption: "USER_ENTERED",
            requestBody:{values: [row]}

        })
    }

  
}