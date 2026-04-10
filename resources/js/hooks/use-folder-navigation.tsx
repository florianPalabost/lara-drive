import { router, usePage } from '@inertiajs/react';
import { useFolderContext } from '@/contexts/folder-context';

/**
 * Provides a single `navigateToFolder` function that behaves differently
 * depending on the current page:
 *
 * - On /folders: loads folder data in-place (SPA, no navigation)
 * - Anywhere else: navigates to /folders?folder=uuid so FolderContent
 *   mounts and shows the selected folder
 */
export function useFolderNavigation() {
    const { url } = usePage();
    const { loadFolder } = useFolderContext();

    const navigateToFolder = (uuid: string) => {
        if (url.startsWith('/folders')) {
            loadFolder(uuid);
        } else {
            router.visit(route('folders.index', { folder: uuid }));
        }
    };

    return { navigateToFolder };
}
