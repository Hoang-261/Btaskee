"use client";

import { Grid, Image, NumberInput, Stack, Text, Title } from "@mantine/core";
import React from "react";

import { Controller, useFormContext } from "react-hook-form";

import TuDungImg from "@assets/images/air/tu-dung.jpg";

import { AirCleaningInputType } from "../types";

export const TuDung = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<AirCleaningInputType>();

  return (
    <>
      <Image
        src={TuDungImg.src}
        style={{
          width: "100%",
          height: "auto",
          maxWidth: "300px",
          margin: "0 auto 24px",
        }}
        alt="tu-dung"
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
            <Title order={5}>Tủ đứng</Title>

            <Controller
              name="tu_dung"
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
              name="tu_dung_gas"
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
