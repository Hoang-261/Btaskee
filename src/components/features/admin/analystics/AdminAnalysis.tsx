"use client";

import { Button, Flex, Stack, Title, rem } from "@mantine/core";
import React, { useMemo, useState } from "react";
import ReactECharts, { EChartsOption } from "echarts-for-react";
import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "@/libs/hooks/useAxiosAuth";
import { MonthPickerInput } from "@mantine/dates";
import { IconCalendar } from "@tabler/icons-react";

export const AdminAnalysis = () => {
  const request = useAxiosAuth();
  const [value, setValue] = useState<Date | null>(new Date(Date.now()));

  const [role, setRole] = useState<"JOB_POSTER" | "JOB_SEEKER">("JOB_POSTER");

  const { isLoading, data } = useQuery<
    {
      name: string;
      total: number;
    }[]
  >({
    queryKey: ["AdminAnalysis", value, role],
    queryFn: async () => {
      const res = await request.get(`/users/analysis/admin`, {
        params: {
          month: value && `${value?.getMonth() + 1}-${value?.getFullYear()}`,
          role: role,
        },
      });

      return res.data;
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
        data: ["Số tiền đã nhận"],
      },
      xAxis: [
        {
          type: "category",
          axisTick: {
            alignWithLabel: true,
          },
          // prettier-ignore
          data: data?.length ? data.map((item) => item.name) : [],
        },
      ],
      yAxis: [
        {
          type: "value",
          name: "Số tiền đã nhận",
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
          data: data?.length ? data.map((item) => item.total) : [],
        },
      ],
    };
  }, [data]);

  return (
    <Stack align="center">
      <Flex gap={12}>
        <Flex gap={12}>
          <Button
            onClick={() => setRole("JOB_POSTER")}
            disabled={role == "JOB_POSTER"}
          >
            Người đăng việc
          </Button>
          <Button
            onClick={() => setRole("JOB_SEEKER")}
            disabled={role == "JOB_SEEKER"}
          >
            Người tìm việc
          </Button>
        </Flex>

        <MonthPickerInput
          value={value}
          onChange={setValue}
          leftSection={
            <IconCalendar
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          }
          leftSectionPointerEvents="none"
        />
      </Flex>

      <ReactECharts
        option={option}
        style={{
          height: 500,
          width: "100%",
        }}
        showLoading={isLoading}
      />

      <Title order={5}>
        Biểu đồ thống kê số tiền {role === "JOB_POSTER" ? "đã nhận" : "đã trả"}
      </Title>
    </Stack>
  );
};
