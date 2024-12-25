"use client";

import { Anchor, Container, Text, Title } from "@mantine/core";
import { RegisterForm } from "./RegisterForm";
import { useRouter } from "next/navigation";

export const Register = () => {
  const router = useRouter();

  return (
    <Container size={500} my={40}>
      <Title
        style={{
          fontWeight: 900,
          textAlign: "center",
        }}
      >
        Đăng ký
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Nếu bạn đã có tài khoản?{" "}
        <Anchor
          size="sm"
          component="button"
          onClick={() => router.push("/login")}
        >
          Đăng nhập
        </Anchor>
      </Text>

      <RegisterForm />
    </Container>
  );
};
