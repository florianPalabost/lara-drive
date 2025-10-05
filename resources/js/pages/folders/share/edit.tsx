import { Head, useForm } from '@inertiajs/react';
import { LucidePen } from 'lucide-react';
import { FormEvent } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Folder } from '@/types/folder';

interface EditFolderShareProps {
    breadcrumbs: BreadcrumbItem[];
    folder: Folder;
    sharedUsers;
}

export default function EditFolderShare({ breadcrumbs, folder }: EditFolderShareProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: folder.name,
    });

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
            <Head title="Edit Folder" />

            <div className="w-1/3 mx-auto mt-10 bg-white p-6 rounded shadow">
                <h1 className="text-2xl font-bold mb-4">Edit Folder Permissions</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block font-medium text-sm text-gray-700">
                            Folder Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="py-2 px-3 mt-1 block w-full rounded border-gray-300 shadow-sm"
                        />
                        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    {/* Optional: Add parent_id dropdown later */}

                    <div className="flex justify-end mt-8">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
                        >
                            <span className="flex items-center gap-2 cursor-pointer">
                                {processing ? 'Updating...' : 'Update'}
                                <LucidePen />
                            </span>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
