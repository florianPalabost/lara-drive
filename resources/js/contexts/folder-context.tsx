import { createContext, useContext, useState } from 'react';
import { Folder } from '@/types/folder';

interface FolderContextProps {
    folders: Folder[];
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

    const updateFolderChildren = (updated: Folder) => {
        setFolders((prev) => updateFolderInTree(prev, updated));
    };

    const loadFolder = async (uuid: string) => {
        const res = await fetch(route('folders.load', uuid));
        const { folder } = await res.json();
        setSelectedFolder(folder);
        updateFolderChildren(folder);
    };

    return (
        <FolderContext.Provider value={{ folders, selectedFolder, setSelectedFolder, updateFolderChildren, loadFolder }}>
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
