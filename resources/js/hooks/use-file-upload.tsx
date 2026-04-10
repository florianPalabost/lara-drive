import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { useFolderContext } from '@/contexts/folder-context';

const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB

/**
 * Provides a simple `upload` function for dropping files into the current folder.
 * Uses `router.post` directly (no form state) — suited for drag-and-drop where
 * progress UI is not needed. The explicit FileUpload form keeps its own useForm
 * instance for progress tracking.
 */
export function useFileUpload() {
    const { selectedFolder, loadFolder } = useFolderContext();

    const upload = (files: File[]) => {
        if (!selectedFolder) {
            toast.error('Select a folder before uploading files');
            return;
        }

        const validFiles = files.filter((file) => {
            if (file.size > MAX_FILE_SIZE_BYTES) {
                toast.error(`${file.name} exceeds the 100 MB limit`);
                return false;
            }
            return true;
        });

        if (!validFiles.length) return;

        const formData = new FormData();
        validFiles.forEach((file) => formData.append('files[]', file));
        formData.append('folder_id', selectedFolder.uuid);

        router.post(route('files.store'), formData, {
            onSuccess: () => {
                loadFolder(selectedFolder.uuid);
                toast.success(`${validFiles.length} file(s) uploaded`);
            },
            onError: () => {
                toast.error('Upload failed. Please try again.');
            },
        });
    };

    return { upload, canUpload: !!selectedFolder };
}
