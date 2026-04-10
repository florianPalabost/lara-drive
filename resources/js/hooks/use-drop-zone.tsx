import { useCallback, useState } from 'react';

interface UseDropZoneOptions {
    onFilesDropped: (files: File[]) => void;
}

/**
 * Encapsulates all drag-and-drop state and event handlers.
 * Uses a counter instead of a boolean to handle nested drag enter/leave
 * events that fire when moving over child elements.
 */
export function useDropZone({ onFilesDropped }: UseDropZoneOptions) {
    const [isDragging, setIsDragging] = useState(false);
    const [dragCounter, setDragCounter] = useState(0);

    const onDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter((c) => {
            if (c === 0) setIsDragging(true);
            return c + 1;
        });
    }, []);

    const onDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter((c) => {
            const next = c - 1;
            if (next === 0) setIsDragging(false);
            return next;
        });
    }, []);

    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const onDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            setDragCounter(0);

            const files = Array.from(e.dataTransfer.files);
            if (files.length > 0) {
                onFilesDropped(files);
            }
        },
        [onFilesDropped],
    );

    return { isDragging, onDragEnter, onDragLeave, onDragOver, onDrop };
}
