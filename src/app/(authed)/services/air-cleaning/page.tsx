import { AirCleaning } from "@/components/features/poster/services/air-cleaning/AirCleaning";
import { getRole } from "@/libs/utils/authUtils";
import { Role } from "@/libs/utils/constants";
import { Stack, Text, Title } from "@mantine/core";
import React from "react";

const Page = async () => {
  const role = await getRole();

  if (role !== Role["JOB_POSTER"]) {
    return (
      <div>Không có quyền truy cập, trang này chỉ dành cho người đăng việc</div>
    );
  }

  return (
    <Stack>
      <Title order={2}>Vệ sinh máy lạnh</Title>
      <Text
        style={{
          fontSize: 14,
        }}
      >
        Kiểm tra thông số trên bản năng lượng, 9000BTU/h = 1Hp
      </Text>

      <AirCleaning />
    </Stack>
  );
};

export default Page;
