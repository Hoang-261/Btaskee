"use client";

import { Burger, Group, Image } from "@mantine/core";
import classes from "./Header.module.css";
import { Auth } from "./components/Auth";
import logoImg from "@assets/images/logo.jpg";

interface Props {
  toggle?: () => void;
  opened?: boolean;
}

export function Header({ opened, toggle }: Props) {
  return (
    <header className={classes.header}>
      <Group
        h="100%"
        px="md"
        style={{
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Image src={logoImg.src} alt="logo" height={40} />

        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <Auth />
      </Group>
    </header>
  );
}
