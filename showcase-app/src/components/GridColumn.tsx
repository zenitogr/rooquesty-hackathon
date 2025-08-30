import { cn } from '@/lib/utils';
import React, { ReactNode } from 'react';

type GridColumnProps = {
  children: ReactNode;
  className?: string;
  msPerPixel?: number;
  direction?: 'up' | 'down';
};

const GridColumn = ({
  children,
  className,
}: GridColumnProps) => {
  return (
    <div
      className={cn('h-full overflow-y-auto', className)}
    >
      <div className="flex flex-col gap-4">
        {children}
      </div>
    </div>
  );
};

export default GridColumn;