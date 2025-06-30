import { createContext, useContext, useState } from 'react';
import { Folder } from '@/types/folder';

interface FolderContextProps {
    folders: Folder[];
    selectedFolder: Folder | null;
    setSelectedFolder: (folder: Folder | null) => void;
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
    const [selectedFolder, setSelectedFolder] = useState<Folder | null>(initialSelected);

    return <FolderContext.Provider value={{ folders: initialFolders, selectedFolder, setSelectedFolder }}>{children}</FolderContext.Provider>;
}
