import { router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { create } from 'zustand';
import { BreadcrumbItem } from '@/types';

interface BreadcrumbState {
    breadcrumbs: BreadcrumbItem[];
    setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
    clearBreadcrumbs: () => void;
}

const useBreadcrumbStore = create<BreadcrumbState>((set) => ({
    breadcrumbs: [],
    setBreadcrumbs: (crumbs: BreadcrumbItem[]) => set({ breadcrumbs: crumbs }),
    clearBreadcrumbs: () => set({ breadcrumbs: [] }),
}));

export function useBreadcrumbs() {
    const { breadcrumbs, setBreadcrumbs, clearBreadcrumbs } = useBreadcrumbStore();
    const page = usePage<{ breadcrumbs?: BreadcrumbItem[] }>();

    // /!\ TODO: Change usestate hook in useEffect
    useEffect(() => {
        if (page.props.breadcrumbs && page.props.breadcrumbs.length > 0) {
            console.debug('breadcrumbs', page.props.breadcrumbs);
            setBreadcrumbs(page.props.breadcrumbs);
        }
    }, [page.props.breadcrumbs, setBreadcrumbs]);

    useEffect(() => {
        const unListen = router.on('navigate', () => {
            clearBreadcrumbs();
        });

        return () => unListen();
    }, [clearBreadcrumbs]);

    return {
        breadcrumbs,
        setBreadcrumbs,
    };
}
