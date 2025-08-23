import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Table as RTTable,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createDataTableContext } from "@/contexts/data-table-context";
import { cn } from "@/lib/utils";

export interface DataTableActions<TData> {
    onSelect?: (row: TData) => void;
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  children: React.ReactNode;
  actions?: DataTableActions<TData>;
}

// --- Create component factory ---
export function createDataTableComponent<TData, TValue>() {
  const [DataTableContext, useDataTableContext] =
    createDataTableContext<TData>();

  // Root = provider only
  function Root({ columns, data, children, actions }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const table = useReactTable<TData>({
      columns,
      data,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      onSortingChange: setSorting,
      getFilteredRowModel: getFilteredRowModel(),
      state: {
        sorting,
      },
    });

    return (
      <DataTableContext.Provider value={{ table, actions }}>
        {children}
      </DataTableContext.Provider>
    );
  }

  // View = wraps the <table> so <thead> is valid
  function View({ className }: { className?: string }) {
    return (
      <div className={cn("rounded-md border bg-white shadow-sm", className)}>
        <Table>
          <Header />
          <Body />
        </Table>
      </div>
    );
  }

  function Header() {
    const { table } = useDataTableContext();
    return (
      <TableHeader>
        {table.getHeaderGroups().map((hg) => (
          <TableRow key={hg.id}>
            {hg.headers.map((header) => (
              <TableHead key={header.id}>
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
    );
  }

  function Body() {
    const { table } = useDataTableContext();
    const rows = table.getRowModel().rows;
    return (
      <TableBody>
        {rows.length ? (
          rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={table.getAllColumns().length}
              className="h-24 text-center"
            >
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    );
  }

  // Pagination (outside table but inside provider)
  function Pagination() {
    const { table } = useDataTableContext();
    return (
      <div className="flex items-center justify-between p-2">
        <span className="text-sm">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <div className="space-x-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  // Toolbar slot
  function Toolbar({ children }: { children: React.ReactNode }) {
    return <div className="p-2">{children}</div>;
  }

  return Object.assign(Root, {
    View,
    Header,
    Body,
    Pagination,
    Toolbar,
    useDataTableContext: useDataTableContext,
  });
}
