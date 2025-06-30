import { FolderIcon, FolderOpen } from 'lucide-react';
import { NodeApi, Tree, TreeNodeProps } from 'react-arborist';
import { useFolderContext } from '@/contexts/folder-context';
import { Folder } from '@/types/folder';
import { Button } from './ui/button';

export function FolderTree() {
    const { folders, selectedFolder, setSelectedFolder } = useFolderContext();

    function handleOnSelect(nodes: NodeApi<Folder>[]) {
        if (!nodes || !nodes.length) return;

        const node = nodes[0];
        const isSelected = selectedFolder?.id === node.data.id;

        node.toggle();
        setSelectedFolder(isSelected ? null : node.data);
    }

    return (
        <div className="border rounded-lg bg-white shadow-sm p-4 max-h-screen overflow-auto">
            <div className="border rounded-md bg-white shadow-sm p-2 h-full flex flex-col">
                <Button className="text-sm mb-4 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-center">
                    <a href={route('folders.create', { folder: selectedFolder?.uuid })}>+ Add Folder</a>
                </Button>
                <Tree
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
                    {({ node, style, dragHandle }: TreeNodeProps<Folder>) => (
                        <div
                            style={{
                                ...style,
                                paddingLeft: `${node.level * 16}px`,
                            }}
                            ref={dragHandle}
                            className={`flex items-center gap-2 px-2 py-1 rounded-md transition-colors cursor-pointer
                            ${node.isSelected ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100 text-gray-800'}
                        `}
                        >
                            {node.isOpen ? <FolderOpen size={16} /> : <FolderIcon size={16} />}
                            <span className="truncate">{node.data.name}</span>
                        </div>
                    )}
                </Tree>
            </div>
        </div>
    );
}
