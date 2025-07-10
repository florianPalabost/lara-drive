import { File, FileArchive, FileAudio, FileCode, FileImage, FileSignature, FileSpreadsheet, FileText, FileVideo, LucideIcon } from 'lucide-react';

export interface MimeTypeTestIcon {
    test: (type: string) => boolean;
    icon: LucideIcon;
}

export function getFileIcon(mimeType: string): LucideIcon {
    const iconMatchers: MimeTypeTestIcon[] = [
        { test: (t) => t.startsWith('image/'), icon: FileImage },
        { test: (t) => t.startsWith('video/'), icon: FileVideo },
        { test: (t) => t.startsWith('audio/'), icon: FileAudio },
        { test: (t) => t === 'application/pdf', icon: FileText },
        { test: (t) => t.includes('spreadsheet'), icon: FileSpreadsheet },
        { test: (t) => t.includes('zip') || t.includes('rar'), icon: FileArchive },
        { test: (t) => t.includes('msword') || t.includes('officedocument'), icon: FileSignature },
        { test: (t) => t.startsWith('text/') || t.includes('json'), icon: FileCode },
    ];

    const match = iconMatchers.find(({ test }) => test(mimeType));
    return match ? match.icon : File;
}
