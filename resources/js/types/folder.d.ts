export interface Folder {
    id: number;
    uuid: string;
    name: string;
    parent_id: string | null;
    created_at: string;
    updated_at: string;
    children?: Array<Folder>;
}
