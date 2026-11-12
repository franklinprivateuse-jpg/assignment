import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Reusable GSAP animation hook — fades in and slides up the referenced
 * element on mount. Returns a ref to attach to the target element.
 *
 * Usage:
 *   const ref = useGsapFadeIn<HTMLDivElement>();
 *   return <div ref={ref}>...</div>;
 */
export function useGsapFadeIn<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    );
  }, []);

  return ref;
}