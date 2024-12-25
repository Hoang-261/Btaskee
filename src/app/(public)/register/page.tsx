import { Register } from "@/components/features/auth/views/register/Register";
import { redirectIfAuthenticated } from "@/libs/utils/authUtils";
import React from "react";

const Page = async () => {
  await redirectIfAuthenticated();

  return (
    <>
      <Register />
    </>
  );
};

export default Page;
