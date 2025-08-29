
import { cn } from '@/lib/utils';
import React, { ReactNode, useState } from 'react';

type GridColumnProps = {
  children: ReactNode;
  className?: string;
  msPerPixel?: number;
  direction?: 'up' | 'down';
};

const GridColumn = ({
  children,
  className,
  msPerPixel = 0,
  direction = 'up',
}: GridColumnProps) => {
  const [columnRef, setColumnRef] = useState<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const duration = columnRef
    ? (columnRef.offsetHeight * msPerPixel) / 1000
    : 0;

  const animationClassName = direction === 'up' ? 'animate-scroll-up' : 'animate-scroll-down';

  return (
    <div
      ref={setColumnRef}
      className={cn(
        'flex flex-col gap-4',
        className
      )}
      style={{
        '--animation-duration': `${duration}s`,
        '--animation-direction': direction === 'up' ? 'normal' : 'reverse',
      } as React.CSSProperties}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn('flex flex-col gap-4', animationClassName, isHovered && 'animation-paused')} style={{ animationDuration: `${duration}s`}}>
        {children}
        {children}
      </div>
    </div>
  );
};

export default GridColumn;