import { ColumnDef } from '@tanstack/react-table';
import { SortableHeader } from '@/components/ui/data-table/sortable-header';
import { DriveFileVersion } from '@/types/folder';
import { FileVersionRowActions } from '../row-actions/file-version-row-actions';
import { UserPermission } from '@/types/permissions';

export function folderPermissionsColumns(): ColumnDef<UserPermission>[] {
    return [
        {
            accessorKey: 'user.name',
            header: ({ column }) => <SortableHeader column={column} title="User" />,
            cell: ({ getValue }) => getValue(),
        },
        {
            accessorKey: 'user.email',
            header: ({ column }) => <SortableHeader column={column} title="Email" />,
            cell: ({ getValue }) => getValue(),
        },
        {
            accessorKey: 'permission',
            header: ({ column }) => <SortableHeader column={column} title="Permission" />,
            cell: ({ getValue }) => getValue(),
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
