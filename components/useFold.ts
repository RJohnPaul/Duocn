'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * A critically damped spring, integrated at a fixed 240Hz substep.
 *
 * Why not a normal spring: a titanium hinge has friction. It does not bounce,
 * and it does not overshoot and come back. Any spring with dampingFraction < 1
 * reads as plastic. Critical damping (zeta = 1) is the fastest approach to the
 * target that never overshoots — which is exactly what a damped hinge does.
 *
 * Why not a CSS transition: a transition restarts from its current value with a
 * fresh curve when you interrupt it, so reversing mid-fold produces a visible
 * velocity discontinuity. Carrying velocity across the reversal is the whole
 * point — drag the fold halfway, let go, and it continues from the speed it
 * already had.
 *
 * Fixed substeps make the motion identical at 60Hz and 120Hz; integrating with
 * a raw frame delta would make the curve frame-rate dependent.
 */
const SUBSTEP = 1 / 240;
const REST_POSITION = 0.0004;
const REST_VELOCITY = 0.0008;

export function useFold(target: number, omega = 10) {
  const [value, setValue] = useState(target);
  const state = useRef({ x: target, v: 0 });
  const frame = useRef<number | null>(null);
  const last = useRef(0);
  const accumulator = useRef(0);

  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      state.current = { x: target, v: 0 };
      setValue(target);
      return;
    }

    last.current = 0;
    accumulator.current = 0;

    const tick = (now: number) => {
      if (!last.current) last.current = now;
      // Clamp so a backgrounded tab doesn't integrate a huge dt on return.
      const dt = Math.min((now - last.current) / 1000, 0.05);
      last.current = now;
      accumulator.current += dt;

      const s = state.current;
      while (accumulator.current >= SUBSTEP) {
        const accel = omega * omega * (target - s.x) - 2 * omega * s.v;
        s.v += accel * SUBSTEP;
        s.x += s.v * SUBSTEP;
        accumulator.current -= SUBSTEP;
      }

      if (Math.abs(target - s.x) < REST_POSITION && Math.abs(s.v) < REST_VELOCITY) {
        s.x = target;
        s.v = 0;
        setValue(target);
        frame.current = null;
        return;
      }

      setValue(s.x);
      frame.current = requestAnimationFrame(tick);
    };

    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = null;
    };
  }, [target, omega]);

  return value;
}
