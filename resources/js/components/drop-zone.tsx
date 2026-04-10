import { FileUp } from 'lucide-react';
import { useDropZone } from '@/hooks/use-drop-zone';

interface DropZoneProps {
    onFilesDropped: (files: File[]) => void;
    children: React.ReactNode;
}

export function DropZone({ onFilesDropped, children }: DropZoneProps) {
    const { isDragging, onDragEnter, onDragLeave, onDragOver, onDrop } = useDropZone({ onFilesDropped });

    return (
        <div
            className="relative size-full"
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
        >
            {children}

            {isDragging && (
                <div className="absolute inset-0 z-50 flex items-center justify-center rounded-lg border-4 border-dashed border-blue-500 bg-blue-50/95 dark:bg-blue-950/90">
                    <div className="text-center">
                        <div className="mb-4 flex justify-center">
                            <div className="rounded-full bg-blue-600 p-6">
                                <FileUp className="h-12 w-12 text-white" />
                            </div>
                        </div>
                        <h3 className="mb-1 text-2xl font-semibold text-blue-900 dark:text-blue-100">Drop files here</h3>
                        <p className="text-blue-700 dark:text-blue-300">Release to upload to this folder</p>
                    </div>
                </div>
            )}
        </div>
    );
}
