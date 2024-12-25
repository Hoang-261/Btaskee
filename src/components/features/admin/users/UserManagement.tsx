"use client";

import { MRT_ColumnDef } from "mantine-react-table";
import React, { useMemo } from "react";

import { ReactTable } from "@/components/shared/table/ReactTable";
import { TableContextProvider } from "@/components/shared/table/components/TableContext";

import { IUser } from "@/libs/types/user";
import { ROLE } from "@/libs/utils/constants";

export const UserManagement = () => {
  const columns = useMemo<MRT_ColumnDef<IUser>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "name",
        header: "Tên",
      },
      {
        accessorKey: "phone_number",
        header: "Số điện thoại",
      },
      {
        accessorKey: "role",
        header: "Vai trò",
        Cell(props) {
          return (
            <span>{ROLE[props.row.original.role as keyof typeof ROLE]}</span>
          );
        },
      },
    ],
    []
  );

  return (
    <TableContextProvider>
      <ReactTable
        endpointAPI={"/users"}
        name={"users"}
        columns={columns}
        hasCreate
        hasEdit
      />
    </TableContextProvider>
  );
};
