import { forwardRef } from 'react';
import Card from './Card';

const AuthLayout = forwardRef(
  (
    {
      children,
      title,
      subtitle,
      logo,
      logoAlt = 'Logo',
      illustration,
      className = '',
      cardClassName = '',
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`min-h-screen bg-bg-primary text-text-primary flex items-center justify-center px-4 py-12 ${className}`}
        {...props}
      >
        <Card variant="elevated" padding="lg" className={`w-full max-w-md ${cardClassName}`}>
          <div className="text-center mb-8">
            {logo && (
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 mb-4 mx-auto">
                {typeof logo === 'string' ? (
                  <img src={logo} alt={logoAlt} className="w-10 h-10 object-contain" />
                ) : (
                  <img src={logo} alt={logoAlt} className="w-10 h-10 object-contain" />
                )}
              </div>
            )}
            {illustration && (
              <div className="text-6xl mb-4" aria-hidden="true" role="img">
                {illustration}
              </div>
            )}
            {title && (
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-text-secondary">
                {subtitle}
              </p>
            )}
          </div>
          {children}
        </Card>
      </div>
    );
  }
);

AuthLayout.displayName = 'AuthLayout';

export default AuthLayout;