"use client";

import { Anchor, Container, Text, Title } from "@mantine/core";
import { LoginForm } from "./LoginForm";
import { useRouter } from "next/navigation";

export const Login = () => {
  const router = useRouter();

  return (
    <Container size={500} my={40}>
      <Title
        style={{
          fontWeight: 900,
          textAlign: "center",
        }}
      >
        Đăng nhập
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Nếu bạn chưa có tài khoản?{" "}
        <Anchor
          size="sm"
          component="button"
          onClick={() => router.push("/register")}
        >
          Tạo tài khoản
        </Anchor>
      </Text>

      <LoginForm />
    </Container>
  );
};
