import type { ColumnDef } from "@tanstack/table-core";
import type { Organization } from "../data/data.ts";
import { DataTableColumnHeader, DataTableNameCell } from "./index.js";
import { renderComponent } from "$lib/components/ui/data-table/index.js";
import * as m from "@paraglide/messages.js";

export const columns: ColumnDef<Organization>[] = [
  {
    accessorKey: "name",
    header: ({ column }) =>
      renderComponent(DataTableColumnHeader<Organization, unknown>, {
        column,
        title: m.name(),
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
        title: m.founded(),
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
        title: m.industry(),
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
        title: m.country(),
      }),
    cell: ({ row }) => {
      return renderComponent(DataTableNameCell, {
        value: row.original.country,
      });
    },
    enableSorting: true,
  },
];
