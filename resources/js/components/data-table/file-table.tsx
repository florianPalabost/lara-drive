import { createDataTableComponent } from '@/components/ui/data-table/data-table';
import { DriveFile } from '@/types/folder';

export const FileTable = createDataTableComponent<DriveFile, unknown>();
export const useFileDataTableContext = FileTable.useDataTableContext;

export default FileTable;
