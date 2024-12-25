"use client";

import { Grid, Stack, Title } from "@mantine/core";
import React from "react";
import HouseCleaning from "@assets/images/house_cleaning.png";
import DeepCleaning from "@assets/images/deep_cleaning.png";
import AirCleaning from "@assets/images/air_cleaning.png";
import Childcare from "@assets/images/childcare.png";
import WashingMachine from "@assets/images/washing-machine.png";
import Heater from "@assets/images/heater.png";
import { CardService } from "./components/CardService";
import { getRole } from "@/libs/utils/authUtils";

const DATA = [
  {
    title: "Dọn dẹp nhà",
    image: HouseCleaning,
    url: "house-cleaning",
    isNew: false,
  },
  {
    title: "Tổng vệ sinh",
    image: DeepCleaning,
    url: "deep-cleaning",
    isNew: false,
  },
  {
    title: "Vệ sinh máy lạnh",
    image: AirCleaning,
    url: "air-cleaning",
    isNew: false,
  },
  {
    title: "Trông trẻ",
    image: Childcare,
    url: "childcare",
    isNew: true,
  },
  {
    title: "Vệ sinh máy giặt",
    image: WashingMachine,
    url: "washing-machine",
    isNew: false,
  },
  {
    title: "Vệ sinh bình nóng lạnh",
    image: Heater,
    url: "heater",
    isNew: false,
  },
];

export const Home = () => {
  return (
    <Stack>
      <Title>Lựa chọn dịch vụ</Title>

      <Grid>
        {DATA.map((item, index) => (
          <Grid.Col
            span={{
              lg: 2.4,
              md: 4,
              xs: 6,
            }}
            key={index}
          >
            <CardService
              key={index}
              image={item.image.src}
              title={item.title}
              url={item.url}
              isNew={item.isNew}
            />
          </Grid.Col>
        ))}
      </Grid>
    </Stack>
  );
};
