"use client";

import { Box, Button, Flex, Stack, Text, Title } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { ITask } from "@/libs/types/task";
import { format } from "date-fns";
import { SERVICES, STATUS_TASK, StatusTask } from "@/libs/utils/constants";

import useAxiosAuth from "@/libs/hooks/useAxiosAuth";
import { notifications } from "@mantine/notifications";
import { formatCurrency } from "@/libs/utils/common";

export const ApplyJobSeekerDetail = () => {
  const { id } = useParams();
  const request = useAxiosAuth();
  const router = useRouter();

  const { data, isLoading } = useQuery<ITask>({
    queryKey: ["tasks", id],
    queryFn: async () => {
      const res = await request.get(`/tasks/${id}`);
      return res.data;
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      await request.post(`/tasks/complete/${id}`);
    },
    onSuccess: async () => {
      notifications.show({
        title: "Công việc đã hoàn thành",
        message: "Chúc mừng bạn đã hoàn thành công việc!",
        color: "teal",
      });

      router.back();

      const recommend = await request.get("/tasks/recommend");

      console.log("recommend", recommend);

      if (recommend.data.data.length > 0) {
        notifications.show({
          title: "Công việc gợi ý",
          message: "Có công việc mới phù hợp với bạn. Hãy kiểm tra ngay!",
          color: "teal",
        });

        const index = Math.floor(Math.random() * recommend.data.data.length);

        router.push(
          `/seeker/posted-jobs/detail/${recommend.data.data[index].id}`
        );
      }
    },
  });

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Stack
          style={{
            maxWidth: "500px",
          }}
        >
          <Title order={3}>
            {SERVICES[data?.type as keyof typeof SERVICES] || "Dịch vụ"}
          </Title>

          <Box
            style={{
              padding: "16px",
              borderRadius: 4,
              border: "1px solid #E4E7EB",
              width: "100%",
            }}
          >
            <Box>
              <Title order={6}>Thời gian làm việc</Title>
              <Flex justify={"space-between"}>
                <Text size={"sm"}>Ngày làm việc</Text>

                {data?.start_date && (
                  <Text size={"sm"}>
                    {format(new Date(data?.start_date), "dd/MM/yyyy HH:mm")}
                  </Text>
                )}
              </Flex>
              <Flex justify={"space-between"}>
                <Text size={"sm"}>Thời gian</Text>
                <Text size={"sm"}>{data?.working_time}h</Text>
              </Flex>
            </Box>

            <Box mt={2}>
              <Title order={6}>Chi tiết công việc</Title>

              {data?.description &&
                Object.entries(JSON?.parse(data?.description)).map(
                  ([key, value], index) => (
                    <Flex key={index} justify={"space-between"}>
                      <Text size={"sm"}>{key}</Text>
                      <Text size={"sm"}>{value as string}</Text>
                    </Flex>
                  )
                )}

              {data?.price && (
                <Flex justify={"space-between"}>
                  <Text size={"sm"}>Giá tiền</Text>
                  <Text size={"sm"}>{formatCurrency(data.price)}</Text>
                </Flex>
              )}

              <Flex justify={"space-between"}>
                <Text size={"sm"}>Trạng thái</Text>
                <Text size={"sm"}>
                  {STATUS_TASK[data?.status as keyof typeof STATUS_TASK]}
                </Text>
              </Flex>
            </Box>
          </Box>

          <Stack>
            <Title order={5}>Thông tin người dùng</Title>

            <Box
              style={{
                padding: "16px",
                borderRadius: 4,
                border: "1px solid #E4E7EB",
                width: "100%",
                maxWidth: 500,
              }}
            >
              <Box>
                <Title order={6}>Người đăng việc</Title>
                <Flex justify={"space-between"}>
                  <Text size={"sm"}>Tên</Text>
                  <Text size={"sm"}>{data?.job_poster.name}</Text>
                </Flex>
                <Flex justify={"space-between"}>
                  <Text size={"sm"}>Địa chỉ</Text>
                  <Text size={"sm"}>{data?.job_poster.address}</Text>
                </Flex>
                <Flex justify={"space-between"}>
                  <Text size={"sm"}>Số điện thoại</Text>
                  <Text size={"sm"}>{data?.job_poster.phone_number}</Text>
                </Flex>
              </Box>
            </Box>
          </Stack>

          <Stack>
            {data?.status === StatusTask["HIRING"] && (
              <Button onClick={() => mutateAsync()} loading={isPending}>
                Hoàn thành
              </Button>
            )}
          </Stack>
        </Stack>
      )}
    </div>
  );
};
