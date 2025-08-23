import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { useFolderContext } from '@/contexts/folder-context';
import { DriveFile, Folder } from '@/types/folder';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface FileMoveDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    files: DriveFile[];
}

export function FileMoveDialog({ open, onOpenChange, files }: FileMoveDialogProps) {
    const { folders } = useFolderContext();
    const { data, setData, post, processing } = useForm({
        file_ids: files.map((file) => file.uuid),
        target_folder_id: '',
    });

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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Move {files.length} file(s)</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <Select value={data.target_folder_id} onValueChange={(value) => setData('target_folder_id', value)}>
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
                    </Select>
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
