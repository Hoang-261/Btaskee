"use client";

import {
  Box,
  Flex,
  Grid,
  Group,
  Radio,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import React from "react";
import { TotalPrice } from "../components";
import { DateTimePicker } from "@mantine/dates";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import { ChildcareInputSchema, ChildcareInputType } from "./types";
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
import { PayPalButton } from "@/components/shared/buttons/PayPalButton";

export const childcareService = [
  {
    id: 1,
    workingTime: "3",
    price: 225000,
  },
  {
    id: 2,
    workingTime: "4",
    price: 280000,
  },
  {
    id: 3,
    workingTime: "5",
    price: 340000,
  },
  {
    id: 4,
    workingTime: "8",
    price: 525000,
  },
];

export const ageChildcare = [
  {
    id: 1,
    age: "12 tháng - 6 tuổi",
  },
  {
    id: 2,
    age: "7 tuổi - 11 tuổi",
  },
];

export const Childcare = () => {
  const request = useAxiosAuth();
  const router = useRouter();

  const method = useForm<ChildcareInputType>({
    resolver: zodResolver(ChildcareInputSchema),
    defaultValues: {
      service: "",
      start_date: new Date(),
      payment_method: "",
    },
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = method;

  const serviceWatch = useWatch({
    control,
    name: "service",
  });

  const { mutateAsync } = useMutation({
    mutationFn: async ({ data }: { data: ChildcareInputType }) => {
      const childcare = childcareService.find(
        (item) => item.workingTime == serviceWatch
      );

      const description = JSON.stringify({
        "Công việc": "Chăm trẻ theo giờ",
        "Độ tuổi trẻ": data.age,
      });

      const res = await request(`tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        data: {
          name: "",
          description: description,
          status: renderStatusTaskByPayment(data.payment_method),
          type: TypeTask["CHILDCARE"],
          start_date: data.start_date,
          working_time: childcare?.workingTime ? +childcare?.workingTime : 0,
          price: Number(childcare?.price) * 4,
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

  const onSubmit = (data: ChildcareInputType) => {
    console.log(data);

    const childcare = childcareService.find(
      (item) => item.workingTime == serviceWatch
    );

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
                  <Text size={"sm"}>{childcare?.workingTime}h</Text>
                </Flex>
              </Box>

              <Box mt={2}>
                <Title order={6}>Chi tiết công việc</Title>
                <Flex justify={"space-between"}>
                  <Text size={"sm"}>Công việc</Text>
                  <Text size={"sm"}>Chăm trẻ theo giờ</Text>
                </Flex>
                <Flex justify={"space-between"}>
                  <Text size={"sm"}>Độ tuổi trẻ</Text>
                  <Text size={"sm"}>{data.age}</Text>
                </Flex>
              </Box>
            </Box>
          </>
        ),
        price: childcare?.price,
        paymentMethod: data.payment_method,
        onConfirm: () => {
          console.log("Thanh toán", data);
          mutateAsync({ data });
          modals.closeAll();
        },
      },
    });
  };

  return (
    <FormProvider {...method}>
      <Stack>
        <Grid>
          <Grid.Col
            span={{
              md: 6,
              xs: 12,
            }}
          >
            <Controller
              name="service"
              control={control}
              render={({ field }) => (
                <Radio.Group
                  label="Chọn thời lượng"
                  withAsterisk
                  {...field}
                  error={errors.service?.message as string}
                >
                  <Group mt="xs">
                    {childcareService.map((item, index) => (
                      <Radio
                        value={item.workingTime}
                        label={item.workingTime + " giờ"}
                        key={index}
                      />
                    ))}
                  </Group>
                </Radio.Group>
              )}
            />
          </Grid.Col>

          <Grid.Col
            span={{
              md: 6,
              xs: 12,
            }}
          >
            <Controller
              name="age"
              control={control}
              render={({ field }) => (
                <Radio.Group
                  label="Chọn độ tuổi trẻ"
                  withAsterisk
                  {...field}
                  error={errors.age?.message as string}
                >
                  <Group mt="xs">
                    {ageChildcare.map((item, index) => (
                      <Radio value={item.age} label={item.age} key={index} />
                    ))}
                  </Group>
                </Radio.Group>
              )}
            />
          </Grid.Col>

          <Grid.Col
            span={{
              md: 6,
              xs: 12,
            }}
          >
            <Controller
              name="start_date"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  {...field}
                  withAsterisk
                  label="Ngày bắt đầu"
                  placeholder="Chọn ngày giờ"
                  clearable
                  error={errors.start_date?.message}
                />
              )}
            />
          </Grid.Col>

          <Grid.Col
            span={{
              md: 6,
              xs: 12,
            }}
          >
            <PaymentMethod />
          </Grid.Col>
        </Grid>

        <TotalPrice
          onClick={handleSubmit(onSubmit)}
          totalPrice={
            childcareService.find((item) => item.workingTime == serviceWatch)
              ?.price ?? 0
          }
        />
      </Stack>
    </FormProvider>
  );
};
