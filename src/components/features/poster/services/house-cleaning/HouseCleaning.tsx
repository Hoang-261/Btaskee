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
import { HouseCleaningInputSchema, HouseCleaningInputType } from "./types";
import { zodResolver } from "@hookform/resolvers/zod";
import { PaymentMethod } from "../components/PaymentMethod";
import { modals } from "@mantine/modals";
import { format } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import { StatusTask, TypeTask } from "@/libs/utils/constants";
import useAxiosAuth from "@/libs/hooks/useAxiosAuth";
import { useRouter } from "next/navigation";
import { renderStatusTaskByPayment } from "@/libs/utils/common";
import { notifications } from "@mantine/notifications";
import { PayPalButton } from "@/components/shared/buttons/PayPalButton";

export const HouseCleaningService = [
  {
    id: 1,
    workingTime: "2",
    description: "55m2 / 2 phòng",
    price: 176000,
  },
  {
    id: 2,
    workingTime: "3",
    description: "85m2 / 3 phòng",
    price: 219000,
  },
  {
    id: 3,
    workingTime: "4",
    description: "105m2 / 4 phòng",
    price: 278000,
  },
];

export const HouseCleaning = () => {
  const request = useAxiosAuth();
  const router = useRouter();

  const method = useForm<HouseCleaningInputType>({
    resolver: zodResolver(HouseCleaningInputSchema),
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
    mutationFn: async ({ data }: { data: HouseCleaningInputType }) => {
      const houseCleaning = HouseCleaningService.find(
        (item) => item.workingTime == serviceWatch
      );

      const description = JSON.stringify({
        "Khối lượng công việc": houseCleaning?.description ?? "",
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
          type: TypeTask["HOUSE_CLEANING"],
          start_date: data.start_date,
          working_time: houseCleaning?.workingTime
            ? +houseCleaning?.workingTime
            : 0,
          price: Number(houseCleaning?.price) * 4,
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

  const onSubmit = (data: HouseCleaningInputType) => {
    const houseCleaning = HouseCleaningService.find(
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
                  <Text size={"sm"}>{houseCleaning?.workingTime}h</Text>
                </Flex>
              </Box>

              <Box mt={2}>
                <Title order={6}>Chi tiết công việc</Title>
                <Flex justify={"space-between"}>
                  <Text size={"sm"}>Khối lượng công việc</Text>
                  <Text size={"sm"}>{houseCleaning?.description}</Text>
                </Flex>
              </Box>
            </Box>
          </>
        ),
        paymentMethod: data.payment_method,
        price: houseCleaning?.price,
        onConfirm: () => {
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
            <Title order={5}>Thời lượng</Title>
            <Text>Vui lòng ước tính chính xác diện tích cần dọn dẹp</Text>

            <Controller
              name="service"
              render={({ field }) => (
                <Radio.Group
                  label="Chọn thời lượng"
                  withAsterisk
                  {...field}
                  error={errors.service?.message as string}
                >
                  <Group mt="xs">
                    {HouseCleaningService.map((item, index) => (
                      <Radio
                        value={item.workingTime}
                        label={item.workingTime + " giờ"}
                        description={item.description}
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
            <Title order={5}>Thời gian làm việc</Title>
            <Text>Chọn ngày giờ</Text>

            <Controller
              name="start_date"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  {...field}
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
            HouseCleaningService.find(
              (item) => item.workingTime == serviceWatch
            )?.price ?? 0
          }
        />
      </Stack>
    </FormProvider>
  );
};
