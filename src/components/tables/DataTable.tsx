import { ReactNode, useState, useCallback, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Sortable Column Type
 */
export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

/**
 * Data Table Column Definition
 */
export interface DataTableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => ReactNode;
  className?: string;
  width?: string;
}

/**
 * Reusable Data Table Component
 * Includes sorting, pagination, and flexible column rendering
 */
interface DataTableProps<T extends { id: string }> {
  columns: DataTableColumn<T>[];
  data: T[];
  loading?: boolean;
  onRowClick?: (row: T) => void;
  sortBy?: SortConfig;
  onSort?: (config: SortConfig) => void;
  pageSize?: number;
  selectedRowId?: string;
  emptyMessage?: string;
  className?: string;
}

export const DataTable = <T extends { id: string }>({
  columns,
  data,
  loading = false,
  onRowClick,
  sortBy,
  onSort,
  pageSize = 10,
  selectedRowId,
  emptyMessage = 'No data available',
  className,
}: DataTableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(0);

  // Handle sorting
  const handleSort = useCallback(
    (key: string) => {
      if (!onSort) return;

      const newDirection =
        sortBy?.key === key && sortBy?.direction === 'asc' ? 'desc' : 'asc';
      onSort({ key, direction: newDirection });
    },
    [sortBy, onSort]
  );

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = currentPage * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, currentPage, pageSize]);

  const totalPages = Math.ceil(data.length / pageSize);

  if (!loading && data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead
                  key={String(col.key)}
                  className={col.className}
                  style={{ width: col.width }}
                >
                  <div
                    className={cn(
                      'flex items-center gap-2',
                      col.sortable && 'cursor-pointer hover:text-foreground'
                    )}
                    onClick={() => col.sortable && handleSort(String(col.key))}
                  >
                    {col.label}
                    {col.sortable && (
                      <ArrowUpDown
                        size={14}
                        className={cn(
                          'opacity-0',
                          sortBy?.key === String(col.key) && 'opacity-100'
                        )}
                      />
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  onRowClick && 'cursor-pointer hover:bg-muted/50',
                  selectedRowId === row.id && 'bg-muted'
                )}
              >
                {columns.map((col) => (
                  <TableCell key={String(col.key)} className={col.className}>
                    {col.render
                      ? col.render(row[col.key], row)
                      : String(row[col.key])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {currentPage + 1} of {totalPages} ({data.length} total)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
              }
              disabled={currentPage === totalPages - 1}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
