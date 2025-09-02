import { useForm } from '@inertiajs/react';
import { Row } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { FolderProvider } from '@/contexts/folder-context';
import { DriveFile, DriveFileVersion, Folder } from '@/types/folder';
import { useFileVersionHistoryDataTableContext } from '../data-table/file-versions-table';
import { FolderPickerNode, FolderTreePicker } from '../folder/folder-tree-picker';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

interface FileMoveDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function FileMoveDialog({ open, onOpenChange }: FileMoveDialogProps) {
    const [folders, setFolders] = useState<Folder[]>([]);

    const { selectedRows } = useFileVersionHistoryDataTableContext();

    const { data, setData, post, processing } = useForm({
        file_ids: selectedRows.map((row: Row<DriveFileVersion>) => row.original.file.uuid),
        target_folder_id: '',
    });

    console.debug('move dialog data', data);

    const handleOnSelectFolder = (folderId: string) => {
        setData('target_folder_id', folderId);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route('files.move'), {
            onSuccess: () => {
                toast.success('File(s) moved successfully!');
                onOpenChange(false);
            },
            onError: (errors) => {
                toast.error('File move failed!');
                console.error(errors);
            },
        });
    };

    useEffect(() => {
        async function loadFolders() {
            try {
                const res = await fetch(route('folders.tree'));
                const { folders } = await res.json();
                setFolders(folders);
                console.debug('folders loaded move dialog', folders);
            } catch (err) {
                console.error(err);
            }
        }

        loadFolders();
    }, []);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Move {selectedRows.length} file(s)</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <FolderProvider initialFolders={folders}>
                        <FolderTreePicker onSelect={handleOnSelectFolder} />
                    </FolderProvider>

                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            Move
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
