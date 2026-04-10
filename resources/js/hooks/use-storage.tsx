import { usePage } from '@inertiajs/react';
import { useFileSize } from '@/hooks/use-file-size';
import { type SharedData } from '@/types';

const STORAGE_TOTAL_BYTES = 15 * 1024 * 1024 * 1024; // 15 GB

export function useStorage() {
    const { storageUsed } = usePage<SharedData>().props;
    const formatSize = useFileSize();

    const pct = Math.min((storageUsed / STORAGE_TOTAL_BYTES) * 100, 100);

    return {
        pct,
        label: `${formatSize(storageUsed)} of ${formatSize(STORAGE_TOTAL_BYTES)} used`,
    };
}
