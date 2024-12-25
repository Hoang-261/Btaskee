import { notEmptyMessage } from "@/libs/utils/common";
import { z } from "zod";

export const AirCleaningInputSchema = z.object({
  treo_tuong_gt_2hp: z
    .number()
    .min(0, {
      message: notEmptyMessage("Treo tường công suất trên 2HP"),
    })
    .optional(),
  treo_tuong_gt_2hp_gas: z.boolean().optional(),
  treo_tuong_lt_2hp: z
    .number()
    .min(0, {
      message: notEmptyMessage("Treo tường công suất dưới 2HP"),
    })
    .optional(),
  treo_tuong_lt_2hp_gas: z.boolean().optional(),

  tu_dung: z
    .number()
    .min(0, { message: notEmptyMessage("Tủ đứng") })
    .optional(),
  tu_dung_gas: z.boolean().optional(),

  am_tran_gt_3hp: z
    .number()
    .min(0, {
      message: notEmptyMessage("Âm trần công suất trên 3HP"),
    })
    .optional(),
  am_tran_gt_3hp_gas: z.boolean().optional(),

  am_tran_lt_3hp: z
    .number()
    .min(0, {
      message: notEmptyMessage("Âm trần công suất dưới 3HP"),
    })
    .optional(),
  am_tran_lt_3hp_gas: z.boolean().optional(),

  start_date: z.date().min(new Date(0), {
    message: notEmptyMessage("Ngày bắt đầu"),
  }),
  payment_method: z.string().min(1, {
    message: notEmptyMessage("Phương thức thanh toán"),
  }),
});

export type AirCleaningInputType = z.infer<typeof AirCleaningInputSchema>;
