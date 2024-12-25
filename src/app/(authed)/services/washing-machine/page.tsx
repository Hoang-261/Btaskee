import { WashingMachine } from "@/components/features/poster/services/washing-machine/WashingMachine";
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
      <Title order={2}>Vệ sinh máy giặt</Title>

      <WashingMachine />
    </Stack>
  );
};

export default Page;
