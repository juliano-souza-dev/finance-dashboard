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
