import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

/**
 * Card Loading Skeleton
 */
export const CardSkeleton = ({ className }: { className?: string }) => (
  <div className={cn('rounded-lg border border-border p-4 space-y-3', className)}>
    <Skeleton className="h-4 w-1/3" />
    <Skeleton className="h-8 w-1/2" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
  </div>
);

/**
 * Table Row Skeleton
 */
export const TableRowSkeleton = ({ cols = 4 }: { cols?: number }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-6 py-4">
        <Skeleton className="h-4 w-full" />
      </td>
    ))}
  </tr>
);

/**
 * Table Loading State
 */
export const TableLoadingSkeleton = ({
  rows = 5,
  cols = 4,
}: {
  rows?: number;
  cols?: number;
}) => (
  <>
    {Array.from({ length: rows }).map((_, i) => (
      <TableRowSkeleton key={i} cols={cols} />
    ))}
  </>
);

/**
 * List Skeleton (multiple cards)
 */
export const ListSkeleton = ({
  count = 3,
  className,
}: {
  count?: number;
  className?: string;
}) => (
  <div className={cn('space-y-3', className)}>
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

/**
 * Dashboard Grid Skeleton
 */
export const DashboardSkeleton = () => (
  <div className="space-y-6">
    {/* Metrics */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 rounded-lg border border-border p-4">
        <Skeleton className="h-[300px] w-full" />
      </div>
      <div className="rounded-lg border border-border p-4">
        <Skeleton className="h-[300px] w-full" />
      </div>
    </div>

    {/* Tables */}
    <div className="rounded-lg border border-border overflow-hidden">
      <table className="w-full">
        <tbody>
          <TableLoadingSkeleton rows={5} cols={5} />
        </tbody>
      </table>
    </div>
  </div>
);

/**
 * Form Skeleton
 */
export const FormSkeleton = ({ fields = 4 }: { fields?: number }) => (
  <div className="space-y-4">
    {Array.from({ length: fields }).map((_, i) => (
      <div key={i}>
        <Skeleton className="h-4 w-1/4 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>
    ))}
    <div className="flex gap-2 pt-4">
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-10 w-24" />
    </div>
  </div>
);

/**
 * Detailed Page Skeleton
 */
export const DetailPageSkeleton = () => (
  <div className="space-y-6">
    {/* Header */}
    <div>
      <Skeleton className="h-8 w-1/3 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </div>

    {/* Content Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <CardSkeleton />
      </div>
      <div>
        <CardSkeleton />
      </div>
    </div>
  </div>
);
