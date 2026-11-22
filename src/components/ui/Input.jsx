import { forwardRef, useId } from 'react';

const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className = '',
      id: providedId,
      type = 'text',
      disabled = false,
      required = false,
      readOnly = false,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;
    const describedBy = [error && errorId, helperText && helperId, ariaDescribedBy].filter(Boolean).join(' ') || undefined;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-1.5">
            {label}
            {required && <span className="text-danger-500 ml-0.5" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div
              className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted"
              aria-hidden="true"
            >
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            type={type}
            disabled={disabled}
            required={required}
            readOnly={readOnly}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={describedBy}
            className={`
              w-full bg-bg-secondary border border-border-primary
              rounded-xl text-text-primary placeholder-text-muted
              transition-all duration-200 ease-in-out
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:border-transparent
              disabled:bg-bg-tertiary disabled:text-text-muted disabled:cursor-not-allowed
              read-only:bg-bg-tertiary
              ${leftIcon ? 'pl-10' : 'pl-4'}
              ${rightIcon ? 'pr-10' : 'pr-4'}
              py-3 text-base
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <div
              className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-text-muted"
              aria-hidden="true"
            >
              {rightIcon}
            </div>
          )}
          {error && (
            <div className="absolute -bottom-5 left-0 text-xs text-danger-500" id={errorId} role="alert">
              {error}
            </div>
          )}
        </div>
        {helperText && !error && (
          <p id={helperId} className="mt-1.5 text-xs text-text-muted">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;