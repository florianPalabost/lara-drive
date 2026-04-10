import { ChevronRight, FolderIcon, FolderOpen } from 'lucide-react';
import { TreeNodeProps } from 'react-arborist';
import { Folder } from '@/types/folder';

export function FolderTreeNode({ node, style, dragHandle }: TreeNodeProps<Folder>) {
    return (
        <div
            style={{
                ...style,
                paddingLeft: `${node.level * 12 + 8}px`,
            }}
            ref={dragHandle}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-md transition-colors cursor-pointer
                            ${node.isSelected ? 'bg-blue-100 text-blue-800' : 'hover:bg-neutral-100 text-gray-800'}
                        `}
        >
            {!node.isLeaf ? (
                <button
                    className="p-0.5 hover:bg-neutral-200 rounded transition-colors"
                    onClick={(e) => { e.stopPropagation(); node.toggle(); }}
                >
                    <ChevronRight
                        className={`w-4 h-4 text-neutral-600 transition-transform ${node.isOpen ? 'rotate-90' : ''}`}
                    />
                </button>
            ) : (
                <div className="w-5" />
            )}
            {node.isOpen && !node.isLeaf ? (
                <FolderOpen className="w-4 h-4 text-neutral-600 shrink-0" />
            ) : (
                <FolderIcon className="w-4 h-4 text-neutral-600 shrink-0" />
            )}
            <span className="text-sm truncate flex-1">{node.data.name}</span>
        </div>
    );
}
