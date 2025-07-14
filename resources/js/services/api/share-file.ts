import { useApi } from '@/hooks/use-api';
import { FileShareResponse } from '@/types/folder';

interface FileSharePayload {
    user_email: string | null;
    permission: string;
    expires_in: string | null;
}

export async function shareFile(data: FileSharePayload, fileId: string): Promise<FileShareResponse> {
    const api = useApi();

    return await api
        .post(`files/${fileId}/share`, {
            json: data,
        })
        .json<FileShareResponse>();
}
