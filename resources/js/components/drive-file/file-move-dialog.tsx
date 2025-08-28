import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { DriveFile, Folder } from '@/types/folder';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { FolderPickerNode, FolderTreePicker } from '../folder/folder-tree-picker';
import { useEffect, useState } from 'react';
import { FolderProvider } from '@/contexts/folder-context';

interface FileMoveDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    files: DriveFile[];
}

export function FileMoveDialog({ open, onOpenChange, files }: FileMoveDialogProps) {
    const [folders, setFolders] = useState<Folder[]>([]);

    const { data, setData, post, processing } = useForm({
        file_ids: files.map((file) => file.uuid),
        target_folder_id: '',
    });

    // async function loadFolder(folderUuid: string) {
    //         const res = await fetch(route('folders.load', folderUuid));
    //         const { folder } = await res.json();

    //         const newFolders = folders.map((f) => {
    //             if (f.uuid === folderUuid) {
    //                 return {
    //                 ...f,
    //                 children: folder.children
    //                 };
    //             }

    //             if (f.children?.length) {
    //                 return {
    //                 ...f,
    //                 children: await loadFolder()
    //                 };
    //             }

    //             return f;
    //         });

    //         console.debug('newFolders', newFolders);

    //         setFolders(newFolders);
    // }

    const handleOnSelectFolder = (folderId: string) => {
        setData('target_folder_id', folderId);

        // await loadFolder(folderId);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route('files.move'), {
            onSuccess: () => onOpenChange(false),
            onError: (errors) => {
                toast.error('File move failed!');
                console.error(errors);
            },
        });
    };

    useEffect(() => {
      fetch(route('folders.tree'))
        .then((res) => res.json())
        .then(({ folders }) => setFolders(folders))
        .catch((error) => console.error(error));
    }, []);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Move {files.length} file(s)</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <FolderProvider initialFolders={folders}>
                        <FolderTreePicker  onSelect={handleOnSelectFolder} />
                    </FolderProvider>

                    {/* <Select value={data.target_folder_id} onValueChange={(value) => setData('target_folder_id', value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select target folder" />
                        </SelectTrigger>
                        <SelectContent>
                            {folders.map((folder) => (
                                <SelectItem key={folder.uuid} value={folder.uuid}>
                                    {folder.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select> */}
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
