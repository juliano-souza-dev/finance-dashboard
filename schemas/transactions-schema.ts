import { z } from "zod";

export const TransactionSchema = z.object({
  id: z.string().optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de data inválido. Use YYYY-MM-DD."),
  description: z
    .string()
    .min(3, "A Descrição deve ter pelo menos 3 caracteres."),
  category: z.string().min(1, "A categoria é obrigatória."),
  value: z.number().positive("O valor deve ser um número positivo."),
  type: z.enum(["Entrada", "Saída"], {
    message: "A entrada deve  ser Entrada ou Saída",
  }),
  status: z.enum(["Pago", "Pendente"], {
    message: "O tipo deve ser Pago ou `Pendente",
  }),
});

export type Transaction = z.infer<typeof TransactionSchema>;
