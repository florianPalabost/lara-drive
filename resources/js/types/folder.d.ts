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

export interface DriveFileVersion {
    id: number;
    file_id: number;
    size: number;
    path: string;
    mime_type: string;
    created_at: string;
    updated_at: string;
}

export interface DriveFile {
    id: number;
    uuid: string;
    folder_id: number;
    original_name: string;
    current_version: DriveFileVersion;
    created_at: string;
    updated_at: string;
}
