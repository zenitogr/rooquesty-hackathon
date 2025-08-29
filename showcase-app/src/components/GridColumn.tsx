import { cn } from '@/lib/utils';
import React, { ReactNode, useState, useRef, useEffect } from 'react';

type GridColumnProps = {
  children: ReactNode;
  className?: string;
  msPerPixel?: number;
  direction?: 'up' | 'down';
};

const GridColumn = ({
  children,
  className,
  msPerPixel = 20,
  direction = 'up',
}: GridColumnProps) => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const scrollTopRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    let scrollHeight = 0;

    const scrollLoop = () => {
      if (scrollHeight === 0) {
        scrollHeight = content.offsetHeight / 2;
      }

      if (!isHovered && scrollHeight > 0) {
        const pixelsPerFrame = 16.67 / msPerPixel;
        
        if (direction === 'down') {
          scrollTopRef.current = (scrollTopRef.current + pixelsPerFrame) % scrollHeight;
        } else {
          scrollTopRef.current = (scrollTopRef.current - pixelsPerFrame + scrollHeight) % scrollHeight;
        }
      }
      
      if (content) {
        content.style.transform = `translateY(${-scrollTopRef.current}px)`;
      }

      animationFrameRef.current = requestAnimationFrame(scrollLoop);
    };

    animationFrameRef.current = requestAnimationFrame(scrollLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isHovered, msPerPixel, direction]);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (isHovered && contentRef.current) {
      e.preventDefault();
      const scrollHeight = contentRef.current.offsetHeight / 2;
      
      scrollTopRef.current += e.deltaY;

      if (scrollHeight > 0) {
        scrollTopRef.current = Math.max(0, Math.min(scrollTopRef.current, scrollHeight));
      }
    }
  };

  return (
    <div
      ref={viewportRef}
      className={cn('h-full overflow-hidden', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onWheel={handleWheel}
    >
      <div ref={contentRef} className="flex flex-col gap-4">
        {children}
        {children}
      </div>
    </div>
  );
};

export default GridColumn;