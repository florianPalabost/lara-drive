import { type ReactNode } from 'react';
import { Toaster } from 'sonner';
import { FileSearch } from '@/components/drive-file/file-search';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';

interface AppLayoutProps {
    children: ReactNode;
}

export default ({ children, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate {...props}>
        <div className="px-4 pt-4 w-full">
            <FileSearch />
        </div>
        {children}
        <Toaster richColors position="top-right" />
    </AppLayoutTemplate>
);
