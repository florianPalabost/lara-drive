import { useCallback } from 'react';

export function useFileSize() {
    return useCallback((bytes: number): string => {
        switch (true) {
            case bytes < 1024:
                return `${bytes} B`;
            case bytes < 1024 * 1024:
                return `${(bytes / 1024).toFixed(1)} KB`;
            case bytes < 1024 * 1024 * 1024:
                return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
            default:
                return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
        }
    }, []);
}
