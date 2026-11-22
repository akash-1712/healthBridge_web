import { forwardRef } from 'react';

const Skeleton = forwardRef(
  (
    {
      variant = 'text',
      width = '100%',
      height,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'bg-neutral-200 dark:bg-neutral-700 animate-pulse rounded overflow-hidden';

    const variantStyles = {
      text: 'h-4',
      circular: 'rounded-full',
      rectangular: 'rounded-xl',
    };

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant] || variantStyles.text} ${className}`}
        style={{ width, height }}
        aria-hidden="true"
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

export const SkeletonText = ({ lines = 3, className = '', ...props }) => (
  <div className={`space-y-3 ${className}`} {...props}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} variant="text" width={i === lines - 1 ? '60%' : '100%'} />
    ))}
  </div>
);

export const SkeletonCard = ({ className = '', ...props }) => (
  <div className={`space-y-4 ${className}`} {...props}>
    <Skeleton variant="rectangular" height="200px" width="100%" />
    <SkeletonText lines={3} />
  </div>
);

export default Skeleton;