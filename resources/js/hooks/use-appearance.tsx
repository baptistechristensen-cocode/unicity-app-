import { useCallback, useMemo, useSyncExternalStore } from 'react';

export type ResolvedAppearance = 'light' | 'dark' | 'pony';
export type Appearance = ResolvedAppearance | 'system';

const STORAGE_KEY = 'appearance';
const listeners = new Set<() => void>();

let currentAppearance: Appearance = 'system';

const subscribe = (callback: () => void) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
};

const notifyListeners = () => listeners.forEach((cb) => cb());

const resolveAppearance = (appearance: Appearance): ResolvedAppearance => {
    if (appearance === 'pony') return 'pony';
    if (appearance !== 'system') return appearance;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const applyTheme = (appearance: Appearance): void => {
    if (typeof document === 'undefined') return;

    const resolved = resolveAppearance(appearance);
    document.documentElement.classList.toggle('dark', resolved === 'dark');
    document.documentElement.classList.toggle('pony', resolved === 'pony');
    document.documentElement.style.colorScheme = resolved === 'pony' ? 'light' : resolved;
};

export function initializeTheme(): void {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem(STORAGE_KEY) as Appearance | null;
    currentAppearance = stored ?? 'system';
    applyTheme(currentAppearance);

    // Re-apply when system preference changes (only relevant in 'system' mode)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (currentAppearance === 'system') {
            applyTheme('system');
            notifyListeners();
        }
    });
}

export function useAppearance() {
    const appearance: Appearance = useSyncExternalStore(
        subscribe,
        () => currentAppearance,
        () => 'system',
    );

    const resolvedAppearance: ResolvedAppearance = useMemo(
        () => (typeof window === 'undefined' ? 'light' : resolveAppearance(appearance)),
        [appearance],
    );

    const updateAppearance = useCallback((mode: Appearance): void => {
        currentAppearance = mode;
        localStorage.setItem(STORAGE_KEY, mode);
        applyTheme(mode);
        notifyListeners();
        if (mode === 'pony') window.dispatchEvent(new CustomEvent('ponytime'));
    }, []);

    return { appearance, resolvedAppearance, updateAppearance } as const;
}
