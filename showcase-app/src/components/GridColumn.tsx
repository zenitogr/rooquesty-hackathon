import { cn } from '@/lib/utils';
import React, { ReactNode, useRef, useEffect, useState, useCallback } from 'react';

type GridColumnProps = {
  children: ReactNode;
  className?: string;
  onLoadMore: () => void;
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
    if (!content || isHovered) {
      animationFrameRef.current = requestAnimationFrame(scrollLoop);
      return;
    }

    const scrollHeight = content.offsetHeight / 2;
    if (scrollHeight === 0) {
      animationFrameRef.current = requestAnimationFrame(scrollLoop);
      return;
    }

    const pixelsPerFrame = 1;
    if (direction === 'down') {
      scrollTopRef.current = (scrollTopRef.current + pixelsPerFrame) % scrollHeight;
      if (scrollTopRef.current >= scrollHeight - viewportRef.current!.clientHeight - 1) {
        loadMoreRef.current();
      }
    } else {
      scrollTopRef.current = (scrollTopRef.current - pixelsPerFrame + scrollHeight) % scrollHeight;
      if (scrollTopRef.current <= 1) {
        loadMoreRef.current();
      }
    }
    
    content.style.transform = `translateY(${-scrollTopRef.current}px)`;
    animationFrameRef.current = requestAnimationFrame(scrollLoop);
  }, [isHovered, direction]);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(scrollLoop);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [scrollLoop]);

  return (
    <div
      ref={viewportRef}
      className={cn('h-screen overflow-hidden', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div ref={contentRef} className="flex flex-col gap-4 p-2">
        {children}
        {children}
      </div>
    </div>
  );
};

export default GridColumn;