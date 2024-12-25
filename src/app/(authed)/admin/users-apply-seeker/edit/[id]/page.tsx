"use client";

import useAxiosAuth from "@/libs/hooks/useAxiosAuth";
import { Button, Flex, Stack, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";

const Page = ({ params }: { params: { id: number } }) => {
  const queryClient = useQueryClient();
  const requestAuth = useAxiosAuth();
  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: async ({ key }: { key: "ACCEPT" | "REJECT" }) => {
      const res = await requestAuth.post(`/users/handle-apply-seeker`, {
        status: key === "ACCEPT" ? "ACCEPTED" : "REJECTED",
        id: params.id,
      });

      return res.data;
    },
    onSuccess: (_data, variables) => {
      notifications.show({
        title: "Thành công",
        message: `${
          variables.key == "ACCEPT" ? "Phê duyệt" : "Từ chối"
        } thành công`,
        color: "green",
      });

      queryClient.invalidateQueries({
        queryKey: ["users-apply-seeker"],
      });

      router.push("/admin/users-apply-seeker");
    },
    onError: (error: any) => {
      notifications.show({
        title: "Thất bại",
        message: error.response.data.message || "Có lỗi xảy ra",
        color: "red",
      });
    },
  });

  return (
    <Stack>
      <Title order={1}>Phê duyệt đơn làm nhân viên</Title>

      <Flex gap={12}>
        <Button
          onClick={() =>
            mutate({
              key: "ACCEPT",
            })
          }
        >
          Phê duyệt
        </Button>
        <Button
          color="red"
          onClick={() =>
            mutate({
              key: "REJECT",
            })
          }
        >
          Từ chối
        </Button>
      </Flex>
    </Stack>
  );
};

export default Page;
