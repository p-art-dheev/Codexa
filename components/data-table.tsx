"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, Inbox, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchColumn?: string;
  searchPlaceholder?: string;
  manualPagination?: boolean;
  manualSorting?: boolean;
  manualFiltering?: boolean;
  pageCount?: number;
  rowCount?: number;
  state?: {
    pagination?: any;
    sorting?: any;
    globalFilter?: any;
  };
  onPaginationChange?: (pagination: any) => void;
  onSortingChange?: (sorting: any) => void;
  onGlobalFilterChange?: (filter: string) => void;
  onRowSelectionChange?: (selectedRows: TData[]) => void;
  loading?: boolean;
  /** Extra controls shown to the right of the search box. */
  toolbar?: React.ReactNode;
  emptyMessage?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchColumn,
  searchPlaceholder = "Search…",
  manualPagination = false,
  manualSorting = false,
  manualFiltering = false,
  pageCount = -1,
  rowCount = 0,
  state,
  onPaginationChange,
  onSortingChange,
  onGlobalFilterChange,
  onRowSelectionChange,
  loading = false,
  toolbar,
  emptyMessage = "No results found.",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    pageCount: manualPagination ? pageCount : undefined,
    rowCount: manualPagination ? rowCount : undefined,
    state: state || {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    onSortingChange: onSortingChange || setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: onPaginationChange || setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: manualPagination
      ? undefined
      : getPaginationRowModel(),
    getSortedRowModel: manualSorting ? undefined : getSortedRowModel(),
    getFilteredRowModel: manualFiltering ? undefined : getFilteredRowModel(),
    manualPagination,
    manualSorting,
    manualFiltering,
  });

  // Handle row selection changes
  React.useEffect(() => {
    if (onRowSelectionChange) {
      const selectedRows = table
        .getFilteredSelectedRowModel()
        .rows.map((row) => row.original);
      onRowSelectionChange(selectedRows);
    }
  }, [rowSelection, onRowSelectionChange, table]);

  const searchValue =
    onGlobalFilterChange && state?.globalFilter !== undefined
      ? (state.globalFilter as string)
      : ((table.getColumn(searchColumn ?? "")?.getFilterValue() as string) ??
        "");

  const setSearch = (value: string) => {
    if (onGlobalFilterChange) onGlobalFilterChange(value);
    else if (searchColumn) table.getColumn(searchColumn)?.setFilterValue(value);
  };

  const rows = table.getRowModel().rows;
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const totalCount = manualPagination
    ? rowCount
    : table.getFilteredRowModel().rows.length;
  const { pageIndex, pageSize } = table.getState().pagination;
  const from = totalCount === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min(totalCount, (pageIndex + 1) * pageSize);
  const pages = Math.max(1, table.getPageCount());

  return (
    <div className="w-full overflow-hidden rounded-xl border bg-card shadow-xs">
      {(searchColumn || toolbar) && (
        <div className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center">
          {searchColumn && (
            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                aria-label="Search table"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 pr-8 pl-8 [&::-webkit-search-cancel-button]:hidden"
              />
              {searchValue && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearch("")}
                  className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          )}
          {toolbar && <div className="flex items-center gap-2 sm:ml-auto">{toolbar}</div>}
        </div>
      )}

      <div className="overflow-x-auto border-y">
        <Table>
          <TableHeader className="bg-muted/40">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-10 font-medium text-muted-foreground first:pl-4 last:pr-4"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading && rows.length === 0 ? (
              Array.from({ length: 5 }).map((_, r) => (
                <TableRow key={`sk-${r}`} className="hover:bg-transparent">
                  {columns.map((_, c) => (
                    <TableCell key={c} className="py-3.5 first:pl-4 last:pr-4">
                      <div
                        className="h-4 animate-pulse rounded bg-muted"
                        style={{ width: `${50 + ((r * 7 + c * 13) % 40)}%` }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length ? (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  className={loading ? "opacity-60 transition-opacity" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3 first:pl-4 last:pr-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="h-40">
                  <div className="flex flex-col items-center justify-center gap-2 text-center text-muted-foreground">
                    <Inbox className="size-8 opacity-60" />
                    <p className="text-sm">
                      {searchValue ? `No matches for “${searchValue}”.` : emptyMessage}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col-reverse gap-3 p-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="tabular-nums">
          {selectedCount > 0 ? (
            <span>
              <span className="font-medium text-foreground">{selectedCount}</span> selected ·{" "}
            </span>
          ) : null}
          {totalCount > 0 ? (
            <>
              Showing <span className="font-medium text-foreground">{from}–{to}</span> of{" "}
              <span className="font-medium text-foreground">{totalCount}</span>
            </>
          ) : (
            "No rows"
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="mr-1 tabular-nums">
            Page {pageIndex + 1} of {pages}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            aria-label="Previous page"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            aria-label="Next page"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
