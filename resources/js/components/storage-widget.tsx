import { HardDrive } from 'lucide-react';
import { useStorage } from '@/hooks/use-storage';
import { Progress } from '@/components/ui/progress';
import { SidebarGroup } from '@/components/ui/sidebar';

export function StorageWidget() {
    const { pct, label } = useStorage();

    return (
        <SidebarGroup className="px-3 py-2 group-data-[collapsible=icon]:hidden">
            <div className="flex items-center gap-2 mb-2 text-sm text-sidebar-foreground">
                <HardDrive className="h-4 w-4 shrink-0" />
                <span>Storage</span>
            </div>
            <Progress value={pct} className="h-1.5 mb-1.5" />
            <p className="text-xs text-sidebar-foreground/60">{label}</p>
        </SidebarGroup>
    );
}
