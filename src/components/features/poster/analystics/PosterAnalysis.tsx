"use client";

import { Stack, Title } from "@mantine/core";
import React, { useMemo } from "react";
import ReactECharts, { EChartsOption } from "echarts-for-react";
import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "@/libs/hooks/useAxiosAuth";

export const PosterAnalysis = () => {
  const request = useAxiosAuth();

  const { isLoading, data } = useQuery<
    {
      month: string;
      amount: number;
    }[]
  >({
    queryKey: ["PosterAnalysis"],
    queryFn: async () => {
      const res = await request.get<{ [key: string]: number }>(
        `/users/analysis`
      );

      const format = Object.entries(res.data).map(([month, amount]) => ({
        month,
        amount,
      }));

      return format;
    },
  });

  const option: EChartsOption = useMemo(() => {
    return {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
      },
      grid: {
        right: "20%",
      },
      toolbox: {
        feature: {
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      legend: {
        data: ["Số tiền đã trả"],
      },
      xAxis: [
        {
          type: "category",
          axisTick: {
            alignWithLabel: true,
          },
          // prettier-ignore
          data: data?.length ? data.map((item) => item.month) : [],
        },
      ],
      yAxis: [
        {
          type: "value",
          name: "Số tiền đã trả",
          position: "left",
          alignTicks: true,
          axisLine: {
            show: true,
          },
          axisLabel: {
            formatter: "{value}",
          },
        },
      ],
      series: [
        {
          name: "Số tiền",
          type: "bar",
          data: data?.length ? data.map((item) => item.amount) : [],
        },
      ],
    };
  }, [data]);

  return (
    <Stack align="center">
      <ReactECharts
        option={option}
        style={{
          height: 500,
          width: "100%",
        }}
        showLoading={isLoading}
      />

      <Title order={5}>Biểu đồ thống kê số tiền đã trả</Title>
    </Stack>
  );
};
