import { createDataTableComponent } from '@/components/ui/data-table/data-table';
import { DriveFileVersion } from '@/types/folder';

export const FileVersionTable = createDataTableComponent<DriveFileVersion, unknown>();
export const useFileVersionHistoryDataTableContext = FileVersionTable.useDataTableContext;

export default FileVersionTable;
