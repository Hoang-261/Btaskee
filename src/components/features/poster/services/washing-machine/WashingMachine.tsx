"use client";

import { Box, Flex, Grid, Stack, Tabs, Text, Title } from "@mantine/core";
import React, { useState } from "react";
import { TotalPrice } from "../components";
import { DateTimePicker } from "@mantine/dates";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { WashingMachineInputSchema, WashingMachineInputType } from "./types";
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
import { CuaTren } from "./components/CuaTren";
import { CuaTruoc } from "./components/CuaTruoc";
import { PayPalButton } from "@/components/shared/buttons/PayPalButton";

interface MutateInput extends WashingMachineInputType {
  description: string;
  workingTime: number;
}

export const WashingMachineService = {
  "cua-tren": {
    "lt-9kg": {
      cleaning: 300000,
      thao_long: 50000,
    },
    "gt-9kg": {
      cleaning: 350000,
      thao_long: 50000,
    },
  },

  "cua-truoc": {
    "lt-9kg": {
      cleaning: 600000,
      thao_long: 50000,
    },
    "gt-9kg": {
      cleaning: 650000,
      thao_long: 50000,
    },
  },
};

export const WashingMachine = () => {
  const request = useAxiosAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"cua-tren" | "cua-truoc">(
    "cua-tren"
  );

  const method = useForm<WashingMachineInputType>({
    resolver: zodResolver(WashingMachineInputSchema),
    defaultValues: {
      cua_tren_gt_9kg: 0,
      cua_tren_gt_9kg_thao_long: false,
      cua_tren_lt_9kg: 0,
      cua_tren_lt_9kg_thao_long: false,

      cua_truoc_gt_9kg: 0,
      cua_truoc_gt_9kg_thao_long: false,
      cua_truoc_lt_9kg: 0,
      cua_truoc_lt_9kg_thao_long: false,

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

    if (data.cua_tren_gt_9kg) {
      total +=
        data.cua_tren_gt_9kg *
        WashingMachineService["cua-tren"]["gt-9kg"].cleaning;

      if (data.cua_tren_gt_9kg_thao_long) {
        total +=
          data.cua_tren_gt_9kg *
          WashingMachineService["cua-tren"]["gt-9kg"].thao_long;
      }
    }

    if (data.cua_tren_lt_9kg) {
      total +=
        data.cua_tren_lt_9kg *
        WashingMachineService["cua-tren"]["lt-9kg"].cleaning;

      if (data.cua_tren_lt_9kg_thao_long) {
        total +=
          data.cua_tren_lt_9kg *
          WashingMachineService["cua-tren"]["lt-9kg"].thao_long;
      }
    }

    if (data.cua_truoc_gt_9kg) {
      total +=
        data.cua_truoc_gt_9kg *
        WashingMachineService["cua-truoc"]["gt-9kg"].cleaning;

      if (data.cua_truoc_gt_9kg_thao_long) {
        total +=
          data.cua_truoc_gt_9kg *
          WashingMachineService["cua-truoc"]["gt-9kg"].thao_long;
      }
    }

    if (data.cua_truoc_lt_9kg) {
      total +=
        data.cua_truoc_lt_9kg *
        WashingMachineService["cua-truoc"]["lt-9kg"].cleaning;

      if (data.cua_truoc_lt_9kg_thao_long) {
        total +=
          data.cua_truoc_lt_9kg *
          WashingMachineService["cua-truoc"]["lt-9kg"].thao_long;
      }
    }

    return total;
  };

  const { mutateAsync } = useMutation({
    mutationFn: async ({ data }: { data: MutateInput }) => {
      console.log({
        name: "",
        description: data.description,
        status: renderStatusTaskByPayment(data.payment_method),
        type: TypeTask["WASHING_MACHINE_CLEANING"],
        start_date: data.start_date,
        working_time: data.workingTime,
        price: totalPrice,
        payment_method: data.payment_method,
      });

      const res = await request(`tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        data: {
          name: "",
          description: data.description,
          status: renderStatusTaskByPayment(data.payment_method),
          type: TypeTask["WASHING_MACHINE_CLEANING"],
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

  const onSubmit = (data: WashingMachineInputType) => {
    const workingDetailHtml: string[] = [];
    let workingTime = 0;

    if (Number(data.cua_tren_gt_9kg) > 0) {
      workingTime += calcWorkingTime(
        Number(data.cua_tren_gt_9kg),
        !!data.cua_tren_gt_9kg_thao_long
      );

      workingDetailHtml.push(
        `Cửa trên từ 9kg: Vệ sinh${
          data.cua_tren_gt_9kg_thao_long ? ", Tháo lồng" : ""
        } ${data.cua_tren_gt_9kg} máy`
      );
    }

    if (Number(data.cua_tren_lt_9kg) > 0) {
      workingTime += calcWorkingTime(
        Number(data.cua_tren_lt_9kg),
        !!data.cua_tren_lt_9kg_thao_long
      );

      workingDetailHtml.push(
        `Cửa trên dưới 9kg: Vệ sinh${
          data.cua_tren_lt_9kg_thao_long ? ", Tháo lồng" : ""
        } ${data.cua_tren_lt_9kg} máy`
      );
    }

    if (Number(data.cua_truoc_gt_9kg) > 0) {
      workingTime += calcWorkingTime(
        Number(data.cua_truoc_gt_9kg),
        !!data.cua_truoc_gt_9kg_thao_long
      );

      workingDetailHtml.push(
        `Cửa trước từ 9kg: Vệ sinh${
          data.cua_truoc_gt_9kg_thao_long ? ", Tháo lồng" : ""
        } ${data.cua_truoc_gt_9kg} máy`
      );
    }

    if (Number(data.cua_truoc_lt_9kg) > 0) {
      workingTime += calcWorkingTime(
        Number(data.cua_truoc_lt_9kg),
        !!data.cua_truoc_lt_9kg_thao_long
      );

      workingDetailHtml.push(
        `Cửa trước dưới 9kg: Vệ sinh${
          data.cua_truoc_lt_9kg_thao_long ? ", Tháo lồng" : ""
        } ${data.cua_truoc_lt_9kg} máy`
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
        <Tabs
          variant="pills"
          value={activeTab}
          onChange={(e) => setActiveTab(e as any)}
        >
          <Tabs.List
            style={{
              justifyContent: "center",
              marginBottom: "24px",
            }}
          >
            <Tabs.Tab value="cua-tren">Cửa trên</Tabs.Tab>
            <Tabs.Tab value="cua-truoc">Cửa trước</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="cua-tren">
            <CuaTren />
          </Tabs.Panel>
          <Tabs.Panel value="cua-truoc">
            <CuaTruoc />
          </Tabs.Panel>
        </Tabs>

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
