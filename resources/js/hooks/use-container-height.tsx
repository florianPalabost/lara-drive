import { useEffect, useRef, useState } from 'react';

/**
 * Measures the pixel height of a container div via ResizeObserver.
 * Useful for libraries (like react-arborist) that require an explicit height prop.
 */
export function useContainerHeight(fallback = 300): [React.RefObject<HTMLDivElement | null>, number] {
    const ref = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(fallback);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        setHeight(el.getBoundingClientRect().height || fallback);

        const observer = new ResizeObserver(([entry]) => {
            setHeight(entry.contentRect.height);
        });

        observer.observe(el);
        return () => observer.disconnect();
    }, [fallback]);

    return [ref, height];
}
