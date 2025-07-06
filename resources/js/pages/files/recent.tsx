import { Head } from '@inertiajs/react';
import { LucideDownload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { DriveFile } from '@/types/folder';

interface RecentFilesProps {
    recentFiles: Array<DriveFile>;
}

export default function RecentFiles({ recentFiles }: RecentFilesProps) {
    return (
        <AppLayout>
            <Head title="Recent Files" />
            <div className="max-w-3xl mx-auto p-6 space-y-4">
                <h1 className="text-2xl font-semibold">Recent Files</h1>

                {recentFiles.length === 0 && <p className="text-gray-500 italic">You haven’t uploaded any files yet.</p>}

                <div className="space-y-2">
                    {recentFiles.map((file) => (
                        <Card key={file.uuid}>
                            <CardContent className="flex justify-between items-center p-4">
                                <div>
                                    <p className="font-medium">{file.original_name}</p>
                                    <p className="text-sm text-gray-500">
                                        {(file.size / 1024).toFixed(1)} KB — {file.mime_type}
                                    </p>
                                </div>
                                <Button variant="link" size="sm">
                                    <a href={route('files.download', file.uuid)} download className="text-blue-600 hover:underline">
                                        <LucideDownload />
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
