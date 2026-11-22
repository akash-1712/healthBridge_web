import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

const Tooltip = ({ children, content, position = 'top', delay = 200, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipRect, setTooltipRect] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  let hideTimeout = null;

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipHeight = tooltipRef.current.offsetHeight;
    const tooltipWidth = tooltipRef.current.offsetWidth;
    const gap = 8;

    let top, left;

    switch (position) {
      case 'top':
        top = triggerRect.top - tooltipHeight - gap;
        left = triggerRect.left + (triggerRect.width - tooltipWidth) / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + gap;
        left = triggerRect.left + (triggerRect.width - tooltipWidth) / 2;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - tooltipHeight) / 2;
        left = triggerRect.left - tooltipWidth - gap;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - tooltipHeight) / 2;
        left = triggerRect.right + gap;
        break;
      default:
        top = triggerRect.top - tooltipHeight - gap;
        left = triggerRect.left + (triggerRect.width - tooltipWidth) / 2;
    }

    const viewportPadding = 8;
    left = Math.max(viewportPadding, Math.min(left, window.innerWidth - tooltipWidth - viewportPadding));
    top = Math.max(viewportPadding, top);

    setTooltipRect({ top, left });
  }, [position]);

  const showTooltip = useCallback(() => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }
    hideTimeout = setTimeout(() => {
      setIsVisible(true);
      updatePosition();
    }, delay);
  }, [delay, updatePosition]);

  const hideTooltip = useCallback(() => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }
    setTimeout(() => setIsVisible(false), 100);
  }, []);

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, { passive: true });
      window.addEventListener('resize', updatePosition);
    }
    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isVisible, updatePosition]);

  const triggerProps = {
    ref: triggerRef,
    onMouseEnter: showTooltip,
    onMouseLeave: hideTooltip,
    onFocus: showTooltip,
    onBlur: hideTooltip,
  };

  if (!isVisible || !content) {
    return <>{React.Children.only(children)}</>;
  }

  const tooltip = (
    <div
      ref={tooltipRef}
      className={`
        absolute z-50 px-2.5 py-1.5 text-xs font-medium text-white bg-neutral-900
        dark:bg-neutral-100 dark:text-neutral-900
        rounded-lg shadow-lg whitespace-nowrap
        pointer-events-none animate-fade-in
        ${className}
      `}
      style={{ top: tooltipRect.top, left: tooltipRect.left }}
      role="tooltip"
      aria-hidden="true"
    >
      {content}
    </div>
  );

  return (
    <>
      {React.cloneElement(React.Children.only(children), triggerProps)}
      {createPortal(tooltip, document.body)}
    </>
  );
};

Tooltip.displayName = 'Tooltip';

export default Tooltip;