"use client";

import { Grid, Image, NumberInput, Stack, Title } from "@mantine/core";
import React from "react";

import { Controller, useFormContext } from "react-hook-form";

import TreoTuongImg from "@assets/images/air/treo-tuong.webp";

import { Switch } from "@/components/shared/inputs/Switch";

export const TreoTuong = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <Image
        src={TreoTuongImg.src}
        style={{
          width: "100%",
          height: "auto",
          maxWidth: "300px",
          margin: "0 auto 24px",
        }}
        alt="treo-tuong"
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
            <Title order={5}>Dưới 2HP</Title>

            <Controller
              name="treo_tuong_lt_2hp"
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
              name="treo_tuong_lt_2hp_gas"
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
            <Title order={5}>Trên 2HP</Title>

            <Controller
              name="treo_tuong_gt_2hp"
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
              name="treo_tuong_gt_2hp_gas"
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
