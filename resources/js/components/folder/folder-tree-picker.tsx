import { useEffect, useRef } from 'react';
import { NodeApi, NodeRendererProps, Tree, TreeApi, TreeNodeProps } from 'react-arborist';
import { useFolderContext } from '@/contexts/folder-context';
import { Folder } from '@/types/folder';
import { FolderTreeNode } from '../folder-tree-node';

export interface FolderPickerNode {
    uuid: string;
    name: string;
    children: FolderPickerNode[];
    parent_id: string;
}

interface FolderTreePickerProps {
    onSelect: (id: string) => void;
}

export function FolderTreePicker({ onSelect }: FolderTreePickerProps) {
    const treeRef = useRef<TreeApi<Folder>>(null);
    const { folders, selectedFolder, loadFolder } = useFolderContext();
    console.debug('folders from tree picker', folders);

    const handleOnSelect = async (nodes: NodeApi<Folder>[]) => {
        if (!nodes.length) return;

        const node = nodes[0];
        const folderUuid = node.data.uuid;

        node.toggle();

        // Do nothing more if the folder is already loaded
        // if (folderUuid === selectedFolder?.uuid) return;
        onSelect(folderUuid);
        await loadFolder(folderUuid);
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
        <Tree
            ref={treeRef}
            data={folders}
            openByDefault={false}
            childrenAccessor={'children'}
            idAccessor="uuid"
            parentIdAccessor="parent_id"
            onSelect={handleOnSelect}
            // initialOpenState={{}}
            disableDrag
            disableDrop
            disableEdit
            disableMultiSelection
            height={400}
            width={300}
        >
            {({ node, style, dragHandle }: TreeNodeProps<Folder>) => <FolderTreeNode node={node} style={style} dragHandle={dragHandle} />}
        </Tree>
    );
}
