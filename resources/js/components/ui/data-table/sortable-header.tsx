import { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SortableHeaderProps<TData> {
  column: Column<TData, unknown>;
  title: string;
}

export function SortableHeader<TData>({ column, title }: SortableHeaderProps<TData>) {
  const isSorted = column.getIsSorted();

    const toggleSort = () => {
        if (!isSorted) {
            column.toggleSorting(false); // start with asc
        } else {
            column.toggleSorting(isSorted === "asc"); // switch between asc/desc
        }
    };

    return (
        <Button
            variant="ghost"
            onClick={toggleSort}
            className="flex items-center gap-1 cursor-pointer"
        >
            {title}
            {isSorted === "asc" && <ArrowUp className="h-4 w-4" />}
            {isSorted === "desc" && <ArrowDown className="h-4 w-4" />}
        </Button>
    );
}
