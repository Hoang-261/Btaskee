import { notEmptyMessage } from "@/libs/utils/common";
import { z } from "zod";

export const ChildcareInputSchema = z.object({
  age: z.string().min(1, {
    message: notEmptyMessage("Độ tuổi"),
  }),

  service: z.string().min(1, {
    message: notEmptyMessage("Dịch vụ"),
  }),

  start_date: z.date().min(new Date(0), {
    message: notEmptyMessage("Ngày bắt đầu"),
  }),
  payment_method: z.string().min(1, {
    message: notEmptyMessage("Phương thức thanh toán"),
  }),
});

export type ChildcareInputType = z.infer<typeof ChildcareInputSchema>;
