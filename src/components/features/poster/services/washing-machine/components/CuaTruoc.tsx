"use client";

import { Grid, Image, NumberInput, Stack, Title } from "@mantine/core";
import React from "react";

import { Controller, useFormContext } from "react-hook-form";

import CuaTruocImg from "@assets/images/washing-machine/cua-truoc.jpeg";

import { Switch } from "@/components/shared/inputs/Switch";
import { WashingMachineInputType } from "../types";

export const CuaTruoc = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<WashingMachineInputType>();

  return (
    <>
      <Image
        src={CuaTruocImg.src}
        style={{
          width: "100%",
          height: "200px",
          maxWidth: "300px",
          minHeight: "200px",
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
            <Title order={5}>Dưới 9kg</Title>

            <Controller
              name="cua_truoc_lt_9kg"
              control={control}
              render={({ field: { onChange, value } }) => (
                <NumberInput
                  label={"Số lượng"}
                  placeholder={"Nhập Số lượng"}
                  value={value}
                  min={0}
                  onChange={onChange}
                  error={errors.cua_truoc_lt_9kg?.message as string}
                />
              )}
            />

            <Controller
              control={control}
              name="cua_truoc_lt_9kg_thao_long"
              render={({ field: { onChange, value } }) => (
                <Switch checked={value} label="Tháo lồng" onChange={onChange} />
              )}
            />
          </Stack>
        </Grid.Col>

        <Grid.Col
          span={{
            md: 6,
            base: 12,
          }}
        >
          <Stack>
            <Title order={5}>Trên 9kg</Title>

            <Controller
              name="cua_truoc_gt_9kg"
              control={control}
              render={({ field: { onChange, value } }) => (
                <NumberInput
                  label={"Số lượng"}
                  placeholder={"Nhập Số lượng"}
                  value={value}
                  min={0}
                  onChange={onChange}
                  error={errors.cua_truoc_gt_9kg?.message as string}
                />
              )}
            />

            <Controller
              control={control}
              name="cua_truoc_gt_9kg_thao_long"
              render={({ field: { onChange, value } }) => (
                <Switch checked={value} label="Tháo lồng" onChange={onChange} />
              )}
            />
          </Stack>
        </Grid.Col>
      </Grid>
    </>
  );
};
