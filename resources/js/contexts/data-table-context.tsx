import type { Table } from '@tanstack/react-table';
import { createContext, useContext } from 'react';
import { DataTableActions } from '@/components/ui/data-table/data-table';

export function createDataTableContext<TData>() {
    const DataTableContext = createContext<{ table: Table<TData>; actions?: DataTableActions<TData> } | undefined>(undefined);

    function useDataTableContext() {
        const context = useContext(DataTableContext);

        if (!context) {
            throw new Error('DataTable sub-components must be used within <DataTable>');
        }

        return context;
    }

    return [DataTableContext, useDataTableContext] as const;
}
