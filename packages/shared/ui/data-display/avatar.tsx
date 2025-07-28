import Image from 'next/image';
import React from 'react';
import { cn } from '@shared/lib/utils';

const Avatar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
      {...props}
    />
  ),
);

Avatar.displayName = 'Avatar';

const AvatarImage = React.forwardRef<HTMLImageElement, React.ComponentProps<typeof Image>>(
  ({ className, alt = 'Avatar', src, ...props }, ref) => {
    // Не рендерим Image если src пустой или null
    if (!src) {
      return null;
    }

    return (
      <Image
        ref={ref}
        className={cn('aspect-square h-full w-full', className)}
        alt={alt}
        src={src}
        fill
        {...props}
      />
    );
  },
);

AvatarImage.displayName = 'AvatarImage';

const AvatarFallback = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex h-full w-full items-center justify-center rounded-full bg-muted',
        className,
      )}
      {...props}
    />
  ),
);

AvatarFallback.displayName = 'AvatarFallback';

export { Avatar, AvatarImage, AvatarFallback };
