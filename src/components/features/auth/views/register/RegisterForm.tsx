"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Paper, PasswordInput, Select, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { RegisterInputType, RegisterInputSchema } from "./types";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { request } from "@/libs/request";

export const RegisterForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<RegisterInputType>({
    defaultValues: {
      address: "",
      name: "",
      phone_number: "",
      role: undefined,
      email: "",
      password: "",
      confirm_password: "",
    },
    resolver: zodResolver(RegisterInputSchema),
  });

  const onSubmit = handleSubmit(async (value: RegisterInputType, event) => {
    try {
      event?.preventDefault();
      setLoading(true);

      const { confirm_password, ...rest } = value;

      await request.post("/auth/register", rest);
      notifications.show({
        title: "Đăng ký thành công",
        message: "Chúc mừng bạn đã tạo tài khoản thành công",
        color: "green",
      });
      router.push("/login");
    } catch (error: any) {
      console.log("error", error);
      notifications.show({
        title: "Đã xảy ra lỗi",
        message: error.response.data.message || error.message,
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  });

  return (
    <Paper withBorder shadow="md" p={30} mt={30} radius="md">
      <Controller
        name="name"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput
            withAsterisk
            label={"Tên"}
            placeholder={"Tên bạn"}
            value={value}
            onChange={onChange}
            error={errors.name?.message as string}
          />
        )}
      />

      <Controller
        name="address"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput
            withAsterisk
            label={"Địa chỉ"}
            placeholder={"Địa chỉ của bạn"}
            value={value}
            onChange={onChange}
            error={errors.address?.message as string}
          />
        )}
      />

      <Controller
        name="phone_number"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput
            withAsterisk
            label={"Số điện thoại"}
            placeholder={"Số điện thoại của bạn"}
            value={value}
            onChange={onChange}
            type="number"
            error={errors.phone_number?.message as string}
          />
        )}
      />

      <Controller
        name="email"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput
            withAsterisk
            label={"Email"}
            placeholder={"Nhập email"}
            value={value}
            onChange={onChange}
            error={errors.email?.message as string}
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field: { onChange, value } }) => (
          <PasswordInput
            withAsterisk
            label="Mật khẩu"
            placeholder="Mật khẩu của bạn"
            value={value}
            onChange={onChange}
            error={errors.password?.message as string}
          />
        )}
      />

      <Controller
        name="confirm_password"
        control={control}
        render={({ field: { onChange, value } }) => (
          <PasswordInput
            withAsterisk
            label={"Nhập lại mật khẩu"}
            placeholder={"Nhập lại mật khẩu"}
            value={value}
            onChange={onChange}
            error={errors.confirm_password?.message as string}
          />
        )}
      />

      <Controller
        name="role"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            withAsterisk
            label={"Vai trò"}
            placeholder={"Chọn vai trò của bạn"}
            value={value}
            onChange={onChange}
            data={[
              { value: "JOB_POSTER", label: "Người tuyển dụng" },
              { value: "JOB_SEEKER", label: "Người tìm việc" },
            ]}
            error={errors.role?.message as string}
          />
        )}
      />

      <Button
        fullWidth
        type="submit"
        mt="xl"
        loading={loading}
        onClick={onSubmit}
      >
        Đăng ký
      </Button>
    </Paper>
  );
};
