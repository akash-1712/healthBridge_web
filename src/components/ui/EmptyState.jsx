import { forwardRef } from 'react';
import Button from './Button';
import Skeleton from './Skeleton';

const illustrationStyles = {
  default: 'text-6xl',
  large: 'text-8xl',
  small: 'text-4xl',
};

const EmptyState = forwardRef(
  (
    {
      illustration = '📭',
      title = 'Nothing here',
      description = 'Looks like there\'s no content to display.',
      action,
      actionLabel,
      variant = 'default',
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`flex flex-col items-center text-center py-12 px-4 ${className}`}
        {...props}
      >
        <div
          className={`mb-6 ${illustrationStyles[variant] || illustrationStyles.default}`}
          aria-hidden="true"
          role="img"
        >
          {illustration}
        </div>
        <h3 className="text-xl font-semibold text-text-primary mb-2">
          {title}
        </h3>
        <p className="text-text-secondary max-w-sm mb-6">
          {description}
        </p>
        {action && actionLabel && (
          <Button onClick={action} size="md">
            {actionLabel}
          </Button>
        )}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';

export const LoadingEmptyState = ({ variant = 'default', className = '', ...props }) => (
  <div className={`flex flex-col items-center text-center py-12 px-4 ${className}`} {...props}>
    <Skeleton variant="circular" width={illustrationStyles[variant]?.replace('text-', '') || '48px'} height={illustrationStyles[variant]?.replace('text-', '') || '48px'} className="mb-6" />
    <Skeleton variant="text" width="60%" className="mx-auto mb-2" />
    <Skeleton variant="text" width="80%" className="mx-auto mb-4" />
    <Skeleton variant="text" width="40%" className="mx-auto" />
  </div>
);

export default EmptyState;