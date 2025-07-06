import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
}

export function Progress({
  value,
  max = 100,
  className,
  ...props
}: ProgressProps) {
  return (
    <div
      className={cn('w-full h-2 bg-gray-200 rounded-full overflow-hidden', className)}
      {...props}
    >
      <div
        className="h-full bg-blue-600 transition-all duration-200 ease-in-out"
        style={{ width: `${Math.min(value, max)}%` }}
      />
    </div>
  );
}
