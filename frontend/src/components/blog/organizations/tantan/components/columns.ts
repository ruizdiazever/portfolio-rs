import type { ColumnDef } from "@tanstack/table-core";
import type { Organization } from "../data/data.ts";
import { DataTableColumnHeader, DataTableNameCell } from "./index.js";
import { renderComponent } from "$lib/components/ui/data-table/index.js";

export const columns: ColumnDef<Organization>[] = [
  {
    accessorKey: "name",
    header: ({ column }) =>
      renderComponent(DataTableColumnHeader<Organization, unknown>, {
        column,
        title: "Name",
      }),
    cell: ({ row }) => {
      let labelValue = row.original.sponsor;

      return renderComponent(DataTableNameCell, {
        labelValue,
        id: "name",
        url: row.original.url,
        value: row.original.name,
      });
    },
  },
  {
    accessorKey: "founded",
    header: ({ column }) =>
      renderComponent(DataTableColumnHeader<Organization, unknown>, {
        column,
        title: "Founded",
      }),
    cell: ({ row }) => {
      return renderComponent(DataTableNameCell, {
        value: row.original.founded,
      });
    },
    enableSorting: true,
  },
  {
    accessorKey: "industry",
    header: ({ column }) =>
      renderComponent(DataTableColumnHeader<Organization, unknown>, {
        column,
        title: "Industry",
      }),
    cell: ({ row }) => {
      return renderComponent(DataTableNameCell, {
        value: row.original.industry,
      });
    },
    enableSorting: true,
  },
  {
    accessorKey: "country",
    header: ({ column }) =>
      renderComponent(DataTableColumnHeader<Organization, unknown>, {
        column,
        title: "Country",
      }),
    cell: ({ row }) => {
      return renderComponent(DataTableNameCell, {
        value: row.original.country,
      });
    },
    enableSorting: true,
  },
];
