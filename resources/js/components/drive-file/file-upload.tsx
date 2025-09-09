import { useForm } from '@inertiajs/react';
import { useRef } from 'react';
import { toast } from 'sonner';
import { useFolderContext } from '@/contexts/folder-context';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';

export function FileUpload() {
    const { selectedFolder, loadFolder } = useFolderContext();
    const inputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset, progress, setError, clearErrors } = useForm({
        files: [] as File[],
        folder_id: null as string | null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files ?? []);

        if (!newFiles.length) return;

        const validFiles: File[] = [];

        newFiles.forEach((file) => {
            if (file.size > 100 * 1024 * 1024) {
                toast.error(`${file.name} must be less than 100MB`);
                setError('files', `${file.name} too large`);
            } else {
                validFiles.push(file);
            }
        });

        if (errors.files) clearErrors('files');

        setData({
            files: validFiles,
            folder_id: selectedFolder?.uuid ?? null,
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.debug('handleSubmit', data);
        console.debug('selectedFolder', selectedFolder);

        if (!data.files?.length || !selectedFolder) return;

        post(route('files.store'), {
            onSuccess: () => {
                reset();
                if (inputRef.current) inputRef.current.value = '';
                if (selectedFolder?.uuid) loadFolder(selectedFolder.uuid);
                toast.success('File(s) uploaded successfully!');
            },
            onError: (errors) => {
                console.error(errors);
                toast.error('File(s) upload failed!');
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
                            multiple
                            ref={inputRef}
                            onChange={handleFileChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm text-sm
                                       file:mr-4 file:py-2 file:px-4 file:border-0
                                       file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                        />
                        {errors.files && <p className="text-sm text-red-500 mt-1">{errors.files}</p>}
                        {data.files?.length ? (
                            <ul className="text-xs text-gray-500 mt-1 space-y-1">
                                {data.files.map((f) => (
                                    <li key={f.name}>{f.name}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-xs text-gray-500 mt-1">Select one or more files</p>
                        )}
                    </div>

                    {progress && <Progress value={progress.percentage ?? 0} className="h-2" />}

                    <Button type="submit" disabled={processing || !data.files?.length} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        {processing ? 'Uploading...' : 'Upload'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
