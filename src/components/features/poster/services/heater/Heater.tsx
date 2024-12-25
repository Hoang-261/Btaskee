"use client";

import {
  Box,
  Flex,
  Grid,
  NumberInput,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import React from "react";
import { TotalPrice } from "../components";
import { DateTimePicker } from "@mantine/dates";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { HeaterInputSchema, HeaterInputType } from "./types";
import { zodResolver } from "@hookform/resolvers/zod";
import { PaymentMethod } from "../components/PaymentMethod";
import { modals } from "@mantine/modals";
import { format } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import { TypeTask } from "@/libs/utils/constants";
import useAxiosAuth from "@/libs/hooks/useAxiosAuth";
import { useRouter } from "next/navigation";
import { renderStatusTaskByPayment } from "@/libs/utils/common";
import { notifications } from "@mantine/notifications";
import { calcWorkingTime } from "./components/calculation";
import { PayPalButton } from "@/components/shared/buttons/PayPalButton";

interface MutateInput extends HeaterInputType {
  description: string;
  workingTime: number;
}

export const heaterService = {
  lt_20: {
    cleaning: 294000,
  },
  "21_30": {
    cleaning: 330000,
  },
  "31_40": {
    cleaning: 450000,
  },
};

export const Heater = () => {
  const request = useAxiosAuth();
  const router = useRouter();

  const method = useForm<HeaterInputType>({
    resolver: zodResolver(HeaterInputSchema),
    defaultValues: {
      "21_30": 0,
      "31_40": 0,
      lt_20: 0,
      start_date: new Date(),
      payment_method: "",
    },
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
  } = method;

  const totalPrice = () => {
    const data = watch();

    let total = 0;

    if (data.lt_20) {
      total += data.lt_20 * heaterService["lt_20"].cleaning;
    }

    if (data["21_30"]) {
      total += data["21_30"] * heaterService["21_30"].cleaning;
    }

    if (data["31_40"]) {
      total += data["31_40"] * heaterService["31_40"].cleaning;
    }

    return total;
  };

  const { mutateAsync } = useMutation({
    mutationFn: async ({ data }: { data: MutateInput }) => {
      const res = await request(`tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        data: {
          name: "",
          description: data.description,
          status: renderStatusTaskByPayment(data.payment_method),
          type: TypeTask["HEATER_CLEANING"],
          start_date: data.start_date,
          working_time: data.workingTime,
          price: totalPrice() * 4,
          payment_method: data.payment_method,
        },
      });

      return res.data;
    },
    onSuccess: (data) => {
      if (data.payment_method == "PAYPAL") {
        modals.open({
          title: "Thanh toán",
          children: (
            <>
              <PayPalButton
                taskId={data.id}
                description={data.description}
                name={data.type}
                price={`${data.price}`}
              />
            </>
          ),
          onClose: () => {
            modals.closeAll();
            router.push("/posted-jobs");
          },
        });
      } else {
        notifications.show({
          title: "Đăng việc thành công",
          message: "Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất",
          color: "teal",
        });

        router.push("/posted-jobs");
      }
    },
  });

  const onSubmit = (data: HeaterInputType) => {
    const workingDetailHtml: string[] = [];
    let workingTime = 0;

    if (Number(data.lt_20) > 0) {
      workingTime += calcWorkingTime(Number(data.lt_20), false);

      workingDetailHtml.push(
        `Dung tích dưới 20 lít: Vệ sinh ${data.lt_20} máy`
      );
    }

    if (Number(data["21_30"]) > 0) {
      workingTime += calcWorkingTime(Number(data["21_30"]), false);

      workingDetailHtml.push(
        `Dung tích từ 21-30 lít: Vệ sinh ${data["21_30"]} máy`
      );
    }

    if (Number(data["31_40"]) > 0) {
      workingTime += calcWorkingTime(Number(data["31_40"]), false);

      workingDetailHtml.push(
        `Dung tích từ 21-30 lít: Vệ sinh ${data["31_40"]} máy`
      );
    }

    if (workingTime == 0) {
      notifications.show({
        title: "Thông báo",
        message: "Vui lòng chọn ít nhất 1 loại máy để vệ sinh",
        color: "red",
      });

      return;
    }

    modals.openContextModal({
      modal: "confirmPay",
      title: "Xác nhận và thanh toán",
      centered: true,
      innerProps: {
        modalBody: (
          <>
            <Box
              style={{
                padding: "16px",
                borderRadius: 4,
                border: "1px solid #E4E7EB",
              }}
            >
              <Box>
                <Title order={6}>Thời gian làm việc</Title>
                <Flex justify={"space-between"}>
                  <Text size={"sm"}>Ngày làm việc</Text>
                  <Text size={"sm"}>
                    {format(new Date(data.start_date), "dd/MM/yyyy HH:mm")}
                  </Text>
                </Flex>
                <Flex justify={"space-between"}>
                  <Text size={"sm"}>Thời gian</Text>
                  <Text size={"sm"}>{workingTime.toFixed(2)}h</Text>
                </Flex>
              </Box>

              <Box mt={2}>
                <Title order={6}>Chi tiết công việc</Title>

                {workingDetailHtml.map((item, index) => (
                  <Flex key={index} justify={"space-between"}>
                    <Text size={"sm"}>{item}</Text>
                  </Flex>
                ))}
              </Box>
            </Box>
          </>
        ),
        paymentMethod: data.payment_method,
        price: totalPrice(),
        onConfirm: () => {
          const description = workingDetailHtml.reduce((acc, item) => {
            const [key, value] = item.split(":");

            return {
              ...acc,
              [key]: value,
            };
          }, {});

          const params: MutateInput = {
            ...data,
            description: JSON.stringify(description),
            workingTime,
          };

          mutateAsync({ data: params });
          modals.closeAll();
        },
      },
    });
  };

  return (
    <>
      <FormProvider {...method}>
        <Grid>
          <Grid.Col
            span={{
              base: 12,
              md: 4,
            }}
          >
            <Controller
              name="lt_20"
              control={control}
              render={({ field: { onChange, value } }) => (
                <NumberInput
                  label={"Dung tích dưới 20 lít"}
                  placeholder={"Nhập Số lượng"}
                  value={value}
                  min={0}
                  onChange={onChange}
                />
              )}
            />
          </Grid.Col>

          <Grid.Col
            span={{
              base: 12,
              md: 4,
            }}
          >
            <Controller
              name="21_30"
              control={control}
              render={({ field: { onChange, value } }) => (
                <NumberInput
                  label={"Dung tích từ 21-30 lít"}
                  placeholder={"Nhập Số lượng"}
                  value={value}
                  min={0}
                  onChange={onChange}
                />
              )}
            />
          </Grid.Col>

          <Grid.Col
            span={{
              base: 12,
              md: 4,
            }}
          >
            <Controller
              name="31_40"
              control={control}
              render={({ field: { onChange, value } }) => (
                <NumberInput
                  label={"Dung tích từ 31-40 lít"}
                  placeholder={"Nhập Số lượng"}
                  value={value}
                  min={0}
                  onChange={onChange}
                />
              )}
            />
          </Grid.Col>
        </Grid>

        <Stack>
          <Grid>
            <Grid.Col
              span={{
                md: 6,
                base: 12,
              }}
            >
              <PaymentMethod />
            </Grid.Col>

            <Grid.Col
              span={{
                md: 6,
                base: 12,
              }}
            >
              <Controller
                name="start_date"
                control={control}
                render={({ field }) => (
                  <DateTimePicker
                    withAsterisk
                    {...field}
                    label="Ngày bắt đầu"
                    placeholder="Chọn ngày giờ"
                    clearable
                    error={errors.start_date?.message}
                  />
                )}
              />
            </Grid.Col>
          </Grid>

          <TotalPrice
            onClick={handleSubmit(onSubmit)}
            totalPrice={totalPrice() ?? 0}
          />
        </Stack>
      </FormProvider>
    </>
  );
};
