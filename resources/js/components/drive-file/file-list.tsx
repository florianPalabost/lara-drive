import { router } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { LucideFolderInput } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import FileVersionTable from "@/components/data-table/file-versions-table";
import { DriveFile, DriveFileVersion } from "@/types/folder";
import { fileListColumns } from "../data-table/columns/file-list-columns";
import { DriveFileListActions } from "../data-table/row-actions/file-list-row-actions";
import { Button } from "../ui/button";
// import { createDataTableComponent } from '../ui/data-table/data-table';
import { FileListRow } from "./file-list-row";
import { FileMoveDialog } from "./file-move-dialog";
import { FilePreviewDialog } from "./file-preview-dialog";
import { FileShareDialog } from "./file-share-dialog";

interface FileListProps {
    files: Array<DriveFile>;
}

export function FileList({ files }: FileListProps) {
    const [previewFile, setPreviewFile] = useState<DriveFileVersion | null>(
        null,
    );
    const [shareFile, setShareFile] = useState<DriveFile | null>(null);
    const [moveOpen, setMoveOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const allSelected = selectedFiles.length === files.length;

    // const toggleSelect = (fileUuid: string) => {
    //     setSelectedFiles((prev) =>
    //         prev.includes(fileUuid)
    //             ? prev.filter((id) => id !== fileUuid)
    //             : [...prev, fileUuid],
    //     );
    // };
    // const toggleSelectAll = () => {
    //     setSelectedFiles(allSelected ? [] : files.map((f) => f.uuid));
    // };

    const handlePreviewFile = (file: DriveFileVersion) => {
        setPreviewFile(file);
    };

    const handleDeleteFile = (file: DriveFile) => () => {
        if (confirm("Are you sure you want to delete this file?")) {
            router.delete(route("files.destroy", file.uuid), {
                onSuccess: () => {
                    toast.success("File deleted successfully!");
                },
            });
        }
    };

    const columns: ColumnDef<DriveFileVersion>[] = useMemo(
        () => fileListColumns(),
        [],
    );
    const actions: DriveFileListActions = {
        onMoveFile: (file) => setMoveOpen(true),
        onDeleteFile: handleDeleteFile,
        onPreviewFile: handlePreviewFile,
        onShareFile: (file) => setShareFile(file),
        onViewHistory: (file) =>
            router.get(route("files.versions.index", file.uuid)),
    };

    if (!files.length) {
        return <p className="text-gray-500 italic">No files in this folder.</p>;
    }

    return (
        <div className="space-y-6">
            <FileVersionTable
                columns={columns}
                data={files.map((f) => f.current_version)}
                actions={actions}
            >
                <FileVersionTable.Toolbar>
                    <div className="flex items-center gap-2">TODO Toolbar</div>
                </FileVersionTable.Toolbar>

                <FileVersionTable.View />

                <FileVersionTable.Pagination />
            </FileVersionTable>

            {previewFile && (
                <FilePreviewDialog
                    open={!!previewFile}
                    onOpenChange={(open) =>
                        setPreviewFile(open ? previewFile : null)
                    }
                    fileVersion={previewFile}
                />
            )}

            {shareFile && (
                <FileShareDialog
                    open={!!shareFile}
                    onOpenChange={(open) =>
                        setShareFile(open ? shareFile : null)
                    }
                    file={shareFile}
                />
            )}

            {moveOpen && (
                <FileMoveDialog
                    open={moveOpen}
                    onOpenChange={setMoveOpen}
                    files={files.filter((f) => selectedFiles.includes(f.uuid))}
                />
            )}
        </div>
    );
}
