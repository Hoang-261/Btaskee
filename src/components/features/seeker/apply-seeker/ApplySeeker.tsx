"use client";

import useAxiosAuth from "@/libs/hooks/useAxiosAuth";
import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import React from "react";

export const ApplySeeker = () => {
  const requestAuth = useAxiosAuth();

  const { mutate, data, isPending } = useMutation({
    mutationFn: async () => {
      const res = await requestAuth.post("/users/apply-seeker");

      return res.data;
    },

    onSuccess: () => {
      notifications.show({
        title: "Thành công",
        message: "Bạn đã ứng tuyển thành nhân viên",
        color: "green",
      });
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
    <div>
      <Button
        onClick={() => {
          mutate();
        }}
        loading={isPending}
      >
        Ứng tuyển thành nhân viên
      </Button>
    </div>
  );
};
