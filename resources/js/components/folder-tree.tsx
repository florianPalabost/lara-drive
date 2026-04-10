import { useEffect, useRef } from 'react';
import { NodeApi, Tree, TreeApi, TreeNodeProps } from 'react-arborist';
import { useFolderContext } from '@/contexts/folder-context';
import { useContainerHeight } from '@/hooks/use-container-height';
import { useFolderNavigation } from '@/hooks/use-folder-navigation';
import { Folder } from '@/types/folder';
import { FolderTreeNode } from './folder-tree-node';

export function FolderTree() {
    const treeRef = useRef<TreeApi<Folder>>(null);
    const [containerRef, height] = useContainerHeight(300);
    const { folders, selectedFolder } = useFolderContext();
    const { navigateToFolder } = useFolderNavigation();

    const handleOnSelect = (nodes: NodeApi<Folder>[]) => {
        if (!nodes.length) return;

        const node = nodes[0];
        node.toggle();

        if (node.data.uuid === selectedFolder?.uuid) return;

        navigateToFolder(node.data.uuid);
    };

    useEffect(() => {
        if (!selectedFolder || !treeRef.current) return;

        const node = treeRef.current.get(selectedFolder.uuid);
        if (node && !node.isSelected) {
            node.select();
            node.open();
        }
    }, [selectedFolder]);

    return (
        <div ref={containerRef} className="flex-1 min-h-0 overflow-hidden">
            <Tree
                ref={treeRef}
                data={folders}
                openByDefault={false}
                childrenAccessor="children"
                idAccessor="uuid"
                parentIdAccessor="parent_id"
                indent={16}
                onSelect={handleOnSelect}
                disableDrag
                disableMultiSelection
                className="text-sm w-full"
                rowHeight={32}
                height={height}
                width="100%"
            >
                {({ node, style, dragHandle }: TreeNodeProps<Folder>) => (
                    <FolderTreeNode node={node} style={style} dragHandle={dragHandle} />
                )}
            </Tree>
        </div>
    );
}
