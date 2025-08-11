import { useForm } from '@inertiajs/react';
import { ChangeEvent, FormEvent, useRef } from 'react';
import { toast } from 'sonner';
import { useFolderContext } from '@/contexts/folder-context';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';

export function FolderImport() {
    const { selectedFolder } = useFolderContext();
    const inputRef = useRef<HTMLInputElement>(null);
    const { data, setData, post, processing, reset, progress } = useForm({
        files: [] as File[],
        paths: [] as string[],
        base_folder_id: null as string | null,
    });

    const handleFolderChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        const paths = files.map((file) => file.webkitRelativePath);
        console.debug('files', files);
        console.debug('paths', paths);
        console.debug('selectedFolder', selectedFolder);
        setData({
            files,
            paths,
            base_folder_id: selectedFolder?.uuid ?? null,
        });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.debug('handleSubmit', data);

        if (!data.files || data.files.length === 0) return;

        post(route('folders.import.store'), {
            // forceFormData: true,
            onSuccess: () => {
                reset();
                if (inputRef.current) inputRef.current.value = '';
                toast.success('Folder imported successfully!');
            },
            onError: (errors) => {
                console.error(errors);
                toast.error('Folder import failed!');
            },
        });
    };
    return (
        <Card className="w-full max-w-md mx-auto mt-6">
            <CardContent className="p-6 space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="file"
                            ref={inputRef}
                            multiple
                            webkitdirectory="true"
                            onChange={handleFolderChange}
                            className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                        />
                        <p className="text-xs text-gray-500 mt-1">You can upload an entire folder structure</p>
                    </div>

                    {progress && <Progress value={progress.percentage ?? 0} className="h-2" />}

                    <Button type="submit" disabled={processing} className="w-full bg-blue-600 text-white hover:bg-blue-700">
                        {processing ? 'Importing...' : 'Import Folder'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
