import { router } from '@inertiajs/react';
import {
    Archive,
    Check,
    Download,
    Eye,
    FolderIcon,
    FolderInput,
    History,
    MoreVertical,
    MoveRight,
    Share2,
    Trash2,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { FileMoveDialog } from '@/components/drive-file/file-move-dialog';
import { FilePreviewDialog } from '@/components/drive-file/file-preview-dialog';
import { FileShareDialog } from '@/components/drive-file/file-share-dialog';
import { useFolderContext } from '@/contexts/folder-context';
import { useFileSize } from '@/hooks/use-file-size';
import { DriveFile, DriveFileVersion, Folder } from '@/types/folder';
import { getFileIcon } from '@/utils/mime-icons';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface FolderContentItemsProps {
    folders: Folder[];
    files: DriveFile[];
    viewMode: 'grid' | 'list';
    onSelectFolder: (folder: Folder) => void;
}

export function FolderContentItems({ folders, files, viewMode, onSelectFolder }: FolderContentItemsProps) {
    const { selectedFolder } = useFolderContext();

    const [selectedFileUuids, setSelectedFileUuids] = useState<Set<string>>(new Set());
    const [selectedFolderUuids, setSelectedFolderUuids] = useState<Set<string>>(new Set());
    const [previewFile, setPreviewFile] = useState<DriveFileVersion | null>(null);
    const [shareFile, setShareFile] = useState<DriveFile | null>(null);
    const [moveOpen, setMoveOpen] = useState(false);

    const totalSelected = selectedFileUuids.size + selectedFolderUuids.size;

    const toggleFile = (uuid: string) =>
        setSelectedFileUuids((prev) => {
            const next = new Set(prev);
            next.has(uuid) ? next.delete(uuid) : next.add(uuid);
            return next;
        });

    const toggleFolder = (uuid: string) =>
        setSelectedFolderUuids((prev) => {
            const next = new Set(prev);
            next.has(uuid) ? next.delete(uuid) : next.add(uuid);
            return next;
        });

    const allFilesSelected = files.length > 0 && selectedFileUuids.size === files.length;
    const allFoldersSelected = folders.length > 0 && selectedFolderUuids.size === folders.length;
    const allSelected = allFilesSelected && allFoldersSelected;
    const someSelected = totalSelected > 0 && !allSelected;

    const selectAll = () => {
        setSelectedFileUuids(new Set(files.map((f) => f.uuid)));
        setSelectedFolderUuids(new Set(folders.map((f) => f.uuid)));
    };

    const clearSelection = () => {
        setSelectedFileUuids(new Set());
        setSelectedFolderUuids(new Set());
    };

    const handleBulkDelete = () => {
        const parts = [];
        if (selectedFileUuids.size > 0) parts.push(`${selectedFileUuids.size} file(s)`);
        if (selectedFolderUuids.size > 0) parts.push(`${selectedFolderUuids.size} folder(s)`);
        if (!confirm(`Delete ${parts.join(' and ')}?`)) return;

        const deleteFiles = () =>
            new Promise<void>((resolve, reject) => {
                if (selectedFileUuids.size === 0) return resolve();
                router.post(
                    route('files.archive.bulk'),
                    { current_folder_id: selectedFolder?.uuid, file_ids: [...selectedFileUuids] },
                    { onSuccess: () => resolve(), onError: reject },
                );
            });

        const deleteFolders = () =>
            new Promise<void>((resolve, reject) => {
                if (selectedFolderUuids.size === 0) return resolve();
                router.post(
                    route('folders.bulk.destroy'),
                    { current_folder_id: selectedFolder?.uuid, folder_ids: [...selectedFolderUuids] },
                    { onSuccess: () => resolve(), onError: reject },
                );
            });

        deleteFiles()
            .then(deleteFolders)
            .then(() => {
                toast.success(`${totalSelected} item(s) deleted`);
                clearSelection();
            })
            .catch(() => toast.error('Delete failed'));
    };

    const handleDeleteFile = (file: DriveFile) => {
        if (confirm(`Delete "${file.original_name}"?`)) {
            router.delete(route('files.destroy', file.uuid), {
                onSuccess: () => toast.success('File deleted'),
                onError: () => toast.error('Delete failed'),
            });
        }
    };

    const handleDeleteFolder = (folder: Folder) => {
        if (confirm(`Delete "${folder.name}"?`)) {
            router.delete(route('folders.destroy', folder.uuid), {
                onSuccess: () => toast.success('Folder deleted'),
                onError: () => toast.error('Delete failed'),
            });
        }
    };

    const isPreviewable = (mime: string) => mime.startsWith('image/') || mime === 'application/pdf';

    if (folders.length === 0 && files.length === 0) {
        return <p className="text-gray-500 italic">This folder is empty.</p>;
    }

    return (
        <div className="space-y-3">
            {/* Bulk actions bar */}
            {totalSelected > 0 && (
                <div className="flex items-center justify-between rounded-xl bg-blue-600 px-4 py-2.5 text-white shadow">
                    <div className="flex items-center gap-3">
                        <button onClick={clearSelection} className="rounded p-1 hover:bg-blue-700 transition-colors">
                            <X className="h-4 w-4" />
                        </button>
                        <span className="text-sm font-medium">{totalSelected} selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setMoveOpen(true)}
                            className="flex items-center gap-1.5 rounded-lg bg-blue-700 px-3 py-1.5 text-sm font-medium hover:bg-blue-800 transition-colors"
                        >
                            <FolderInput className="h-4 w-4" /> Move
                        </button>
                        <button
                            onClick={handleBulkDelete}
                            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                            <Archive className="h-4 w-4" /> Delete
                        </button>
                    </div>
                </div>
            )}

            {/* Grid view */}
            {viewMode === 'grid' && (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3">
                    {folders.map((folder) => (
                        <FolderCard
                            key={`folder-${folder.id}`}
                            folder={folder}
                            selected={selectedFolderUuids.has(folder.uuid)}
                            onToggleSelect={() => toggleFolder(folder.uuid)}
                            onOpen={() => onSelectFolder(folder)}
                            onDelete={() => handleDeleteFolder(folder)}
                        />
                    ))}
                    {files.map((file) => (
                        <FileCard
                            key={`file-${file.id}`}
                            file={file}
                            selected={selectedFileUuids.has(file.uuid)}
                            onToggleSelect={() => toggleFile(file.uuid)}
                            onPreview={isPreviewable(file.current_version.mime_type) ? () => setPreviewFile(file.current_version) : undefined}
                            onShare={() => setShareFile(file)}
                            onMove={() => { setSelectedFileUuids(new Set([file.uuid])); setMoveOpen(true); }}
                            onDelete={() => handleDeleteFile(file)}
                            onHistory={() => router.get(route('files.versions.index', file.uuid))}
                        />
                    ))}
                </div>
            )}

            {/* List view */}
            {viewMode === 'list' && (
                <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-neutral-200 bg-neutral-50">
                                <th className="w-10 px-3 py-2.5">
                                    <Checkbox
                                        checked={allSelected}
                                        indeterminate={someSelected}
                                        onChange={(checked) => (checked ? selectAll() : clearSelection())}
                                    />
                                </th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium text-neutral-500">Name</th>
                                <th className="w-44 px-4 py-2.5 text-left text-xs font-medium text-neutral-500">Modified</th>
                                <th className="w-28 px-4 py-2.5 text-left text-xs font-medium text-neutral-500">Size</th>
                                <th className="w-12"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {folders.map((folder) => (
                                <FolderRow
                                    key={`folder-${folder.id}`}
                                    folder={folder}
                                    selected={selectedFolderUuids.has(folder.uuid)}
                                    onToggleSelect={() => toggleFolder(folder.uuid)}
                                    onOpen={() => onSelectFolder(folder)}
                                    onDelete={() => handleDeleteFolder(folder)}
                                />
                            ))}
                            {files.map((file) => (
                                <FileRow
                                    key={`file-${file.id}`}
                                    file={file}
                                    selected={selectedFileUuids.has(file.uuid)}
                                    onToggleSelect={() => toggleFile(file.uuid)}
                                    onPreview={isPreviewable(file.current_version.mime_type) ? () => setPreviewFile(file.current_version) : undefined}
                                    onShare={() => setShareFile(file)}
                                    onMove={() => { setSelectedFileUuids(new Set([file.uuid])); setMoveOpen(true); }}
                                    onDelete={() => handleDeleteFile(file)}
                                    onHistory={() => router.get(route('files.versions.index', file.uuid))}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Dialogs */}
            {previewFile && (
                <FilePreviewDialog open onOpenChange={(open) => !open && setPreviewFile(null)} fileVersion={previewFile} />
            )}
            {shareFile && (
                <FileShareDialog open onOpenChange={(open) => !open && setShareFile(null)} file={shareFile} />
            )}
            {moveOpen && (
                <FileMoveDialog
                    open
                    onOpenChange={(open) => { setMoveOpen(open); if (!open) clearSelection(); }}
                    fileUuids={[...selectedFileUuids]}
                    folderUuids={[...selectedFolderUuids]}
                />
            )}
        </div>
    );
}

// ─── Checkbox primitive ────────────────────────────────────────────────────────

function Checkbox({
    checked,
    indeterminate = false,
    onChange,
}: {
    checked: boolean;
    indeterminate?: boolean;
    onChange?: (checked: boolean) => void;
}) {
    return (
        <button
            type="button"
            role="checkbox"
            aria-checked={indeterminate ? 'mixed' : checked}
            onClick={(e) => { e.stopPropagation(); onChange?.(!checked); }}
            className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                checked || indeterminate
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-neutral-300 bg-white hover:border-blue-400'
            }`}
        >
            {indeterminate && <span className="block h-0.5 w-2 bg-white" />}
            {checked && !indeterminate && <Check className="h-3 w-3" />}
        </button>
    );
}

// ─── Grid cards ────────────────────────────────────────────────────────────────

interface FolderCardProps {
    folder: Folder;
    selected: boolean;
    onToggleSelect: () => void;
    onOpen: () => void;
    onDelete: () => void;
}

function FolderCard({ folder, selected, onToggleSelect, onOpen, onDelete }: FolderCardProps) {
    return (
        <div
            onClick={onOpen}
            className={`group relative flex flex-col overflow-hidden rounded-xl border transition-all cursor-pointer ${
                selected ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm'
            }`}
        >
            <div className="relative flex aspect-square items-center justify-center bg-blue-50">
                <FolderIcon className="h-12 w-12 text-blue-400" />
                <div
                    className={`absolute left-2 top-2 transition-opacity ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                    onClick={(e) => { e.stopPropagation(); onToggleSelect(); }}
                >
                    <Checkbox checked={selected} onChange={onToggleSelect} />
                </div>
            </div>
            <div className="flex items-center justify-between gap-1 px-3 py-2">
                <span className="truncate text-sm font-medium text-neutral-800" title={folder.name}>
                    {folder.name}
                </span>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <button className="shrink-0 rounded p-1 opacity-0 transition-all hover:bg-neutral-100 group-hover:opacity-100">
                            <MoreVertical className="h-3.5 w-3.5 text-neutral-500" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-red-600 focus:text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}

interface FileCardProps {
    file: DriveFile;
    selected: boolean;
    onToggleSelect: () => void;
    onPreview?: () => void;
    onShare: () => void;
    onMove: () => void;
    onDelete: () => void;
    onHistory: () => void;
}

function FileCard({ file, selected, onToggleSelect, onPreview, onShare, onMove, onDelete, onHistory }: FileCardProps) {
    const formatSize = useFileSize();
    const Icon = getFileIcon(file.current_version.mime_type);

    return (
        <div
            onClick={onPreview}
            className={`group relative flex flex-col overflow-hidden rounded-xl border transition-all cursor-pointer ${
                selected ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm'
            }`}
        >
            <div className="relative flex aspect-square items-center justify-center bg-neutral-50">
                <Icon className="h-12 w-12 text-neutral-400" />
                <div
                    className={`absolute left-2 top-2 transition-opacity ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                    onClick={(e) => { e.stopPropagation(); onToggleSelect(); }}
                >
                    <Checkbox checked={selected} onChange={onToggleSelect} />
                </div>
            </div>
            <div className="px-3 py-2">
                <div className="flex items-center justify-between gap-1">
                    <span className="truncate text-sm font-medium text-neutral-800" title={file.original_name}>
                        {file.original_name}
                    </span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <button className="shrink-0 rounded p-1 opacity-0 transition-all hover:bg-neutral-100 group-hover:opacity-100">
                                <MoreVertical className="h-3.5 w-3.5 text-neutral-500" />
                            </button>
                        </DropdownMenuTrigger>
                        <FileDropdownItems file={file} onPreview={onPreview} onShare={onShare} onMove={onMove} onDelete={onDelete} onHistory={onHistory} />
                    </DropdownMenu>
                </div>
                <p className="text-xs text-neutral-400">{formatSize(file.current_version.size)}</p>
            </div>
        </div>
    );
}

// ─── List rows ─────────────────────────────────────────────────────────────────

function FolderRow({ folder, selected, onToggleSelect, onOpen, onDelete }: FolderCardProps) {
    return (
        <tr
            onClick={onOpen}
            className={`group cursor-pointer transition-colors ${selected ? 'bg-blue-50' : 'hover:bg-neutral-50'}`}
        >
            <td className="px-3 py-2.5" onClick={(e) => { e.stopPropagation(); onToggleSelect(); }}>
                <Checkbox checked={selected} onChange={onToggleSelect} />
            </td>
            <td className="px-4 py-2.5">
                <div className="flex items-center gap-2.5">
                    <FolderIcon className="h-4 w-4 shrink-0 text-blue-400" />
                    <span className="text-sm font-medium text-neutral-800">{folder.name}</span>
                </div>
            </td>
            <td className="px-4 py-2.5 text-sm text-neutral-500">
                {new Date(folder.updated_at).toLocaleDateString()}
            </td>
            <td className="px-4 py-2.5 text-sm text-neutral-400">—</td>
            <td className="px-4 py-2.5">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <button className="rounded p-1 opacity-0 transition-all hover:bg-neutral-100 group-hover:opacity-100">
                            <MoreVertical className="h-4 w-4 text-neutral-500" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-red-600 focus:text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </td>
        </tr>
    );
}

function FileRow({ file, selected, onToggleSelect, onPreview, onShare, onMove, onDelete, onHistory }: FileCardProps) {
    const formatSize = useFileSize();
    const Icon = getFileIcon(file.current_version.mime_type);

    return (
        <tr
            onClick={onPreview}
            className={`group cursor-pointer transition-colors ${selected ? 'bg-blue-50' : 'hover:bg-neutral-50'}`}
        >
            <td className="px-3 py-2.5" onClick={(e) => { e.stopPropagation(); onToggleSelect(); }}>
                <Checkbox checked={selected} onChange={onToggleSelect} />
            </td>
            <td className="px-4 py-2.5">
                <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 shrink-0 text-neutral-400" />
                    <span className="text-sm font-medium text-neutral-800">{file.original_name}</span>
                </div>
            </td>
            <td className="px-4 py-2.5 text-sm text-neutral-500">
                {new Date(file.updated_at).toLocaleDateString()}
            </td>
            <td className="px-4 py-2.5 text-sm text-neutral-500">
                {formatSize(file.current_version.size)}
            </td>
            <td className="px-4 py-2.5">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <button className="rounded p-1 opacity-0 transition-all hover:bg-neutral-100 group-hover:opacity-100">
                            <MoreVertical className="h-4 w-4 text-neutral-500" />
                        </button>
                    </DropdownMenuTrigger>
                    <FileDropdownItems file={file} onPreview={onPreview} onShare={onShare} onMove={onMove} onDelete={onDelete} onHistory={onHistory} />
                </DropdownMenu>
            </td>
        </tr>
    );
}

// ─── Shared file dropdown ──────────────────────────────────────────────────────

interface FileDropdownItemsProps {
    file: DriveFile;
    onPreview?: () => void;
    onShare: () => void;
    onMove: () => void;
    onDelete: () => void;
    onHistory: () => void;
}

function FileDropdownItems({ file, onPreview, onShare, onMove, onDelete, onHistory }: FileDropdownItemsProps) {
    return (
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            {onPreview && (
                <DropdownMenuItem onClick={onPreview}>
                    <Eye className="mr-2 h-4 w-4 text-blue-500" /> Preview
                </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
                <a href={`/files/${file.uuid}/versions/${file.current_version.uuid}/download`}>
                    <Download className="mr-2 h-4 w-4 text-green-600" /> Download
                </a>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onShare}>
                <Share2 className="mr-2 h-4 w-4" /> Share
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onMove}>
                <MoveRight className="mr-2 h-4 w-4" /> Move
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onHistory}>
                <History className="mr-2 h-4 w-4" /> History
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} className="text-red-600 focus:text-red-600">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
        </DropdownMenuContent>
    );
}
