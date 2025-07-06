import { router } from '@inertiajs/react';
import { FolderIcon, FolderOpen, LucideImport, LucidePlus } from 'lucide-react';
import { NodeApi, Tree, TreeApi, TreeNodeProps } from 'react-arborist';
import { useFolderContext } from '@/contexts/folder-context';
import { Folder } from '@/types/folder';
import { FolderTreeNode } from './folder-tree-node';
import { Button } from './ui/button';
import { useEffect, useRef } from 'react';

export function FolderTree() {
    const treeRef = useRef<TreeApi<Folder>>(null);
    const { folders, selectedFolder, loadFolder } = useFolderContext();

    console.debug('rendering FolderTree');

    const handleOnSelect = async (nodes: NodeApi<Folder>[]) => {
        if (!nodes.length) return;

        const node = nodes[0];
        const folderUuid = node.data.uuid;

        node.toggle();

        // Do nothing more if the folder is already loaded
        if (folderUuid === selectedFolder?.uuid) return;

        loadFolder(folderUuid);
    };

    useEffect(() => {
        if (selectedFolder && treeRef.current) {
            const node = treeRef.current.get(selectedFolder.uuid);

            if (node && !node.isSelected) {
                node.select();
                node.open();
            }
        }
    }, [selectedFolder]);

    return (
        <div className="border rounded-lg bg-white shadow-sm p-4 max-h-screen overflow-auto">
            <div className="border rounded-md bg-white shadow-sm p-2 h-full flex flex-col">
                <Button className="text-sm mb-4 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-center">
                    <a href={route('folders.create', { folder: selectedFolder?.uuid })} className="flex items-center">
                        <LucidePlus className="mr-2" /> Add folder
                    </a>
                </Button>
                <Button className="text-sm mb-4 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-center">
                    <a href={route('folders.import', { folder: selectedFolder?.uuid })} className="flex items-center">
                        <LucideImport className="mr-2" /> Import folder
                    </a>
                </Button>
                <Tree
                    ref={treeRef}
                    data={folders}
                    openByDefault={false}
                    childrenAccessor="children"
                    idAccessor="uuid"
                    parentIdAccessor="parent_id"
                    onSelect={handleOnSelect}
                    disableDrag
                    disableMultiSelection
                    className="text-sm"
                    rowHeight={32}
                    height={window.innerHeight - 150}
                >
                    {({ node, style, dragHandle }: TreeNodeProps<Folder>) => <FolderTreeNode node={node} style={style} dragHandle={dragHandle} />}
                </Tree>
            </div>
        </div>
    );
}
