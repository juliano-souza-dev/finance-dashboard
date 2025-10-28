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
export function normalizeDateToDB(dateStr?: string | null): string {
  // Se vier vazio, nulo ou não for string → retorna vazio
  if (!dateStr || typeof dateStr !== 'string') {
    return '';
  }

  // Remove espaços e caracteres invisíveis
  const cleanDate = dateStr.trim();
  if (!cleanDate) return '';

  // Divide por / ou -
  const parts = cleanDate.split(/[\/\-]/);

  // yyyy-mm-dd → retorna direto
  if (parts[0].length === 4) {
    return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
  }

  // dd/mm/yyyy → converte pra yyyy-mm-dd
  if (parts[2] && parts[0].length === 2) {
    return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
  }

  // Qualquer formato inesperado → retorna original
  return cleanDate;
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
