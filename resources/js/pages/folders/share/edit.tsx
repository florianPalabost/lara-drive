import { Head, useForm } from '@inertiajs/react';
import { LucidePen } from 'lucide-react';
import { FormEvent, useMemo } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Folder } from '@/types/folder';
import FolderPermissionsTable from '@/components/data-table/folder-permissions-table';
import { folderPermissionsColumns } from '@/components/data-table/columns/folder-permissions-colmns';
import { UserPermission } from '@/types/permissions';

interface EditFolderShareProps {
    breadcrumbs: BreadcrumbItem[];
    folder: Folder;
    sharedUsers: UserPermission[];
}

export default function EditFolderShare({ breadcrumbs, folder, sharedUsers }: EditFolderShareProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: folder.name,
    });

    const columns = useMemo(() => folderPermissionsColumns(), []);
    const actions: DriveFileTrashedListActions = {};

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(route('folders.update', folder.uuid), {
            onFinish: () => reset('name'),
            onSuccess: function () {
                toast.success('Folder updated successfully!');
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Edit Folder Permissions" />

            <div className="w-1/3 mx-auto mt-10 bg-white p-6 rounded shadow">
                <h1 className="text-2xl font-bold mb-4">Edit Folder Permissions</h1>
            </div>

            <FolderPermissionsTable columns={columns} data={sharedUsers} />
        </AppLayout>
    );
}
