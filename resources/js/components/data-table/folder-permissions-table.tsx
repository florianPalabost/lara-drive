import { createDataTableComponent } from '@/components/ui/data-table/data-table';

export const FolderPermissionsTable = createDataTableComponent<any, unknown>();
export const useFolderPermissionsDataTableContext = FolderPermissionsTable.useDataTableContext;

export default FolderPermissionsTable;
