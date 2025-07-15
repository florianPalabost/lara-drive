import { useForm } from '@inertiajs/react';
import { LucideCopy } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { useApi } from '@/hooks/use-api';
import { FileShareResponse } from '@/services/api/share-file';
import { DriveFile } from '@/types/folder';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select';

interface FileShareDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    file: DriveFile;
}

export function FileShareDialog({ open, onOpenChange, file }: FileShareDialogProps) {
    const api = useApi();
    const [shareWithUser, setShareWithUser] = useState(false);
    const [shareLink, setShareLink] = useState<string | null>(null);

    const { data, setData, processing, errors, reset } = useForm({
        user_email: '',
        permission: 'read', // 'read', 'write'
        expires_in: 'never', // '1d', '7d', '30d', 'never'
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const response = await api
                .post(`files/${file.uuid}/share`, {
                    json: {
                        user_email: data.user_email,
                        permission: data.permission,
                        expires_in: data.expires_in,
                    },
                })
                .json<FileShareResponse>();

            toast.success('File shared successfully');
            setShareLink(response.share_link);
            reset();
        } catch (error: unknown) {
            toast.error('Failed to share file');
            console.error(error);
        }
    };

    const handleCopy = () => {
        if (!shareLink) return;

        navigator.clipboard.writeText(shareLink);
        toast.success('Link copied to clipboard !');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogTitle>Share "{file.original_name}"</DialogTitle>

                {shareLink ? (
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">Shareable link:</p>
                        <div className="flex items-center space-x-2">
                            <Input readOnly value={shareLink} className="flex-1" />
                            <Button size="icon" variant="outline" onClick={handleCopy}>
                                <LucideCopy className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ) : null}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="shareWithUser" checked={shareWithUser} onCheckedChange={(v) => setShareWithUser(!!v)} />
                        <label htmlFor="shareWithUser" className="text-sm">
                            Share with internal account user email
                        </label>
                    </div>

                    {shareWithUser && (
                        <div>
                            <Input
                                type="email"
                                placeholder="Recipient's email"
                                value={data.user_email}
                                onChange={(e) => setData('user_email', e.target.value)}
                            />
                            {errors.user_email && <p className="text-sm text-red-500">{errors.user_email}</p>}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Permission</label>
                        <Select value={data.permission} onValueChange={(val) => setData('permission', val)}>
                            <SelectTrigger>
                                <span>{data.permission}</span>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="read">Read</SelectItem>
                                <SelectItem value="write">Write</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Expiration</label>
                        <Select value={data.expires_in} onValueChange={(val) => setData('expires_in', val)}>
                            <SelectTrigger>
                                <span>{data.expires_in}</span>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1d">1 Day</SelectItem>
                                <SelectItem value="7d">7 Days</SelectItem>
                                <SelectItem value="30d">30 Days</SelectItem>
                                <SelectItem value="never">Never</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            Share File
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
