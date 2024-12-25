import { notEmptyMessage } from "@/libs/utils/common";
import { z } from "zod";

export const WashingMachineInputSchema = z.object({
  cua_tren_gt_9kg: z
    .number()
    .min(0, {
      message: notEmptyMessage("Cửa trên từ 9kg trở lên"),
    })
    .optional(),
  cua_tren_gt_9kg_thao_long: z.boolean().optional(),
  cua_tren_lt_9kg: z
    .number()
    .min(0, {
      message: notEmptyMessage("Cửa trên dưới 9kg"),
    })
    .optional(),
  cua_tren_lt_9kg_thao_long: z.boolean().optional(),

  cua_truoc_gt_9kg: z
    .number()
    .min(0, {
      message: notEmptyMessage("Cửa trước từ 9kg trở lên"),
    })
    .optional(),
  cua_truoc_gt_9kg_thao_long: z.boolean().optional(),
  cua_truoc_lt_9kg: z
    .number()
    .min(0, {
      message: notEmptyMessage("Cửa trước dưới 9kg"),
    })
    .optional(),
  cua_truoc_lt_9kg_thao_long: z.boolean().optional(),

  start_date: z.date().min(new Date(0), {
    message: notEmptyMessage("Ngày bắt đầu"),
  }),
  payment_method: z.string().min(1, {
    message: notEmptyMessage("Phương thức thanh toán"),
  }),
});

export type WashingMachineInputType = z.infer<typeof WashingMachineInputSchema>;
