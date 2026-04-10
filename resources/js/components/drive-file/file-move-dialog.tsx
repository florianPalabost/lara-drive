import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { FolderProvider, useFolderContext } from '@/contexts/folder-context';
import { Folder } from '@/types/folder';
import { FolderTreePicker } from '../folder/folder-tree-picker';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';

interface FileMoveDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    fileUuids?: string[];
    folderUuids?: string[];
}

export function FileMoveDialog({ open, onOpenChange, fileUuids = [], folderUuids = [] }: FileMoveDialogProps) {
    const [folders, setFolders] = useState<Folder[]>([]);
    const [targetFolderId, setTargetFolderId] = useState('');
    const [processing, setProcessing] = useState(false);
    const { loadFolder, selectedFolder } = useFolderContext();

    const totalCount = fileUuids.length + folderUuids.length;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!targetFolderId) return;

        setProcessing(true);

        const moveFiles = () =>
            new Promise<void>((resolve, reject) => {
                if (fileUuids.length === 0) return resolve();
                router.post(
                    route('files.move'),
                    { file_ids: fileUuids, target_folder_id: targetFolderId },
                    { onSuccess: () => resolve(), onError: reject },
                );
            });

        const moveFolders = () =>
            new Promise<void>((resolve, reject) => {
                if (folderUuids.length === 0) return resolve();
                router.post(
                    route('folders.move'),
                    { folder_ids: folderUuids, target_folder_id: targetFolderId },
                    { onSuccess: () => resolve(), onError: reject },
                );
            });

        moveFiles()
            .then(moveFolders)
            .then(() => {
                toast.success(`${totalCount} item(s) moved`);
                onOpenChange(false);
                if (selectedFolder?.uuid) loadFolder(selectedFolder.uuid);
            })
            .catch(() => toast.error('Move failed'))
            .finally(() => setProcessing(false));
    };

    useEffect(() => {
        async function loadFolders() {
            try {
                const res = await fetch(route('folders.tree'));
                const { folders } = await res.json();
                setFolders(folders);
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
                    <DialogTitle>Move {totalCount} item(s)</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <FolderProvider initialFolders={folders}>
                        <FolderTreePicker onSelect={setTargetFolderId} />
                    </FolderProvider>
                    <DialogFooter>
                        <Button type="submit" disabled={processing || !targetFolderId}>
                            Move
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
