<div align="center">

<img src="assets/banner.png" alt="duocn — development for iPhone Duo" width="100%">

<br>

**SwiftUI components that know the phone folds.**

An opinionated component layer on top of Apple's iPhone Duo APIs — with the pose harness Xcode doesn't give you.

<br>

![version](https://img.shields.io/badge/version-0.9.0_beta-e4e4e7?style=flat-square&labelColor=08080a)
![swift](https://img.shields.io/badge/Swift-6.0-a1a1aa?style=flat-square&labelColor=08080a)
![ios](https://img.shields.io/badge/iOS-27.1_beta-a1a1aa?style=flat-square&labelColor=08080a)
![components](https://img.shields.io/badge/components-18-a1a1aa?style=flat-square&labelColor=08080a)
![dependencies](https://img.shields.io/badge/dependencies-0-a1a1aa?style=flat-square&labelColor=08080a)
![license](https://img.shields.io/badge/license-MIT-a1a1aa?style=flat-square&labelColor=08080a)

<br>

```bash
npx duocn add companion-pane
```

</div>

<br>

## Contents

[Overview](#overview) · [Requirements](#requirements) · [Installation](#installation) · [Quick start](#quick-start) · [Core concepts](#core-concepts) · [Component catalogue](#component-catalogue) · [CLI reference](#cli-reference) · [Design principles](#design-principles) · [Development](#development) · [Stability](#stability-and-versioning) · [Migrating](#migrating-from-0x) · [Contributing](#contributing) · [License](#license)

<br>

## Overview

Apple ships the primitives. In iOS 27.1 you get `ReservedRegion`, `DeviceHinge`, `ArrangementView`
and the vertical toolbar behaviours — and almost no opinions about how to use them.

**duocn is the opinionated layer on top. It is not a parallel framework.**

That distinction is enforced, not just stated. When a component here duplicates something Apple
ships, it gets deleted and the docs point you at the first-party API:

| Previously shipped | Apple ships | Outcome |
|---|---|---|
| `HingeSplit` | `ArrangementView` | Deleted. Use theirs. |
| `HingeTabBar` | `toolbarVerticalBehavior(_:)` | Deleted. It fought the platform. |
| `DuoDragBridge` | — | Deleted. It solved a problem that doesn't exist.¹ |

> ¹ It assumed the fold was a physical gap that cancels drags. The inner display is one continuous
> 7.6″ folding OLED. There is no gap, and the touch is never lost.

What remains is what Apple genuinely leaves to you: **presets**, **a pose harness**, and a
**fold-aware motion vocabulary**.

**At a glance**

| | |
|---|---|
| **18 components** | Six do something a single-screen phone physically cannot |
| **Zero dependencies** | The Swift package pulls in nothing but the standard library and SwiftUI |
| **Two ways to consume** | Swift Package Manager, or copy the file into your project and own it |
| **One source of truth** | The docs site reads the Swift straight off disk — no second copy to drift |
| **Tested logic** | Pose inference, hinge mapping and division-region behaviour are unit-tested on macOS |

<br>

## Requirements

| | |
|---|---|
| **iOS** | 27.1 or later |
| **Swift tools** | 6.0 |
| **Xcode** | Any release carrying the iOS 27.1 SDK |
| **macOS** | 14 or later — build target for running the layout tests without a device |
| **Node.js** | 18 or later, for the `npx duocn` CLI and the docs site |

> [!IMPORTANT]
> Every Duo API this library is built on is currently flagged **Beta** by Apple, so signatures may
> change before GA. That is why this release is `0.9.0` and not `1.0.0` — a beta dependency cannot
> carry a stability promise.

<br>

## Installation

**Swift Package Manager**

```swift
.package(url: "https://github.com/duocn/duocn", from: "0.9.0")
```

Then add `DuoCN` to your target's dependencies and `import DuoCN`.

**Or copy one file and own it**

```bash
npx duocn add companion-pane --dest Sources/App/UI
```

Dependencies come along automatically, so what lands compiles. No lockfile entry, no runtime,
nothing to upgrade — it is your code from that point on.

<br>

## Quick start

Lay out with size classes first. That is Apple's guidance and it covers most cases.

```swift
import SwiftUI
import DuoCN

@main
struct StudioApp: App {
    @State private var track: Track?

    var body: some Scene {
        WindowGroup {
            DuoStage {
                ArrangementView {
                    TrackList(selection: $track)
                } secondary: {
                    NowPlaying(track: track)
                }
                .arrangementViewStyle(.split)
            }
            .toastCenter()
        }
    }
}
```

`DuoStage` is a **harness**, not a layout engine. It resolves the pose, publishes fold geometry, and
lets you pin any pose in a `#Preview` — so you never have to unfold a physical device to check a
layout.

```swift
#Preview("Seated") {
    DuoStage(pose: .seated) { LibraryView() }
}
```

<br>

## Core concepts

### Two vocabularies. Don't conflate them.

This is the single most common modelling error on this device. Apple names **five poses** for
people, and exposes **three hinge states** to code.

| Pose | `DeviceHinge.Status` | Width class | Display | Division region |
|---|---|---|---|---|
| **Closed** | `.closed` | compact | Outer | — |
| **Portrait** | `.fullyOpen` | regular | Inner | — |
| **Landscape** | `.fullyOpen` | regular | Inner | — |
| **Seated** | `.partiallyOpen` | regular | Inner | horizontal |
| **Standing** | `.partiallyOpen` | regular | Outer | vertical |

Portrait and Landscape are **both fully open** — they differ by orientation, not hinge state. Which
means a fully open Duo has **no active division region**: the inner display is one continuous canvas.
Only a partially open device divides.

> [!TIP]
> Aspect ratio cannot tell you the pose. The closed outer display is `1398×2034` (ratio **0.687**)
> and the fully open device in Portrait is `1878×2670` (ratio **0.703**). Those are 2% apart. Any
> library inferring pose from window shape will report an open device as closed — this one used to,
> and there is now a regression test pinning the mistake shut.

### Hardware geometry

Every mockup on the docs site derives from Apple's published specifications rather than eyeballed
numbers, so previews match the device you eventually hold.

| | |
|---|---|
| **Open** | 164.6 × 117.8 × 5.2 mm, 254 g |
| **Closed** | 84.1 × 117.8 × 11.3 mm |
| **Inner display** | 7.6″, 1878 × 2670 @ 430 ppi |
| **Outer display** | 5.4″, 1398 × 2034 @ 460 ppi |

<br>

## Component catalogue

Components marked **Duo** do something a single-screen phone physically cannot.

| Component | Category | Install slug | What it does |
|---|---|---|---|
| `DuoStage` **Duo** | Duo Layout | `duo-stage` | Root container that reads the hardware and publishes it. |
| `CompanionPane` **Duo** | Duo Layout | `companion-pane` | Controls that stop covering the thing they control. |
| `SpanningScroll` **Duo** | Duo Layout | `spanning-scroll` | A scroll view that never lets the fold bisect a row. |
| `DuoTheme` | Foundations | `duo-theme` | Spacing, radii, colour and type — four scales, no config file. |
| `GlassCard` | Foundations | `glass-card` | The material every floating surface is drawn on. |
| `DuoHaptics` | Foundations | `duo-haptics` | One call site, and it fires on the right panel. |
| `DuoButton` | Controls | `duo-button` | Four roles, three sizes, one press that feels like glass. |
| `LiquidSlider` | Controls | `liquid-slider` | Velocity-aware, rubber-banded, grows under the thumb. |
| `HapticToggle` | Controls | `haptic-toggle` | A knob that leans into the motion, and state you can feel. |
| `SegmentedPill` | Controls | `segmented-pill` | One pill that travels, not a crossfade. |
| `FloatingDock` | Navigation | `floating-dock` | Magnifying action strip with distance falloff. |
| `DuoSheet` **Duo** | Navigation | `duo-sheet` | A sheet when closed. A resident column when open. |
| `ToastCenter` | Feedback | `toast-center` | Queued transient messages, on the panel that earned them. |
| `ShimmerSkeleton` | Feedback | `shimmer-skeleton` | One light source across two panels. |
| `ProgressRing` | Feedback | `progress-ring` | Determinate and indeterminate from one view. |
| `DuoPreviewStage` **Duo** | Media | `duo-preview` | Show the subject what the camera sees. |
| `CoverCarousel` **Duo** | Media | `cover-carousel` | Cards that fold along the same line as the hardware. |
| `AvatarStack` | Media | `avatar-stack` | Overlapping faces with a live ring on the speaker. |

`DuoPreviewStage` implements the pattern behind Apple's shipping **Duo Preview**: with the device
open, the outer display faces your subject so they can see their own framing while you shoot with the
rear cameras.

<br>

## CLI reference

```bash
npx duocn add <component...>   # copy components (and their dependencies) into your project
npx duocn list                 # show everything available, with Duo-only items marked
```

| Option | Default | Purpose |
|---|---|---|
| `--dest <dir>` | `Sources/duocn` | Where the Swift files are written |
| `--registry <url>` | `https://duocn.dev/registry` | Registry base URL — point it at a local build to test changes |

The `DUOKIT_REGISTRY` environment variable overrides the default registry base for every invocation.

```bash
# Install two components at once, into your own layer
npx duocn add duo-stage companion-pane --dest Sources/App/UI
```

<br>

## Design principles

1. **Scrollable content may cross the fold. Interactive elements may not.**
   Crossing is the documented exception — it is hit targets that must stay clear.
2. **A fully open Duo is one continuous canvas.** Only a partially open one has an active division region.
3. **Every open layout has a defined closed fallback.** No pose is a dead end.
4. **First-party wins.** If Apple ships it, this library deletes its version and points at theirs.

<br>

## Development

**Repo layout**

```
├── swift/DuoCN/        the library — Swift package, zero dependencies
├── app/ components/    the docs site — Next.js 15, Tailwind v4
├── content/registry.ts component metadata (one source of truth)
├── cli/duocn.mjs       npx duocn add <component>
├── lib/geometry.ts     iPhone Duo physical geometry, from Apple's specs
└── assets/             banner artwork
```

**Docs site**

```bash
npm install
npm run dev        # http://localhost:3100
npm run registry   # regenerate public/registry/*.json, which the CLI installs from
npm run build      # rebuild the registry, then build the site
```

The site reads the Swift straight off disk, so the code on a component page **is** the code in the
package — there is no second copy to drift. Alongside the component pages it ships a **pose
explorer** and a **fold lab** for inspecting layouts across all five poses in the browser.

**Tests**

```bash
swift test --package-path swift/DuoCN   # or: npm run test:swift
```

Coverage focuses on the logic that is easy to get wrong and expensive to debug on hardware: pose
inference (including the regression that closed and open-Portrait are indistinguishable by aspect
ratio), the pose → hinge-status mapping, degenerate window sizes, which poses use the outer display,
and that a fully open device reports no active division region.

<br>

## Stability and versioning

The project follows semantic versioning. While the underlying Apple APIs are flagged Beta, releases
stay on the `0.x` line and a minor bump may carry a breaking change; the release notes call out every
one. Removed symbols ship a one-release deprecation shim that names the Apple API replacing them, so
upgrades never fail silently.

<br>

## Migrating from 0.x

<details>
<summary><b>Symbol-by-symbol mapping</b></summary>

<br>

The old `DuoPosture` enum (`.folded / .book / .tent / .flat`) matched neither Apple vocabulary, and
inferred the pose from window aspect ratio — which provably cannot work.

| 0.x | 0.9 |
|---|---|
| `DuoPosture` | `DuoPose` (five Apple poses) + `DuoHingeStatus` (three runtime states) |
| `\.duoPosture` | `\.duoPose` — but prefer `horizontalSizeClass` for layout |
| `DuoHinge` / `.occlusion` | `DuoFold` / `.divisionWidth`, or `ReservedRegion(kind: .division)` |
| `DuoScreen` (3 values) | `DuoDisplay` (`.inner` / `.outer`) — the Duo has exactly two displays |
| `HingeSplit` | `ArrangementView` (first-party) |
| `HingeTabBar` | System vertical controls — `toolbarVerticalBehavior(_:)` |
| `DuoDragBridge` | Removed, no replacement needed |
| `MirrorStage` | `DuoPreviewStage` |

Deleted symbols ship a one-release deprecation shim naming the Apple API that replaces them.

</details>

<br>

## Contributing

Issues and pull requests are welcome. Before opening one, please:

- Check whether Apple already ships the behaviour — if they do, the answer here is a docs link, not a component.
- Keep the Swift package dependency-free.
- Add or update a test when you change pose, hinge or fold-geometry logic, and run `swift test --package-path swift/DuoCN`.
- Run `npm run registry` if you touch `content/registry.ts`, so the published registry stays in sync.

<br>

## License

Released under the [MIT License](LICENSE).

## Author

Built and maintained by **John Paul** ([@RJohnPaul](https://github.com/RJohnPaul)).

If duocn saves you an afternoon of fold debugging, a star on the repository is appreciated.

<br>
