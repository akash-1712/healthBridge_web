import { forwardRef } from 'react';

const variantStyles = {
  default: 'bg-bg-secondary border border-border-primary shadow-sm',
  outlined: 'bg-bg-secondary border-2 border-border-primary',
  elevated: 'bg-bg-secondary border border-border-primary shadow-xl',
  interactive: 'bg-bg-secondary border border-border-primary shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer',
};

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
};

const Card = forwardRef(
  (
    {
      children,
      variant = 'default',
      padding = 'md',
      className = '',
      onClick,
      role,
      tabIndex,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const isInteractive = variant === 'interactive' || onClick;

    return (
      <div
        ref={ref}
        role={isInteractive ? 'button' : role}
        tabIndex={isInteractive ? 0 : tabIndex}
        onClick={onClick}
        onKeyDown={isInteractive ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(e); } } : undefined}
        aria-label={isInteractive ? ariaLabel : undefined}
        aria-disabled={isInteractive && props.disabled}
        className={`
          rounded-2xl
          ${variantStyles[variant] || variantStyles.default}
          ${paddingStyles[padding] || paddingStyles.md}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;