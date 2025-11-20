import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`group inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
        isDark
          ? 'border-white/30 text-white hover:border-white/60'
          : 'border-brand-border text-slate-700 hover:border-brand-primary hover:text-brand-primary'
      } ${className}`}
      aria-label="Tema değiştir"
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-yellow-300 transition group-hover:rotate-6" />
      ) : (
        <Moon className="h-4 w-4 text-indigo-500 transition group-hover:-rotate-6" />
      )}
      <span className="hidden sm:inline">{isDark ? 'Aydınlık' : 'Karanlık'}</span>
    </button>
  );
}
