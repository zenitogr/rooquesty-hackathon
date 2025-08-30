import { cn } from '@/lib/utils';
import React, { ReactNode, useRef, useEffect, useCallback } from 'react';

type GridColumnProps = {
  children: ReactNode;
  className?: string;
  onLoadMore: () => void;
};

const GridColumn = ({
  children,
  className,
  onLoadMore,
}: GridColumnProps) => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef(onLoadMore);
  loadMoreRef.current = onLoadMore;

  const handleScroll = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const { scrollTop, scrollHeight, clientHeight } = viewport;
    if (scrollTop + clientHeight >= scrollHeight - 500) {
      loadMoreRef.current();
    }
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    viewport?.addEventListener('scroll', handleScroll);
    return () => viewport?.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content) return;

    const resizeObserver = new ResizeObserver(() => {
      const isOverflowing = content.scrollHeight > viewport.clientHeight;
      if (!isOverflowing) {
        loadMoreRef.current();
      }
    });

    resizeObserver.observe(content);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div
      ref={viewportRef}
      className={cn('h-screen overflow-y-auto', className)}
    >
      <div ref={contentRef} className="flex flex-col gap-4 p-2">
        {children}
      </div>
    </div>
  );
};

export default GridColumn;