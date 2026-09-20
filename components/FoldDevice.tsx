'use client';

import { ReactNode } from 'react';
import { BEZEL_MM, DUO_MM, HALF_MM, RADIUS_MM, SPINE_MM } from '@/lib/geometry';
import { useFold } from './useFold';

/**
 * A physically modelled iPhone Duo.
 *
 * The device is a wide book-fold: closed it is an 84.1 x 117.8mm portrait slab,
 * and opening roughly doubles its width to 164.6 x 117.8mm. So the fold is one
 * half rotating 180 degrees about the centre hinge axis onto the other — not a
 * crossfade between two layouts.
 *
 * The inner display is ONE continuous 7.6in panel, so there is no bezel down
 * the middle: each half is bezelled on its outer edges only and the two meet at
 * the crease. The titanium hinge cover is on the back, not the display side.
 *
 * `openness` is 1 when flat open and 0 when closed. Everything else derives.
 */
export function FoldDevice({
  openness,
  inner,
  outer,
  orientation = 'landscape',
  mm = 2.6,
  className = '',
}: {
  /** Target state: 1 = flat open, 0 = closed. Animated by a damped hinge spring. */
  openness: number;
  /** Content for the continuous inner display. Drawn once, split by the fold. */
  inner: ReactNode;
  /** Content for the outer display, seen when closed. */
  outer: ReactNode;
  /** Portrait pose is the same open device turned 90°, hinge running across. */
  orientation?: 'landscape' | 'portrait';
  /** Scale, in CSS px per millimetre. */
  mm?: number;
  className?: string;
}) {
  const t = useFold(Math.min(Math.max(openness, 0), 1));

  const half = HALF_MM * mm;
  const height = DUO_MM.openHeight * mm;
  const bezel = BEZEL_MM * mm;
  const radius = RADIUS_MM * mm;
  const spine = SPINE_MM * mm;

  // 0 open -> 180 closed. The moving half sweeps a half-turn onto the other.
  const angle = (1 - t) * 180;
  const rad = (angle * Math.PI) / 180;

  // Footprint: full width when flat, one half plus the hinge spine when closed.
  // Because the assembly is anchored at x=0 and its visible span is exactly this,
  // no counter-translation is needed to keep it optically centred.
  const footprint = half * (1 + t) + spine * (1 - t);

  // Grazing angles catch the most light; head-on catches the least.
  const specular = Math.sin(rad) * 0.34;
  // The closing half occludes the static one and drops a contact shadow.
  const shadow = Math.max(0, Math.sin(rad)) * 0.66;
  // A real crease reads most under raking light on a flat panel.
  const crease = t * 0.1;

  const shell = (side: 'left' | 'right' | 'all'): React.CSSProperties => ({
    position: 'absolute',
    inset: 0,
    borderRadius:
      side === 'left'
        ? `${radius}px 0 0 ${radius}px`
        : side === 'right'
          ? `0 ${radius}px ${radius}px 0`
          : radius,
    background: 'linear-gradient(152deg,#4a4a55,#17171d 34%,#0d0d12 68%,#33333f)',
    paddingTop: bezel,
    paddingBottom: bezel,
    paddingLeft: side === 'right' ? 0 : bezel,
    paddingRight: side === 'left' ? 0 : bezel,
    boxSizing: 'border-box',
  });

  const glass = (side: 'left' | 'right' | 'all'): React.CSSProperties => ({
    width: '100%',
    height: '100%',
    borderRadius:
      side === 'left'
        ? `${Math.max(radius - bezel, 2)}px 0 0 ${Math.max(radius - bezel, 2)}px`
        : side === 'right'
          ? `0 ${Math.max(radius - bezel, 2)}px ${Math.max(radius - bezel, 2)}px 0`
          : Math.max(radius - bezel, 2),
    overflow: 'hidden',
    background: '#07070c',
    position: 'relative',
  });

  // The continuous inner display spans both halves: bezel on the outer edges only.
  const innerDisplayWidth = half * 2 - bezel * 2;

  // Portrait is the same open device turned 90°, so the hinge runs across it.
  // Rotating the assembly keeps one fold implementation for both orientations.
  const portrait = orientation === 'portrait';

  // Rotating the chassis for Portrait would carry the UI round with it. A real
  // device reorients its content instead, so counter-rotate each display's
  // contents and swap their box so they still fill the panel.
  const upright = (node: ReactNode, w: number, h: number) =>
    portrait ? (
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: h,
          height: w,
          transform: 'translate(-50%, -50%) rotate(-90deg)',
        }}
      >
        {node}
      </div>
    ) : (
      node
    );

  return (
    <div
      className={className}
      style={{
        width: portrait ? height : footprint,
        height: portrait ? footprint : height,
        display: 'grid',
        placeItems: 'center',
      }}
    >
    <div
      style={{
        width: footprint,
        height,
        transform: portrait ? 'rotate(90deg)' : undefined,
        perspective: 2600,
        perspectiveOrigin: `${half}px 50%`,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: half * 2,
          height,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Static half — left of the continuous inner display. */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: half, height }}>
          <div style={shell('left')}>
            <div style={glass('left')}>
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: innerDisplayWidth,
                  height: '100%',
                  // One vignette across the whole panel, not one per half.
                  background: 'radial-gradient(130% 100% at 50% 0%, #191926 0%, #07070c 62%)',
                }}
              >
                {upright(inner, innerDisplayWidth, height - bezel * 2)}
              </div>
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(255deg, rgba(0,0,0,${shadow}) 0%, rgba(0,0,0,${shadow * 0.4}) 58%, transparent 100%)`,
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>
        </div>

        {/* Folding half. Front is the right of the inner display; back is the outer display. */}
        <div
          style={{
            position: 'absolute',
            left: half,
            top: 0,
            width: half,
            height,
            transformStyle: 'preserve-3d',
            transformOrigin: 'left center',
            transform: `rotateY(${-angle}deg)`,
            willChange: 'transform',
          }}
        >
          <div style={{ ...shell('right'), backfaceVisibility: 'hidden' }}>
            <div style={glass('right')}>
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: innerDisplayWidth,
                  height: '100%',
                  // Shift so this half shows the continuation of the same canvas.
                  transform: `translateX(${-(half - bezel)}px)`,
                  background: 'radial-gradient(130% 100% at 50% 0%, #191926 0%, #07070c 62%)',
                }}
              >
                {upright(inner, innerDisplayWidth, height - bezel * 2)}
              </div>
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(255deg, rgba(255,255,255,${specular}), transparent 62%)`,
                  mixBlendMode: 'plus-lighter',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>

          {/* Outer display, on the back of the same half, counter-rotated to read correctly. */}
          <div
            style={{
              ...shell('all'),
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden',
              background: 'linear-gradient(152deg,#3e3e49,#141419 36%,#0b0b10 70%,#2c2c37)',
            }}
          >
            <div style={glass('all')}>
              {upright(outer, half - bezel * 2, height - bezel * 2)}
              {/* Outer front camera: a permanently active reserved region. */}
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  top: 4.4 * mm,
                  left: 3.2 * mm,
                  width: 2.5 * mm,
                  height: 2.5 * mm,
                  borderRadius: '50%',
                  background: '#04040a',
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.16)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Crease down the fold, on the display side. Subtle, and only when open. */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            left: half - 5,
            top: bezel,
            width: 10,
            height: height - bezel * 2,
            transform: 'translateZ(0.6px)',
            pointerEvents: 'none',
            background: `linear-gradient(90deg, transparent, rgba(255,255,255,${crease}) 45%, rgba(0,0,0,${crease * 1.6}) 55%, transparent)`,
          }}
        />
      </div>
    </div>
    </div>
  );
}

/** Width the device occupies at a given openness, for reserving layout space. */
export function foldFootprint(openness: number, mm = 2.6) {
  const t = Math.min(Math.max(openness, 0), 1);
  return {
    width: (HALF_MM * (1 + t) + SPINE_MM * (1 - t)) * mm,
    height: DUO_MM.openHeight * mm,
  };
}
