import { FolderIcon, FolderOpen } from 'lucide-react';
import { TreeNodeProps } from 'react-arborist';
import { Folder } from '@/types/folder';

export function FolderTreeNode({ node, style, dragHandle }: TreeNodeProps<Folder>) {
    // console.debug('rendering FolderTreeNode');
    return (
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
    );
}
