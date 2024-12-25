import React from "react";
import { Card, Image, Text, Badge, Button, Group } from "@mantine/core";
import Link from "next/link";
interface Props {
  image: string;
  title: string;
  url: string;
  isNew?: boolean;
}

export const CardService: React.FC<Props> = ({ image, title, url, isNew }) => {
  return (
    <Link
      href={`/services/${url}`}
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "8px",
            marginBottom: "10px",
            paddingTop: "100%",
          }}
        >
          <Image
            src={image}
            alt="img-service"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </Card.Section>

        <Group justify="space-between">
          <Text fw={500}>{title}</Text>
          {isNew && <Badge color="pink">New</Badge>}
        </Group>
      </Card>
    </Link>
  );
};
