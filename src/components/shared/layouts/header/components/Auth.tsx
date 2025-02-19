import { Flex, Text } from "@mantine/core";
import { useSession } from "next-auth/react";
import React from "react";
import { UserAccount } from "./UserAccount";

export const Auth = () => {
  const sessions = useSession();

  const isLogin = sessions.data?.user;

  return !isLogin ? (
    <Flex gap={8}>
      <Text
        style={{
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: 600,
        }}
        onClick={() => console.log("Dang ky")}
      >
        Đăng ký
      </Text>
      <span
        style={{
          fontSize: "14px",
          fontWeight: 600,
        }}
      >
        |
      </span>
      <Text
        style={{
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: 600,
        }}
        onClick={() => console.log("Dang nhap")}
      >
        Đăng nhập
      </Text>
    </Flex>
  ) : (
    <UserAccount user={sessions.data?.user} />
  );
};
