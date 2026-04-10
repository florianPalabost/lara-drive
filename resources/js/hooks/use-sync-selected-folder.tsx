import { useEffect } from 'react';
import { useFolderContext } from '@/contexts/folder-context';
import { Folder } from '@/types/folder';

/**
 * Syncs a page-level `selectedFolder` prop into the layout-level FolderContext.
 *
 * Since FolderProvider now lives at layout level, it has no knowledge of which
 * folder the controller selected for this specific page visit. This hook bridges
 * the gap by pushing the page prop into the shared context on mount and on change.
 *
 * It also calls `updateFolderChildren` so the sidebar tree reflects the loaded
 * children of the selected folder.
 */
export function useSyncSelectedFolder(folder: Folder | null | undefined) {
    const { setSelectedFolder, updateFolderChildren } = useFolderContext();

    useEffect(() => {
        if (!folder) return;

        setSelectedFolder(folder);
        updateFolderChildren(folder);
    }, [folder?.uuid]);
}
