import { Head, useForm } from '@inertiajs/react';
import { LucidePlus } from 'lucide-react';
import { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Folder } from '@/types/folder';

interface CreateFolderProps {
    parent?: Folder | undefined;
}

export default function CreateFolder({ parent }: CreateFolderProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Folders',
            href: '/folders',
        },
        {
            title: 'Create',
            href: '/folders/create',
        },
    ];

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        parent_id: parent ? parent.uuid : null,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('folders.store'), {
            onFinish: () => reset('name'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create New Folder" />

            <div className="w-1/3 mx-auto mt-10 bg-white p-6 rounded shadow">
                <h1 className="text-2xl font-bold mb-4">Create New Folder</h1>

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
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            <span className="flex items-center gap-2 cursor-pointer">
                                {processing ? 'Creating...' : 'Create'}
                                <LucidePlus />
                            </span>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
