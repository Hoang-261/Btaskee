"use client";

import { request } from "@/libs/request";
import { Box, Flex, Stack, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";
import { ITask } from "@/libs/types/task";
import { format } from "date-fns";
import { PAYMENT_METHOD, SERVICES } from "@/libs/utils/constants";
import { formatCurrency } from "@/libs/utils/common";
import { PayPalButton } from "@/components/shared/buttons/PayPalButton";
import { useSession } from "next-auth/react";

export const PostedJobDetail = () => {
  const { id } = useParams();
  const { data: session } = useSession();

  const { data, isLoading } = useQuery<ITask>({
    queryKey: ["tasks", id],
    queryFn: async () => {
      const res = await request.get(`/tasks/${id}`);
      return res.data;
    },
  });

  console.log(
    session,
    data?.job_poster,
    data?.job_poster?.email == session?.user?.email
  );

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Stack>
          <Title order={3}>
            {SERVICES[data?.type as keyof typeof SERVICES] || "Dịch vụ"}
          </Title>

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
            <Title order={5}>Phương thức thanh toán</Title>

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
                <Title order={6}>Chi tiết thanh toán</Title>
                <Flex justify={"space-between"}>
                  <Text size={"sm"}>Thanh toán qua</Text>

                  <Text size={"sm"}>
                    {
                      PAYMENT_METHOD[
                        data?.payment_method as keyof typeof PAYMENT_METHOD
                      ]
                    }
                  </Text>
                </Flex>

                <Flex justify={"space-between"}>
                  <Text size={"sm"} fw={"bold"}>
                    Tổng cộng
                  </Text>

                  <Text size={"sm"}>{formatCurrency(data?.price || 0)}</Text>
                </Flex>
              </Box>
            </Box>
          </Stack>

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

              {data?.job_seeker ? (
                <Box mt={8}>
                  <Title order={6}>Người nhận việc</Title>
                  <Flex justify={"space-between"}>
                    <Text size={"sm"}>Tên</Text>
                    <Text size={"sm"}>{data?.job_seeker.name}</Text>
                  </Flex>
                  <Flex justify={"space-between"}>
                    <Text size={"sm"}>Số điện thoại</Text>
                    <Text size={"sm"}>{data?.job_seeker.phone_number}</Text>
                  </Flex>
                </Box>
              ) : null}
            </Box>
          </Stack>

          <Box
            style={{
              maxWidth: 500,
            }}
          >
            {data?.status == "UNPAID" &&
            data?.payment_method == "PAYPAL" &&
            data?.job_poster?.email == session?.user?.email ? (
              <PayPalButton
                taskId={data.id}
                description={data.description}
                name={data.type}
                price={data.price + ""}
              />
            ) : null}
          </Box>
        </Stack>
      )}
    </div>
  );
};
