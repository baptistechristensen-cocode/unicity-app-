import { Appearance, useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { LucideIcon, Monitor, Moon, Sun, Sparkles } from 'lucide-react';
import { HTMLAttributes } from 'react';

type TabOption = { value: Appearance; icon: LucideIcon | null; emoji?: string; label: string };

export default function AppearanceToggleTab({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();

    const tabs: TabOption[] = [
        { value: 'light',  icon: Sun,      label: 'Clair' },
        { value: 'dark',   icon: Moon,     label: 'Sombre' },
        { value: 'system', icon: Monitor,  label: 'Système' },
        { value: 'pony',   icon: Sparkles, emoji: '🦄', label: 'My Little Pony' },
    ];

    return (
        <div
            className={cn(
                'inline-flex flex-wrap gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800 pony:bg-pink-100',
                className,
            )}
            {...props}
        >
            {tabs.map(({ value, icon: Icon, emoji, label }) => (
                <button
                    key={value}
                    onClick={() => updateAppearance(value)}
                    className={cn(
                        'flex items-center rounded-md px-3.5 py-1.5 transition-colors',
                        appearance === value
                            ? value === 'pony'
                                ? 'bg-white shadow-xs text-pink-600 font-medium'
                                : 'bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100'
                            : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60 pony:text-pink-400 pony:hover:bg-pink-200/60',
                    )}
                >
                    {emoji && <span className="-ml-1 mr-1 text-sm">{emoji}</span>}
                    {Icon && !emoji && <Icon className="-ml-1 h-4 w-4" />}
                    {Icon && emoji && <Icon className="h-4 w-4" />}
                    <span className="ml-1.5 text-sm">{label}</span>
                </button>
            ))}
        </div>
    );
}
