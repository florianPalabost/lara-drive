import { router } from '@inertiajs/react';
import { FolderInput, FolderPlus } from 'lucide-react';
import { toast } from 'sonner';
import { useFolderContext } from '@/contexts/folder-context';
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

export function FolderActions() {
    const { selectedFolder } = useFolderContext();

    const handleNewFolder = () => {
        router.get(route('folders.create', selectedFolder ? { folder: selectedFolder.uuid } : {}));
    };

    const handleImportFolder = () => {
        if (!selectedFolder) {
            toast.error('Select a folder first');
            return;
        }
        router.get(route('folders.import', { folder: selectedFolder.uuid }));
    };

    return (
        <SidebarGroup className="px-2 py-1 group-data-[collapsible=icon]:hidden">
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleNewFolder} tooltip="New Folder">
                        <FolderPlus />
                        <span>New Folder</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleImportFolder} tooltip="Import Folder">
                        <FolderInput />
                        <span>Import Folder</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    );
}
