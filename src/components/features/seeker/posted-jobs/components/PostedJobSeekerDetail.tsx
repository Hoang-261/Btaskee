"use client";

import { Box, Button, Flex, Stack, Text, Title } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { ITask } from "@/libs/types/task";
import { format } from "date-fns";
import { SERVICES } from "@/libs/utils/constants";

import useAxiosAuth from "@/libs/hooks/useAxiosAuth";
import { notifications } from "@mantine/notifications";

export const PostedJobSeekerDetail = () => {
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
      await request.post(`/tasks/apply/${id}`);
    },
    onSuccess() {
      notifications.show({
        title: "Ứng tuyển thành công",
        message: "Chúc mừng bạn đã ứng tuyển thành công",
        color: "teal",
      });

      router.back();
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
            <Button onClick={() => mutateAsync()} loading={isPending}>
              Ứng tuyển
            </Button>
          </Stack>
        </Stack>
      )}
    </div>
  );
};
