import { ColumnDef } from '@tanstack/react-table';
import { SortableHeader } from '@/components/ui/data-table/sortable-header';
import { useFileSize } from '@/hooks/use-file-size';
import { DriveFile, DriveFileVersion } from '@/types/folder';
import { getFileIcon } from '@/utils/mime-icons';
import { FileTrashedListRowActions } from '../row-actions/file-trashed-list-row-actions';

export function fileTrashedListColumns(): ColumnDef<DriveFile>[] {
    // const Icon = getFileIcon(file.current_version.mime_type);

    return [
        // {
        //     accessorKey: "icon",
        //     header: "Icon",
        //     cell: ({ getValue }) => getFileIcon(getValue<string>()),
        // },
        {
            accessorKey: 'original_name',
            header: ({ column }) => <SortableHeader column={column} title="Name" />,
            cell: ({ getValue }) => getValue(),
        },
        {
            id: 'actions',
            header: 'Actions',
            enableSorting: false,
            enableHiding: false,
            cell: ({ row }) => <FileTrashedListRowActions file={row.original} />,
        },
        // {
        //     accessorKey: 'version',
        //     header: ({ column }) => <SortableHeader column={column} title="Version" />,
        //     cell: ({ getValue }) => `v${getValue<number>()}`,
        // },
        // {
        //     accessorKey: 'mime_type',
        //     header: ({ column }) => <SortableHeader column={column} title="Type" />,
        //     cell: ({ getValue }) => getValue(),
        // },
        // {
        //     accessorKey: 'size',
        //     header: ({ column }) => <SortableHeader column={column} title="Size" />,
        //     cell: ({ getValue }) => useFileSize()(getValue<number>()),
        // },
        {
            accessorKey: 'deleted_at',
            header: ({ column }) => <SortableHeader column={column} title="Deleted At" />,
            cell: ({ getValue }) => new Date(getValue<string>()).toLocaleString(),
        },

        {
            accessorKey: 'uuid',
            header: ({ column }) => <SortableHeader column={column} title="ID" />,
            cell: ({ getValue }) => getValue(),
        },
    ];
}
