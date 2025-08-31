import { createContext, useContext, useEffect, useState } from 'react';
import { useBreadcrumbs } from '@/hooks/use-breadcrumbs';
import { Folder } from '@/types/folder';

interface FolderContextProps {
    folders: Folder[];
    setFolders: (folders: Folder[]) => void;
    selectedFolder: Folder | null;
    setSelectedFolder: (folder: Folder | null) => void;
    updateFolderChildren: (updated: Folder) => void;
    loadFolder: (uuid: string) => Promise<void>;
}

const FolderContext = createContext<FolderContextProps | undefined>(undefined);

export const useFolderContext = () => {
    const context = useContext(FolderContext);

    if (!context) {
        throw new Error('useFolderContext must be used within a FolderProvider');
    }

    return context;
};

interface FolderProviderProps {
    children: React.ReactNode;
    initialFolders: Folder[];
    initialSelected?: Folder | null;
}

export function FolderProvider({ children, initialFolders, initialSelected = null }: FolderProviderProps) {
    const [folders, setFolders] = useState<Folder[]>(initialFolders);
    const [selectedFolder, setSelectedFolder] = useState<Folder | null>(initialSelected);
    const { setBreadcrumbs } = useBreadcrumbs();

    const updateFolderChildren = (updated: Folder) => {
        setFolders((prev) => updateFolderInTree(prev, updated));
    };

    const loadFolder = async (uuid: string) => {
        const res = await fetch(route('folders.load', uuid));
        const { folder, breadcrumbs } = await res.json();
        setSelectedFolder(folder);
        // TODO: only uodate if "naviagte from tree sidebar"
        setBreadcrumbs(breadcrumbs);
        updateFolderChildren(folder);
    };

    useEffect(() => {
        setFolders(initialFolders); //  update when prop changes
    }, [initialFolders]);

    return (
        <FolderContext.Provider
            value={{
                folders,
                setFolders,
                selectedFolder,
                setSelectedFolder,
                updateFolderChildren,
                loadFolder,
            }}
        >
            {children}
        </FolderContext.Provider>
    );
}

export function updateFolderInTree(tree: Folder[], updated: Folder): Folder[] {
    return tree.map((folder) => {
        if (folder.uuid === updated.uuid) {
            return {
                ...folder,
                ...updated,
            };
        }

        if (folder.children?.length) {
            return {
                ...folder,
                children: updateFolderInTree(folder.children, updated),
            };
        }

        return folder;
    });
}
