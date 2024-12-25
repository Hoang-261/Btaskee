"use client";

import {
  Box,
  Flex,
  Grid,
  Image,
  Stack,
  Tabs,
  Text,
  Title,
} from "@mantine/core";
import React, { useState } from "react";
import { TotalPrice } from "../components";
import { DateTimePicker } from "@mantine/dates";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { AirCleaningInputSchema, AirCleaningInputType } from "./types";
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
import { TreoTuong } from "./components/TreoTuong";
import { TuDung } from "./components/TuDung";
import { AmTran } from "./components/AmTran";
import { PayPalButton } from "@/components/shared/buttons/PayPalButton";

interface MutateInput extends AirCleaningInputType {
  description: string;
  workingTime: number;
}

export const AirCleaningService = {
  "treo-tuong": {
    "lt-2hp": {
      cleaning: 250000,
      gas: 200000,
    },
    "gt-2hp": {
      cleaning: 275000,
      gas: 250000,
    },
  },
  "tu-dung": {
    cleaning: 330000,
    gas: 270000,
  },
  "am-tran": {
    "lt-3hp": {
      cleaning: 1000000,
      gas: 300000,
    },
    "gt-3hp": {
      cleaning: 1050000,
      gas: 350000,
    },
  },
};

export const AirCleaning = () => {
  const request = useAxiosAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "treo-tuong" | "tu-dung" | "am-tran"
  >("treo-tuong");

  const method = useForm<AirCleaningInputType>({
    resolver: zodResolver(AirCleaningInputSchema),
    defaultValues: {
      am_tran_gt_3hp: 0,
      am_tran_gt_3hp_gas: false,
      am_tran_lt_3hp: 0,
      am_tran_lt_3hp_gas: false,

      treo_tuong_gt_2hp: 0,
      treo_tuong_gt_2hp_gas: false,
      treo_tuong_lt_2hp: 0,
      treo_tuong_lt_2hp_gas: false,

      tu_dung: 0,
      tu_dung_gas: false,

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

    if (data.treo_tuong_lt_2hp) {
      total +=
        data.treo_tuong_lt_2hp *
        AirCleaningService["treo-tuong"]["lt-2hp"].cleaning;
      if (data.treo_tuong_lt_2hp_gas) {
        total +=
          data.treo_tuong_lt_2hp *
          AirCleaningService["treo-tuong"]["lt-2hp"].gas;
      }
    }

    if (data.treo_tuong_gt_2hp) {
      total +=
        data.treo_tuong_gt_2hp *
        AirCleaningService["treo-tuong"]["gt-2hp"].cleaning;
      if (data.treo_tuong_gt_2hp_gas) {
        total +=
          data.treo_tuong_gt_2hp *
          AirCleaningService["treo-tuong"]["gt-2hp"].gas;
      }
    }

    if (data.tu_dung) {
      total += data.tu_dung * AirCleaningService["tu-dung"].cleaning;
      if (data.tu_dung_gas) {
        total += data.tu_dung * AirCleaningService["tu-dung"].gas;
      }
    }

    if (data.am_tran_lt_3hp) {
      total +=
        data.am_tran_lt_3hp * AirCleaningService["am-tran"]["lt-3hp"].cleaning;
      if (data.am_tran_lt_3hp_gas) {
        total +=
          data.am_tran_lt_3hp * AirCleaningService["am-tran"]["lt-3hp"].gas;
      }
    }

    if (data.am_tran_gt_3hp) {
      total +=
        data.am_tran_gt_3hp * AirCleaningService["am-tran"]["gt-3hp"].cleaning;
      if (data.am_tran_gt_3hp_gas) {
        total +=
          data.am_tran_gt_3hp * AirCleaningService["am-tran"]["gt-3hp"].gas;
      }
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
          type: TypeTask["AIR_CONDITIONER_CLEANING"],
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

  const onSubmit = (data: AirCleaningInputType) => {
    const workingDetailHtml: string[] = [];
    let workingTime = 0;

    if (Number(data.treo_tuong_lt_2hp) > 0) {
      workingTime += calcWorkingTime(
        Number(data.treo_tuong_lt_2hp),
        !!data.treo_tuong_lt_2hp_gas
      );

      workingDetailHtml.push(
        `Treo tường dưới 2HP: Vệ sinh${
          data.treo_tuong_lt_2hp_gas ? ", Bơm Gas" : ""
        } ${data.treo_tuong_lt_2hp} máy`
      );
    }

    if (Number(data.treo_tuong_gt_2hp) > 0) {
      workingTime += calcWorkingTime(
        Number(data.treo_tuong_gt_2hp),
        !!data.treo_tuong_gt_2hp_gas
      );

      workingDetailHtml.push(
        `Treo tường trên 2HP: Vệ sinh${
          data.treo_tuong_gt_2hp_gas ? ", Bơm Gas" : ""
        } ${data.treo_tuong_gt_2hp} máy`
      );
    }

    if (Number(data.tu_dung) > 0) {
      workingTime += calcWorkingTime(Number(data.tu_dung), !!data.tu_dung_gas);

      workingDetailHtml.push(
        `Tủ đứng: Vệ sinh${data.tu_dung_gas ? ", Bơm Gas" : ""} ${
          data.tu_dung
        } máy`
      );
    }

    if (Number(data.am_tran_lt_3hp) > 0) {
      workingTime += calcWorkingTime(
        Number(data.am_tran_lt_3hp),
        !!data.am_tran_lt_3hp_gas
      );

      workingDetailHtml.push(
        `Âm trần dưới 3HP: Vệ sinh${
          data.am_tran_lt_3hp_gas ? ", Bơm Gas" : ""
        } ${data.am_tran_lt_3hp} máy`
      );
    }

    if (Number(data.am_tran_gt_3hp) > 0) {
      workingTime += calcWorkingTime(
        Number(data.am_tran_gt_3hp),
        !!data.am_tran_gt_3hp_gas
      );

      workingDetailHtml.push(
        `Âm trần trên 3HP: Vệ sinh${
          data.am_tran_gt_3hp_gas ? ", Bơm Gas" : ""
        } ${data.am_tran_gt_3hp} máy`
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
            <Tabs.Tab value="treo-tuong">Treo tường</Tabs.Tab>
            <Tabs.Tab value="tu-dung">Tủ đứng</Tabs.Tab>
            <Tabs.Tab value="am-tran">Âm trần</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="treo-tuong">
            <TreoTuong />
          </Tabs.Panel>
          <Tabs.Panel value="tu-dung">
            <TuDung />
          </Tabs.Panel>
          <Tabs.Panel value="am-tran">
            <AmTran />
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
