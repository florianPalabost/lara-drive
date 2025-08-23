// file: columns/fileVersionsColumns.tsx
import { ColumnDef } from '@tanstack/react-table';
import { DriveFileVersion } from '@/types/folder';
import { FileVersionRowActions } from '../row-actions/file-version-row-actions';
import { SortableHeader } from '../ui/data-table/sortable-header';

export function fileVersionsColumns(): ColumnDef<DriveFileVersion>[] {
    return [
        {
            accessorKey: 'version',
            header: ({ column }) => <SortableHeader column={column} title="Version" />,
            cell: ({ getValue }) => `v${getValue<number>()}`,
        },
        {
            accessorKey: 'size',
            header: ({ column }) => <SortableHeader column={column} title="Size" />,
            cell: ({ getValue }) => getValue(),
        },
        {
            accessorKey: 'created_at',
            header: ({ column }) => <SortableHeader column={column} title="Uploaded At" />,
            cell: ({ getValue }) => new Date(getValue<string>()).toLocaleString(),
        },
        {
            id: 'actions',
            header: 'Actions',
            enableSorting: false,
            enableHiding: false,
            cell: ({ row }) => <FileVersionRowActions fileVersion={row.original} />,
        },
    ];
}
