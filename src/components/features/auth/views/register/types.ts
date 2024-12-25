import { notEmptyMessage } from "@/libs/utils/common";
import { z } from "zod";

export const RegisterInputSchema = z
  .object({
    name: z.string().min(1, {
      message: notEmptyMessage("Tên"),
    }),

    phone_number: z.string().min(1, {
      message: notEmptyMessage("Số điện thoại"),
    }),

    address: z.string().min(1, {
      message: notEmptyMessage("Địa chỉ"),
    }),

    email: z
      .string()
      .min(1, {
        message: notEmptyMessage("Email"),
      })
      .email({
        message: "Email không hợp lệ",
      }),

    password: z.string().min(6, {
      message: "Mật khẩu phải có ít nhất 6 ký tự",
    }),

    role: z.enum(["JOB_POSTER", "JOB_SEEKER"]),

    confirm_password: z.string().min(6, {
      message: "Mật khẩu phải có ít nhất 6 ký tự",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.confirm_password !== data.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Mật khẩu xác nhận không khớp",
        path: ["confirm_password"],
      });
    }
  });

export type RegisterInputType = z.infer<typeof RegisterInputSchema>;
