"use client";

import { MRT_ColumnDef } from "mantine-react-table";
import React, { useMemo } from "react";

import { ReactTable } from "@/components/shared/table/ReactTable";
import { TableContextProvider } from "@/components/shared/table/components/TableContext";

import { IUser } from "@/libs/types/user";
import { ROLE } from "@/libs/utils/constants";

interface IApply {
  id: number;
  status: string;
  userId: number;
  user: IUser;
}

export const ApplySeekerManagement = () => {
  const columns = useMemo<MRT_ColumnDef<IApply>[]>(
    () => [
      {
        accessorKey: "user.email",
        header: "Email",
      },
      {
        accessorKey: "user.name",
        header: "Tên",
      },
      {
        accessorKey: "user.phone_number",
        header: "Số điện thoại",
      },
    ],
    []
  );

  return (
    <TableContextProvider>
      <ReactTable
        endpointAPI={"/users/apply-seeker"}
        name={"users-apply-seeker"}
        columns={columns}
        hasEdit
      />
    </TableContextProvider>
  );
};
