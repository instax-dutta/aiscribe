'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

const BALANCED_EASE = (t: number): number =>
  Math.min(1, 1.001 - Math.pow(2, -10 * t));

/**
 * SmoothScroll — wraps the page in a balanced Lenis instance.
 *
 * Config rationale ("balanced", not floaty, not snappy):
 *   lerp: 0.1              — default; smooth without feeling laggy
 *   duration: 1.2          — slightly above default 1.0; gentle inertia
 *   wheelMultiplier: 1     — wheel speed matches user intent
 *   touchMultiplier: 1.2   — a touch more responsive on touch devices
 *   smoothWheel: true      — explicit; we want it
 *   autoRaf: true          — Lenis drives its own RAF loop
 *   anchors: true          — smooth in-page anchor scrolling
 *   overscroll: true       — native bounce on macOS trackpads
 *   prevent(node)          — opt out of nested scroll surfaces
 *                            (drawer, modals, toast) so they remain
 *                            on native scroll and don't fight Lenis
 *
 * Respects `prefers-reduced-motion: reduce` by skipping Lenis entirely.
 */
export default function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: BALANCED_EASE,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      lerp: 0.1,
      autoRaf: true,
      anchors: true,
      overscroll: true,
      prevent: (node: HTMLElement) => {
        // Anything inside these surfaces uses native scroll
        if (node.closest('.drawer-panel')) return true;
        if (node.closest('.modal-panel')) return true;
        if (node.closest('.transcript-box')) return true;
        if (node.closest('audio')) return true;
        if (node.closest('input, textarea, select')) return true;
        return false;
      },
    });

    lenisRef.current = lenis;

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return null;
}
