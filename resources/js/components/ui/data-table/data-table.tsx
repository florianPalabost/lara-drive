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
import { LucideArrowBigLeft, LucideChevronLeft, LucideChevronRight } from "lucide-react";
import { useState } from "react";
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
import { IndeterminateCheckbox } from "./indeterminate-checkbox";

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

    const defaultColumns: ColumnDef<TData, TValue>[] = [
        {
            id: 'select-col',
            header: ({ table}) => (
                <IndeterminateCheckbox
                    checked={table.getIsAllRowsSelected()}
                    indeterminate={table.getIsSomeRowsSelected()}
                    onChange={table.getToggleAllRowsSelectedHandler()} //or getToggleAllPageRowsSelectedHandler
                />
            ),
            cell: ({ row }) => (
                <IndeterminateCheckbox
                    checked={row.getIsSelected()}
                    disabled={!row.getCanSelect()}
                    onChange={row.getToggleSelectedHandler()}
                />
            ),
        }
    ];

    const [sorting, setSorting] = useState<SortingState>([])
    const table = useReactTable<TData>({
      columns: [...defaultColumns, ...columns],
      data,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      onSortingChange: setSorting,
      getFilteredRowModel: getFilteredRowModel(),
      state: {
        sorting,
      },
      enableRowSelection: true
    });

    return (
      <DataTableContext.Provider value={{ table, actions, selectedRows: table.getSelectedRowModel().rows }}>
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
    <div className="flex items-center justify-between border-t border-gray-200 bg-white py-3">
      <div className="flex items-center justify-end space-x-2 p-2">
        {
            table.getPreSelectedRowModel().rows.length > 0 && (
                <div className="text-sm">
                   {table.getSelectedRowModel().rows.length} / {table.getPreSelectedRowModel().rows.length} row(s) selected
                </div>
            )
        }
      </div>
      <div className="flex items-center justify-between p-2 space-x-2">
        <span className="text-sm">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <div className="space-x-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <LucideChevronLeft />
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <LucideChevronRight />
          </button>
        </div>
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
