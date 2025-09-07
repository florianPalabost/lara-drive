import { ColumnDef } from '@tanstack/react-table';
import { SortableHeader } from '@/components/ui/data-table/sortable-header';
import { useFileSize } from '@/hooks/use-file-size';
import { DriveFileVersion } from '@/types/folder';
import { getFileIcon } from '@/utils/mime-icons';
import { FileListRowActions } from '../row-actions/file-list-row-actions';

export function fileListColumns(): ColumnDef<DriveFileVersion>[] {
    // const Icon = getFileIcon(file.current_version.mime_type);
    return [
        // {
        //     accessorKey: "icon",
        //     header: "Icon",
        //     cell: ({ getValue }) => getFileIcon(getValue<string>()),
        // },

        {
            accessorKey: 'file.original_name',
            header: ({ column }) => <SortableHeader column={column} title="Name" />,
            cell: ({ getValue }) => getValue(),
        },
        {
            id: 'actions',
            header: 'Actions',
            enableSorting: false,
            enableHiding: false,
            cell: ({ row }) => <FileListRowActions fileVersion={row.original} />,
        },

        {
            accessorKey: 'version',
            header: ({ column }) => <SortableHeader column={column} title="Version" />,
            cell: ({ getValue }) => `v${getValue<number>()}`,
        },
        {
            accessorKey: 'mime_type',
            header: ({ column }) => <SortableHeader column={column} title="Type" />,
            cell: ({ getValue }) => getValue(),
        },
        {
            accessorKey: 'size',
            header: ({ column }) => <SortableHeader column={column} title="Size" />,
            cell: ({ getValue }) => useFileSize()(getValue<number>()),
        },
        {
            accessorKey: 'created_at',
            header: ({ column }) => <SortableHeader column={column} title="Uploaded At" />,
            cell: ({ getValue }) => new Date(getValue<string>()).toLocaleString(),
        },
        {
            accessorKey: 'uuid',
            header: ({ column }) => <SortableHeader column={column} title="ID" />,
            cell: ({ getValue }) => getValue(),
        },
    ];
}
