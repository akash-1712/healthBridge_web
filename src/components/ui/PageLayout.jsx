import { forwardRef } from 'react';

const PageLayout = forwardRef(
  (
    {
      children,
      header,
      footer,
      className = '',
      containerClassName = '',
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`min-h-screen bg-bg-primary text-text-primary ${className}`}
        {...props}
      >
        {header && (
          <header className="sticky top-0 z-40 bg-bg-secondary/80 backdrop-blur-md border-b border-border-primary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {header}
            </div>
          </header>
        )}
        <main className="flex-1">
          <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${containerClassName}`}>
            {children}
          </div>
        </main>
        {footer && (
          <footer className="bg-bg-secondary border-t border-border-primary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {footer}
            </div>
          </footer>
        )}
      </div>
    );
  }
);

PageLayout.displayName = 'PageLayout';

export const CenteredLayout = forwardRef(
  (
    {
      children,
      className = '',
      maxWidth = 'md',
      ...props
    },
    ref
  ) => {
    const maxWidthStyles = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
      full: 'max-w-7xl',
    };

    return (
      <div
        ref={ref}
        className={`min-h-screen bg-bg-primary text-text-primary flex items-center justify-center px-4 py-12 ${className}`}
        {...props}
      >
        <div className={`w-full ${maxWidthStyles[maxWidth] || maxWidthStyles.md}`}>
          {children}
        </div>
      </div>
    );
  }
);

CenteredLayout.displayName = 'CenteredLayout';

export default PageLayout;