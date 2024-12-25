"use client";

import { MRT_ColumnDef } from "mantine-react-table";
import React, { useMemo } from "react";

import { ReactTable } from "@/components/shared/table/ReactTable";
import { TableContextProvider } from "@/components/shared/table/components/TableContext";
import { ITask } from "@/libs/types/task";
import {
  PAYMENT_METHOD,
  SERVICES,
  STATUS_TASK,
  StatusTask,
} from "@/libs/utils/constants";
import { format } from "date-fns";

export const PostedJobSeekerManagement = () => {
  const columns = useMemo<MRT_ColumnDef<ITask>[]>(
    () => [
      {
        accessorKey: "start_date",
        header: "Thời gian bắt đầu",
        Cell: ({ row }) =>
          format(new Date(row.original.start_date), "dd/MM/yyyy HH:mm"),
      },
      {
        accessorKey: "type",
        header: "Loại công việc",
        Cell: ({ row }) => SERVICES[row.original.type as keyof typeof SERVICES],
      },
      {
        accessorKey: "job_poster.name",
        header: "Người đăng việc",
      },
      {
        accessorKey: "job_seeker.name",
        header: "Người nhận việc",
      },
      {
        accessorKey: "payment_method",
        header: "Phương thức thanh toán",
        Cell: ({ row }) =>
          PAYMENT_METHOD[
            row.original.payment_method as keyof typeof PAYMENT_METHOD
          ],
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        Cell: ({ row }) =>
          STATUS_TASK[row.original.status as keyof typeof STATUS_TASK],
      },
    ],
    []
  );

  return (
    <TableContextProvider>
      <ReactTable
        endpointAPI={"/tasks"}
        name={"posted-jobs"}
        columns={columns}
        seeDetail
        params={{
          status: StatusTask["PENDING"],
        }}
        hasDelete={false}
        // handleExportExcel={handleExportExcel}
      />
    </TableContextProvider>
  );
};
