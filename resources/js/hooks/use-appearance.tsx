import { useCallback, useMemo, useSyncExternalStore } from 'react';

export type ResolvedAppearance = 'light' | 'dark';
export type Appearance = ResolvedAppearance | 'system';

const listeners = new Set<() => void>();
// Force light mode - no dark mode support
let currentAppearance: Appearance = 'light';

const subscribe = (callback: () => void) => {
    listeners.add(callback);

    return () => listeners.delete(callback);
};

const applyTheme = (): void => {
    if (typeof document === 'undefined') return;

    // Always light mode
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
};

export function initializeTheme(): void {
    if (typeof window === 'undefined') return;

    // Always apply light theme
    applyTheme();
}

export function useAppearance() {
    const appearance: Appearance = useSyncExternalStore(
        subscribe,
        () => currentAppearance,
        () => 'light',
    );

    const resolvedAppearance: ResolvedAppearance = useMemo(
        () => 'light',
        [],
    );

    const updateAppearance = useCallback((_mode: Appearance): void => {
        // No-op: always stay in light mode
    }, []);

    return { appearance, resolvedAppearance, updateAppearance } as const;
}
