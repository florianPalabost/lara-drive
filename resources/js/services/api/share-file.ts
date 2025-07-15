import { useApi } from '@/hooks/use-api';

interface FileSharePayload {
    user_email: string | null;
    permission: string;
    expires_in: string | null;
}

export interface FileShareResponse {
    share: {
        id: number;
        user_id: number | null;
        email: string | null;
        permission: string;
        expires_at: string | null;
        public_token: string;
    };
    share_link: string;
}

export async function shareFile(data: FileSharePayload, fileId: string): Promise<FileShareResponse> {
    const api = useApi();

    return await api
        .post(`files/${fileId}/share`, {
            json: data,
        })
        .json<FileShareResponse>();
}
