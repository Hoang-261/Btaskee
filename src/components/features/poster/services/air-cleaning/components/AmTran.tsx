"use client";

import { Grid, Image, NumberInput, Stack, Title } from "@mantine/core";
import React from "react";

import { Controller, useFormContext } from "react-hook-form";

import AmTranImg from "@assets/images/air/am-tran.jpg";

import { Switch } from "@/components/shared/inputs/Switch";
import { AirCleaningInputType } from "../types";

export const AmTran = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<AirCleaningInputType>();

  return (
    <>
      <Image
        src={AmTranImg.src}
        style={{
          width: "100%",
          height: "auto",
          maxWidth: "300px",
          margin: "0 auto 24px",
        }}
        alt="am-tran"
      />

      <Grid
        style={{
          border: "1px solid #E4E7EB",
          borderRadius: 4,
          padding: "12px",
        }}
      >
        <Grid.Col
          span={{
            md: 6,
            base: 12,
          }}
        >
          <Stack>
            <Title order={5}>Dưới 3HP</Title>

            <Controller
              name="am_tran_lt_3hp"
              control={control}
              render={({ field: { onChange, value } }) => (
                <NumberInput
                  label={"Số lượng"}
                  placeholder={"Nhập Số lượng"}
                  value={value}
                  min={0}
                  onChange={onChange}
                  error={errors.treo_tuong_lt_2hp?.message as string}
                />
              )}
            />

            {/* <Controller
              control={control}
              name="am_tran_lt_3hp_gas"
              render={({ field: { onChange, value } }) => (
                <Switch checked={value} label="Bơm gas" onChange={onChange} />
              )}
            /> */}
          </Stack>
        </Grid.Col>

        <Grid.Col
          span={{
            md: 6,
            base: 12,
          }}
        >
          <Stack>
            <Title order={5}>Trên 3HP</Title>

            <Controller
              name="am_tran_gt_3hp"
              control={control}
              render={({ field: { onChange, value } }) => (
                <NumberInput
                  label={"Số lượng"}
                  placeholder={"Nhập Số lượng"}
                  value={value}
                  min={0}
                  onChange={onChange}
                  error={errors.treo_tuong_gt_2hp?.message as string}
                />
              )}
            />

            {/* <Controller
              control={control}
              name="am_tran_gt_3hp_gas"
              render={({ field: { onChange, value } }) => (
                <Switch checked={value} label="Bơm gas" onChange={onChange} />
              )}
            /> */}
          </Stack>
        </Grid.Col>
      </Grid>
    </>
  );
};
