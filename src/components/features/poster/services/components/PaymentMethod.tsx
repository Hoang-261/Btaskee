import { PAYMENT_METHOD } from "@/libs/utils/constants";
import { Select } from "@mantine/core";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

export const PaymentMethod = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <Controller
        name="payment_method"
        control={control}
        render={({ field }) => (
          <Select
            withAsterisk
            label="Phương thức thanh toán"
            {...field}
            data={Object.entries(PAYMENT_METHOD).map(([key, value]) => ({
              value: key,
              label: value,
            }))}
            placeholder="Chọn phương thức thanh toán"
            clearable
            error={errors.payment_method?.message as string}
          />
        )}
      />
    </>
  );
};
