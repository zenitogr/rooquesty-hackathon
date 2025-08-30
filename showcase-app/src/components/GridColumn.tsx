import { cn } from '@/lib/utils';
import React, { ReactNode, useRef, useEffect, useState, useCallback } from 'react';

type GridColumnProps = {
  children: ReactNode;
  className?: string;
  onLoadMore: (direction: 'up' | 'down') => void;
  direction?: 'up' | 'down';
};

const GridColumn = ({
  children,
  className,
  onLoadMore,
  direction = 'up',
}: GridColumnProps) => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const scrollTopRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const loadMoreRef = useRef(onLoadMore);
  loadMoreRef.current = onLoadMore;

  const scrollLoop = useCallback(() => {
    const content = contentRef.current;
    if (!content || isHovered || !viewportRef.current) {
      animationFrameRef.current = requestAnimationFrame(scrollLoop);
      return;
    }

    const scrollHeight = content.offsetHeight;
    const viewportHeight = viewportRef.current.offsetHeight;

    if (scrollHeight <= viewportHeight) {
      animationFrameRef.current = requestAnimationFrame(scrollLoop);
      return;
    }

    const pixelsPerFrame = 1;
    if (direction === 'down') {
      scrollTopRef.current += pixelsPerFrame;
      if (scrollTopRef.current >= scrollHeight - viewportHeight) {
        loadMoreRef.current('down');
      }
    } else { // direction 'up'
      scrollTopRef.current -= pixelsPerFrame;
      if (scrollTopRef.current <= 0) {
        loadMoreRef.current('up');
      }
    }
    
    scrollTopRef.current = Math.max(0, Math.min(scrollTopRef.current, scrollHeight - viewportHeight));

    content.style.transform = `translateY(${-scrollTopRef.current}px)`;
    animationFrameRef.current = requestAnimationFrame(scrollLoop);
  }, [isHovered, direction]);


  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (contentRef.current && viewportRef.current) {
      const scrollHeight = contentRef.current.offsetHeight;
      const viewportHeight = viewportRef.current.offsetHeight;
      let newScrollTop = scrollTopRef.current + e.deltaY;

      if (e.deltaY < 0 && newScrollTop <= 0) {
        loadMoreRef.current('up');
      }
      
      if (e.deltaY > 0 && newScrollTop >= scrollHeight - viewportHeight) {
        loadMoreRef.current('down');
      }

      newScrollTop = Math.max(0, Math.min(newScrollTop, scrollHeight - viewportHeight));

      scrollTopRef.current = newScrollTop;
      contentRef.current.style.transform = `translateY(${-scrollTopRef.current}px)`;
    }
  };

  return (
    <div
      ref={viewportRef}
      className={cn('h-screen overflow-hidden', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onWheel={handleWheel}
    >
      <div ref={contentRef} className="flex flex-col gap-4 p-2">
        {children}
      </div>
    </div>
  );
};

export default GridColumn;