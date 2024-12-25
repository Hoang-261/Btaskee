import { Button, NumberFormatter, Text } from "@mantine/core";
import React from "react";

interface Props {
  totalPrice: number;
  onClick: () => void;
}

export const TotalPrice = ({ onClick, totalPrice }: Props) => {
  return (
    <Button
      onClick={onClick}
      style={{
        width: "fit-content",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Text>
        Tổng giá:{" "}
        <NumberFormatter
          value={totalPrice}
          thousandSeparator
          suffix=" VNĐ"
          style={{
            fontWeight: 700,
            marginRight: "16px",
          }}
        />
      </Text>

      <Text>Tiếp tục</Text>
    </Button>
  );
};
