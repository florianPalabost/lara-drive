import { useForm } from '@inertiajs/react';
import { useRef } from 'react';
import { toast } from 'sonner';
import { useFolderContext } from '@/contexts/folder-context';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';

export default function FileUpload() {
    const { selectedFolder, loadFolder } = useFolderContext();
    const inputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset, progress } = useForm({
        file: null as File | null,
        folder_id: null as string | null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setData({ file, folder_id: selectedFolder?.uuid ?? null });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.debug('handleSubmit', data);
        console.debug('selectedFolder', selectedFolder);

        if (!data.file || !selectedFolder) return;

        post(route('files.store'), {
            onSuccess: () => {
                reset();
                if (inputRef.current) inputRef.current.value = '';
                if (selectedFolder?.uuid) loadFolder(selectedFolder.uuid);
                toast.success('File uploaded successfully!');
            },
            onError: (errors) => {
                console.error(errors);
                toast.error('File upload failed!');
            },
        });
    };

    return (
        <Card className="w-full max-w-md mx-auto shadow-sm">
            <CardContent className="p-6 space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            id="file"
                            type="file"
                            ref={inputRef}
                            onChange={handleFileChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                        />
                        {errors.file && <p className="text-sm text-red-500 mt-1">{errors.file}</p>}
                        {data.file && <p className="text-xs text-gray-500 mt-1">Selected: {data.file.name}</p>}
                    </div>

                    {progress && <Progress value={progress.percentage ?? 0} className="h-2" />}

                    <Button type="submit" disabled={processing || !data.file} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        {processing ? 'Uploading...' : 'Upload'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
