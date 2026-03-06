import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface Sparkle {
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    delay: number;
    char: string;
    duration: number;
}

const COLORS = ['#ff6eb4', '#ffb347', '#fffb69', '#6be5a0', '#6bc5ff', '#c77dff', '#ff8fab'];
const CHARS  = ['✦', '✧', '★', '✨', '◆', '✦', '✧'];

// Arcs de l'extérieur (grand) vers l'intérieur (petit)
// viewBox "0 0 200 100", centre des cercles en (100, 100)
const ARCS = [
    { radius: 90, color: '#FF3385' },
    { radius: 77, color: '#FF7700' },
    { radius: 64, color: '#FFE500' },
    { radius: 51, color: '#00CC55' },
    { radius: 38, color: '#3399FF' },
    { radius: 25, color: '#AA44FF' },
];

function arcPath(r: number) {
    return `M ${100 - r},100 A ${r},${r} 0 0,1 ${100 + r},100`;
}

function RainbowArc() {
    return (
        <svg
            viewBox="0 0 200 100"
            preserveAspectRatio="none"
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                width: '100vw',
                height: '50vw',
                overflow: 'visible',
                filter: 'drop-shadow(0 0 12px rgba(255, 100, 180, 0.5))',
                animation: 'pony-arc-fade 2.2s ease forwards',
            }}
        >
            {ARCS.map(({ radius, color }, i) => {
                const arcLen = Math.PI * radius;
                return (
                    <path
                        key={i}
                        d={arcPath(radius)}
                        stroke={color}
                        strokeWidth={14}
                        fill="none"
                        strokeLinecap="butt"
                        style={{
                            '--arc-len': arcLen,
                            strokeDasharray: arcLen,
                            strokeDashoffset: arcLen,
                            animation: `pony-draw-arc 1s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.04}s forwards`,
                        } as React.CSSProperties}
                    />
                );
            })}
        </svg>
    );
}

function generateSparkles(): Sparkle[] {
    return Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 18 + 8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 1.0,
        char: CHARS[Math.floor(Math.random() * CHARS.length)],
        duration: Math.random() * 0.6 + 0.8,
    }));
}

export default function PonyTransition() {
    const [active, setActive] = useState(false);
    const [sparkles, setSparkles] = useState<Sparkle[]>([]);

    useEffect(() => {
        const handler = () => {
            setSparkles(generateSparkles());
            setActive(true);
            setTimeout(() => setActive(false), 2400);
        };
        window.addEventListener('ponytime', handler);
        return () => window.removeEventListener('ponytime', handler);
    }, []);

    if (!active || typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 9998 }}>
            <RainbowArc />

            {sparkles.map((s) => (
                <span
                    key={s.id}
                    style={{
                        position: 'absolute',
                        left: `${s.x}%`,
                        top: `${s.y}%`,
                        fontSize: `${s.size}px`,
                        color: s.color,
                        textShadow: `0 0 8px ${s.color}`,
                        lineHeight: 1,
                        animation: `pony-sparkle ${s.duration}s ease-out ${s.delay}s both`,
                    }}
                >
                    {s.char}
                </span>
            ))}
        </div>,
        document.body,
    );
}
