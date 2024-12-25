import { notEmptyMessage } from "@/libs/utils/common";
import { z } from "zod";

const roleSchema = z.enum(["JOB_POSTER", "JOB_SEEKER"]);

export const UserInputSchema = z.object({
  name: z.string().min(1, {
    message: notEmptyMessage("Tên"),
  }),
  email: z
    .string()
    .email({
      message: "Email không hợp lệ",
    })
    .min(1, {
      message: notEmptyMessage("Email"),
    }),
  phone_number: z.string().min(1, {
    message: notEmptyMessage("Số điện thoại"),
  }),
  password: z.string().min(6, {
    message: "Mật khẩu phải có ít nhất 6 ký tự",
  }),
  role: roleSchema,
});

export type UserInputType = z.infer<typeof UserInputSchema>;
export type RoleType = z.infer<typeof roleSchema>;
