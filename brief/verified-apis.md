# Verified first-party API surface (checked directly, not via agent)

Every symbol below was read on developer.apple.com on 2026-09-20. All are **iOS 27.1+ / iPadOS 27.1+, Beta**
unless noted. This is the factual spine of the brief — nothing here is inferred.

## The finding that matters most

DuoKit's entire "Duo Layout" category is a reimplementation of shipping first-party API.

| DuoKit invents | Apple already ships | Verdict |
|---|---|---|
| `HingeSplit(ratio:whenFolded:primary:secondary:)` | `ArrangementView { } secondary: { }` + `.arrangementViewStyle(.split/.overlay/.automatic)` | **Delete or rebase.** Near-identical API shape. |
| `DuoHinge.angle` | `DeviceHinge.angle: Angle` via `.onHingeChange { }` | **Delete.** Real sensor value vs. a guess. |
| `DuoStage.inferPosture(in: CGSize)` (window aspect ratio) | `DeviceHinge.Status` + `horizontalSizeClass` | **Delete.** Aspect-ratio inference is a heuristic for data the OS hands you. |
| `DuoHinge.occlusion` / `rect(in:)` | `proxy.reservedRegions(kind: .division)` → `frame`, `margins`, `isActive` | **Delete.** |
| `HingeTabBar` (navigation on the seam) | System vertical controls: `toolbarVerticalEdge`, `ToolbarVerticalBehavior`, `ToolbarItemAxisBehavior` | **Delete.** Fights the platform. |
| `MirrorStage` | Apple's shipping **Duo Preview** feature | **Rename** to match Apple's noun. |

## ArrangementView (SwiftUI)

> "A view that arranges primary and secondary content using an adaptive layout that responds to the environment."

```swift
ArrangementView {
    NowPlayingView()
} secondary: {
    LyricsView()
}
.arrangementViewStyle(.split)
```

- `struct ArrangementView<Primary, Secondary> where Primary: View, Secondary: View`, `nonisolated`
- Styles: `AutomaticArrangementViewStyle` (default, resolves to split), `OverlayArrangementViewStyle`, `SplitArrangementViewStyle`
- Overlay layers primary over secondary in z-order and **"can transition its views from a layered layout into a
  side-by-side layout"** when a foldable device is folded. `axes(_:)` controls which axes are supported.
- The split arrangement "adapts its axis based on the available size and size class."

## DeviceHinge (SwiftUI)

> "A type encapsulating the state of a single hinge."

```swift
@State private var hinge: DeviceHinge? = nil

var body: some View {
    AngleDisplayView(angle: hinge?.angle ?? .zero)
        .onHingeChange { _, newContext in
            hinge = newContext.hinge
        }
}
```

- `var angle: Angle` — current hinge angle
- `var status: DeviceHinge.Status`
- `DeviceHinge.Status` has exactly **three** values: `.closed`, `.fullyOpen`, `.partiallyOpen`
- `func onHingeChange(isEnabled:(DeviceHingeContext, DeviceHingeContext) -> Void) -> some View`
- `struct DeviceHingeContext`
- The hinge is **optional** — Apple's own sample renders `ContentUnavailableView("Hinge Unavailable")` when nil.
  Any DuoKit component must degrade on non-foldable hardware.

## ReservedRegion (SwiftUI)

- Two kinds: `.occlusion` (Dynamic Island, cameras, window controls) and `.division` (the fold of a hinge)
- `proxy.reservedRegions(kind:options:layoutDirectionBehavior:)` on `GeometryProxy`
- Properties: `id`, `frame: CGRect` (includes margins), `isActive: Bool`, `kind`, `margins: EdgeInsets`
- Returns regions whether or not currently active — **must check `isActive`**
- RTL: system mirrors region geometry by default; `LayoutDirectionBehavior.fixed` opts out
  (`LayoutDirectionBehavior` is iOS 17.0+, shipping, the only non-beta piece)
- Doc path quirk: `/reservedregion/kind-swift.struct`, not `/reservedregion/kind`

## Two vocabularies — do not conflate them

| Layer | Vocabulary | Where it is valid |
|---|---|---|
| Marketing / design | **5 poses**: Closed, Portrait, Landscape, Seated, Standing | apple.com/iphone-duo, site copy, the Playground UI |
| Runtime API | **3 hinge statuses** × size class × reserved regions | Swift code, component branching |

DuoKit's 4-value `DuoPosture` (`.folded/.book/.tent/.flat`) matches **neither**. It is a third, invented vocabulary.

## Documented accessibility surface for iPhone Duo: almost nothing

Across the Duo HIG page, the "Preparing your app for iPhone Duo" technology overview, all six Duo Tech Talks
(111461–111466), the HIG VoiceOver and Accessibility pages, and the Accessibility framework's what's-new page,
the terms "VoiceOver", "Dynamic Type" and "focus order" appear **zero times** in a Duo context.

The single documented item: **vertical bars gain an opaque background when Reduce Transparency is on.**

Consequence for the brief: an "Accessibility First" section cannot cite Apple. Every claim must be framed as
DuoKit's own engineering commitment, with a test that proves it — or cut.

## Source URLs

- https://www.apple.com/in/iphone-duo/ and /specs/
- https://developer.apple.com/design/human-interface-guidelines/designing-for-iphone-duo
- https://developer.apple.com/documentation/technologyoverviews/preparing-your-app-for-iphone-duo
- https://developer.apple.com/documentation/swiftui/reservedregion
- https://developer.apple.com/documentation/swiftui/arrangementview
- https://developer.apple.com/documentation/swiftui/devicehinge
- https://developer.apple.com/documentation/swiftui/devicehinge/status-swift.struct
