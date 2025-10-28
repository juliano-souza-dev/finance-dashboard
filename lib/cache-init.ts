// lib/cache-init.ts

import db from './Database';
import { GoogleSheetService } from './services/GoogleSheetService';

let initPromise: Promise<void> | null = null;

/**
 * Garante que o cache esteja pronto:
 * - Se a tabela transactions estiver vazia, puxa do Google Sheets.
 * - Executa apenas uma vez por cold start (singleton).
 */
export function ensureCacheReady(): Promise<void> {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      // conta registros atuais
      const row = db.prepare('SELECT COUNT(*) as c FROM transactions').get() as { c: number };
      const hasData = (row?.c ?? 0) > 0;

      if (!hasData) {
        console.log('🔁 Cache vazio — sincronizando do Google Sheets...');
        const sheet = new GoogleSheetService();
        await sheet.fetchAll(); // salva no repo/local cache
        console.log('✅ Cache preenchido a partir do Sheets.');
      } else {
        // opcional: validar categorias, etc.
        // const cat = db.prepare('SELECT COUNT(*) as c FROM categories').get() as { c: number };
        // if ((cat?.c ?? 0) === 0) { ... }
      }
    } catch (err) {
      console.error('❌ Falha ao garantir cache:', err);
      // não propaga erro para não derrubar a rota; seu fluxo continua
    }
  })();

  return initPromise;
}
