import { forwardRef, useMemo } from 'react';

const sizeStyles = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-24 h-24 text-2xl',
};

const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getColorFromName = (name) => {
  if (!name) return 'bg-neutral-400';
  const colors = [
    'bg-primary-500',
    'bg-success-500',
    'bg-warning-500',
    'bg-danger-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-cyan-500',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const Avatar = forwardRef(
  (
    {
      src,
      alt,
      name,
      size = 'md',
      shape = 'circle',
      status,
      statusPosition = 'bottom-right',
      className = '',
      ...props
    },
    ref
  ) => {
    const initials = useMemo(() => getInitials(name), [name]);
    const bgColor = useMemo(() => getColorFromName(name), [name]);
    const shapeClass = shape === 'square' ? 'rounded-xl' : 'rounded-full';

    const statusStyles = {
      'bottom-right': 'bottom-0 right-0',
      'bottom-left': 'bottom-0 left-0',
      'top-right': 'top-0 right-0',
      'top-left': 'top-0 left-0',
    };

    const statusColors = {
      online: 'bg-success-500',
      offline: 'bg-neutral-400',
      busy: 'bg-danger-500',
      away: 'bg-warning-500',
    };

    return (
      <div
        ref={ref}
        className={`relative inline-flex shrink-0 ${className}`}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className={`${sizeStyles[size] || sizeStyles.md} ${shapeClass} object-cover bg-bg-tertiary`}
          />
        ) : (
          <div
            className={`${sizeStyles[size] || sizeStyles.md} ${shapeClass} flex items-center justify-center font-semibold text-white ${bgColor}`}
            aria-label={name ? `${name}'s avatar` : undefined}
          >
            {initials}
          </div>
        )}
        {status && (
          <span
            className={`
              absolute w-3 h-3 rounded-full border-2 border-bg-secondary
              ${statusColors[status] || statusColors.offline}
              ${statusStyles[statusPosition] || statusStyles['bottom-right']}
            `}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export default Avatar;