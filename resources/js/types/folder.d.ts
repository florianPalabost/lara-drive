export interface Folder {
    id: number;
    uuid: string;
    name: string;
    path: string;
    parent_id: string | null;
    created_at: string;
    updated_at: string;
    children?: Array<Folder>;
    files?: Array<DriveFile>;
    parent?: Folder;
}

export interface DriveFile {
    id: number;
    uuid: string;
    folder_id: number;
    original_name: string;
    mime_type: string;
    size: number;
    path: string;
    created_at: string;
    updated_at: string;
}
