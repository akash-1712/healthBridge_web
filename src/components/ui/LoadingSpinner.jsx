import { forwardRef } from 'react';

const sizeStyles = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-3',
  xl: 'h-12 w-12 border-4',
};

const LoadingSpinner = forwardRef(
  (
    {
      size = 'md',
      color = 'primary',
      className = '',
      'aria-label': ariaLabel = 'Loading',
      ...props
    },
    ref
  ) => {
    const colorClasses = {
      primary: 'border-primary-500 border-t-transparent',
      white: 'border-white border-t-transparent',
      success: 'border-success-500 border-t-transparent',
      danger: 'border-danger-500 border-t-transparent',
    };

    return (
      <svg
        ref={ref}
        className={`${sizeStyles[size] || sizeStyles.md} animate-spin rounded-full ${colorClasses[color] || colorClasses.primary} ${className}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        role="status"
        aria-label={ariaLabel}
        {...props}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0z"
        />
      </svg>
    );
  }
);

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;