import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Button from './Button';

const Drawer = ({
  isOpen,
  onClose,
  children,
  position = 'right',
  size = 'md',
  title,
  description,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = '',
}) => {
  const drawerRef = useRef(null);
  const previousActiveElement = useRef(null);

  const sizeStyles = {
    sm: 'max-w-sm w-full',
    md: 'max-w-md w-full',
    lg: 'max-w-lg w-full',
    xl: 'max-w-xl w-full',
    full: 'max-w-4xl w-full',
  };

  const positionStyles = {
    left: 'left-0',
    right: 'right-0',
    top: 'top-0',
    bottom: 'bottom-0',
  };

  const positionTransforms = {
    left: 'translate-x-full',
    right: 'translate-x-full',
    top: 'translate-y-full',
    bottom: 'translate-y-full',
  };

  const positionTransformsOpen = {
    left: 'translate-x-0',
    right: 'translate-x-0',
    top: 'translate-y-0',
    bottom: 'translate-y-0',
  };

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      drawerRef.current?.focus();
    } else {
      document.body.style.overflow = '';
      previousActiveElement.current?.focus();
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen || !closeOnEscape) return;
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose?.();
    }
  };

  const trapFocus = (e) => {
    if (!isOpen || e.key !== 'Tab') return;

    const focusableElements = drawerRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (!focusableElements?.length) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', trapFocus);
    }
    return () => document.removeEventListener('keydown', trapFocus);
  }, [isOpen]);

  if (!isOpen) return null;

  const drawerContent = (
    <div
      className={`
        fixed inset-0 z-50 flex
        ${positionStyles[position]}
      `}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'drawer-title' : undefined}
      aria-describedby={description ? 'drawer-description' : undefined}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        aria-hidden="true"
        onClick={handleOverlayClick}
      />
      <div
        ref={drawerRef}
        tabIndex={-1}
        className={`
          relative z-10 bg-bg-secondary shadow-xl flex flex-col max-h-full
          ${sizeStyles[size] || sizeStyles.md}
          ${positionTransforms[position]} transition-transform duration-300 ease-in-out
          ${isOpen ? positionTransformsOpen[position] : ''}
          ${className}
        `}
        onKeyDown={trapFocus}
      >
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between p-4 border-b border-border-primary">
            <div>
              {title && (
                <h2 id="drawer-title" className="text-lg font-semibold text-text-primary">
                  {title}
                </h2>
              )}
              {description && (
                <p id="drawer-description" className="text-sm text-text-secondary mt-1">
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                aria-label="Close drawer"
                className="flex-shrink-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            )}
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
};

Drawer.displayName = 'Drawer';

export default Drawer;