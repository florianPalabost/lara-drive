import { Tree, NodeRendererProps, TreeNodeProps, NodeApi, TreeApi  } from "react-arborist"
import { FolderTreeNode } from "../folder-tree-node"
import { useFolderContext } from "@/contexts/folder-context"
import { Folder } from "@/types/folder"
import { useEffect, useRef } from "react"

export interface FolderPickerNode {
    uuid: string
    name: string
    children: FolderPickerNode[]
    parent_id: string
}

interface FolderTreePickerProps {
    // folders: FolderPickerNode[]
    onSelect: (id: string) => void
}

export function FolderTreePicker({  onSelect }: FolderTreePickerProps) {
     const treeRef = useRef<TreeApi<Folder>>(null);
     const { folders, selectedFolder, loadFolder } = useFolderContext();


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
            idAccessor="uuid"
            childrenAccessor={"children"}
            initialOpenState={{}}
            disableDrag
            disableDrop
            disableEdit
            disableMultiSelection
            height={400}
            width={300}
            onSelect={handleOnSelect}
       >
            {({ node, style, dragHandle }: TreeNodeProps<Folder>) => <FolderTreeNode node={node} style={style} dragHandle={dragHandle} />}
       </Tree>
    );
}



