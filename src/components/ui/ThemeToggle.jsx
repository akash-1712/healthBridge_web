import { useTheme } from '../../contexts/ThemeContext';
import Button from './Button';
import Tooltip from './Tooltip';

const themeIcons = {
  light: '☀️',
  dark: '🌙',
  system: '💻',
};

const themeLabels = {
  light: 'Light mode',
  dark: 'Dark mode',
  system: 'System preference',
};

const ThemeToggle = ({ size = 'md', showLabel = false, className = '', ...props }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`flex items-center gap-1 ${className}`} {...props}>
      <Tooltip content={showLabel ? themeLabels[theme] : undefined}>
        <Button
          variant="ghost"
          size={size}
          onClick={toggleTheme}
          aria-label={`Current: ${themeLabels[theme]}. Click to cycle.`}
          title={themeLabels[theme]}
        >
          {themeIcons[theme]}
        </Button>
      </Tooltip>
      {showLabel && (
        <span className="text-sm text-text-secondary hidden sm:inline">
          {themeLabels[theme]}
        </span>
      )}
    </div>
  );
};

export const ThemeSelect = ({ className = '', ...props }) => {
  const { theme, setTheme } = useTheme();

  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
      className={`
        bg-bg-secondary border border-border-primary rounded-xl
        px-3 py-2 text-sm text-text-primary
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus
        dark:bg-bg-tertiary dark:text-text-primary
        ${className}
      `}
      aria-label="Select theme"
      {...props}
    >
      <option value="light">☀️ Light</option>
      <option value="dark">🌙 Dark</option>
      <option value="system">💻 System</option>
    </select>
  );
};

export default ThemeToggle;