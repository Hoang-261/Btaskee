import { DeepCleaning } from "@/components/features/poster/services/deep-cleaning/DeepCleaning";
import { getRole } from "@/libs/utils/authUtils";
import { Role } from "@/libs/utils/constants";
import { Stack, Title } from "@mantine/core";
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
      <Title order={2}>Tổng vệ sinh</Title>

      <DeepCleaning />
    </Stack>
  );
};

export default Page;
