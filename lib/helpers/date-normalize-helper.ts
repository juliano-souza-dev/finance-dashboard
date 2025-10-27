export function normalizeDate(value: string): string {
  const parts = value.split(/[\/\-]/);

  // Se vier no formato YYYY-MM-DD → reorganiza
  if (parts[0].length === 4) {
    const [yyyy, mm, dd] = parts;
    return `${dd}/${mm}/${yyyy}`;
  }

  // Se já vier no formato DD/MM/YYYY → mantém
  if (parts[0].length === 2) {
    const [dd, mm, yyyy] = parts;
    return `${dd}/${mm}/${yyyy}`;
  }

  // fallback, caso venha algo inesperado
  return value;
}
export function normalizeDateToDB(dateStr: string): string {
  // Esperado: "dd/mm/yyyy"
  const parts = dateStr.split(/[\/\-]/);

  // Se vier já no formato yyyy-mm-dd → retorna direto
  if (parts[0].length === 4) {
    return dateStr;
  }

  // Caso venha dd/mm/yyyy → converte
  const [dd, mm, yyyy] = parts;
  return `${yyyy}-${mm}-${dd}`;
}

// Helper: parse seguro de data (DD/MM/YYYY ou ISO)
export function parseDateSafe(input?: string): Date | null {
  if (!input) return null;

  // DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(input)) {
    const [dd, mm, yyyy] = input.split('/').map(Number);
    const d = new Date(yyyy, mm - 1, dd);
    return isNaN(d.getTime()) ? null : d;
  }

  // Tenta ISO/compatível
  const d = new Date(input);
  return isNaN(d.getTime()) ? null : d;
}
