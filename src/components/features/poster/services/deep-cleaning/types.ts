import { notEmptyMessage } from "@/libs/utils/common";
import { z } from "zod";

export const DeepCleaningInputSchema = z.object({
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

export type DeepCleaningInputType = z.infer<typeof DeepCleaningInputSchema>;

export const BuildingRentalFilterSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
});

export type BuildingRentalFilterType = z.infer<
  typeof BuildingRentalFilterSchema
>;
