/**
 * iPhone Duo physical geometry, from Apple's published technical specifications.
 * Every mockup on this site derives from these numbers rather than eyeballed ones.
 *
 * Source: apple.com/in/iphone-duo/specs/ (read 2026-09-20)
 *   Open   164.6 x 117.8 x 5.2 mm, 254 g
 *   Closed  84.1 x 117.8 x 11.3 mm
 *   Inner display 7.6"  1878 x 2670 @ 430 ppi
 *   Outer display 5.4"  1398 x 2034 @ 460 ppi
 */
export const DUO_MM = {
  openWidth: 164.6,
  openHeight: 117.8,
  openDepth: 5.2,
  closedWidth: 84.1,
  closedDepth: 11.3,
} as const;

/** Display diagonals resolve to these physical sizes: px / ppi * 25.4. */
export const DISPLAY_MM = {
  /** Inner display, long axis runs across the open device. */
  inner: { long: (2670 / 430) * 25.4, short: (1878 / 430) * 25.4 },
  /** Outer display, portrait on the closed device. */
  outer: { long: (2034 / 460) * 25.4, short: (1398 / 460) * 25.4 },
} as const;

/**
 * Bezel falls out of (device - display) and lands at ~3.4mm on every edge,
 * which is a good sign the published figures are internally consistent.
 */
export const BEZEL_MM = (DUO_MM.openHeight - DISPLAY_MM.inner.short) / 2;

/** Half-panel width. Two halves plus hinge curvature give the closed width. */
export const HALF_MM = DUO_MM.openWidth / 2;

/** Closed is slightly wider than one half — the hinge spine accounts for it. */
export const SPINE_MM = DUO_MM.closedWidth - HALF_MM;

/** Continuous corner radius that reads as titanium at this size. */
export const RADIUS_MM = 9.5;

export const ASPECT = {
  open: DUO_MM.openWidth / DUO_MM.openHeight,      // 1.397 — landscape slab
  closed: DUO_MM.closedWidth / DUO_MM.openHeight,  // 0.714 — short portrait slab
} as const;
