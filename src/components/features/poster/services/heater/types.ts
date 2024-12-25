import { notEmptyMessage } from "@/libs/utils/common";
import { z } from "zod";

export const HeaterInputSchema = z.object({
  lt_20: z.number().optional(),
  "21_30": z.number().optional(),
  "31_40": z.number().optional(),

  start_date: z.date().min(new Date(0), {
    message: notEmptyMessage("Ngày bắt đầu"),
  }),
  payment_method: z.string().min(1, {
    message: notEmptyMessage("Phương thức thanh toán"),
  }),
});

export type HeaterInputType = z.infer<typeof HeaterInputSchema>;
