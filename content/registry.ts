export const CATEGORIES = [
  'Foundations',
  'Duo Layout',
  'Controls',
  'Navigation',
  'Feedback',
  'Media',
] as const;

export type Category = (typeof CATEGORIES)[number];
export type Pose = 'closed' | 'portrait' | 'landscape' | 'seated' | 'standing';

export type ApiRow = {
  name: string;
  type: string;
  default?: string;
  description: string;
};

export type Component = {
  slug: string;
  name: string;
  category: Category;
  tagline: string;
  description: string;
  /** Path inside swift/DuoCN/Sources/duocn — the one copy of the code. */
  file: string;
  /** Extra files this component needs to compile when copied out on its own. */
  alsoFiles?: string[];
  usage: string;
  api: ApiRow[];
  /** Poses the live preview is worth toggling through. */
  poses: Pose[];
  /** Does something a single-screen phone physically cannot. */
  duoOnly?: boolean;
  dependsOn?: string[];
};

export const COMPONENTS: Component[] = [
  {
    slug: 'duo-stage',
    name: 'DuoStage',
    category: 'Duo Layout',
    tagline: 'Root container that reads the hardware and publishes it.',
    description:
      'One stage at the top of your scene. It resolves the pose, computes fold geometry and publishes both through the environment. Lay out with size classes first — this is the harness for the cases they do not cover, and for pinning a pose in a preview so you never have to unfold a physical device to check a layout.',
    file: 'Duo/DuoStage.swift',
    // DuoStage publishes these types, so a copied-out DuoStage needs them too.
    alsoFiles: ['Duo/DuoPose.swift'],
    duoOnly: true,
    poses: ['closed', 'landscape', 'seated'],
    usage: `@main
struct DemoApp: App {
    var body: some Scene {
        WindowGroup {
            DuoStage {
                LibraryView()
            }
            .toastCenter()
        }
    }
}

// Pin a pose while designing:
#Preview("Book") {
    DuoStage(pose: .landscape) { LibraryView() }
}`,
    api: [
      { name: 'pose', type: 'DuoPose?', default: 'nil', description: 'Pin a pose. nil resolves it from the size class.' },
      { name: 'content', type: '() -> Content', description: 'Your scene.' },
      { name: 'Animation.duoFold', type: 'Animation', description: 'duocn\u2019s fold curve. Apple publishes none, so this is our opinion: near-critical damping, because a hinge settles without overshooting.' },
      { name: 'DuoStageSizeKey', type: 'PreferenceKey', description: 'Reads the stage size from a parent if you need it.' },
    ],
  },
  {
    slug: 'companion-pane',
    name: 'CompanionPane',
    category: 'Duo Layout',
    tagline: 'Controls that stop covering the thing they control.',
    description:
      'The Duo’s actual win: an inspector, transport bar or tool palette no longer has to sit on top of your content. Wrap it in a companion pane and it takes its own column of the inner display when open, stacks below the canvas in Portrait and Seated, and becomes a bottom bar when closed.',
    file: 'Duo/CompanionPane.swift',
    duoOnly: true,
    dependsOn: ['duo-stage', 'glass-card'],
    poses: ['closed', 'landscape', 'seated'],
    usage: `CanvasView(document: $doc)
    .companionPane(edge: .trailing, width: 320) {
        BrushInspector(brush: $brush)
        LayerList(layers: doc.layers)
    }`,
    api: [
      { name: 'edge', type: 'HorizontalEdge', default: '.trailing', description: 'Which panel the pane occupies when spanned.' },
      { name: 'width', type: 'CGFloat', default: '320', description: 'Pane width when the device is open.' },
      { name: 'content', type: '() -> Pane', description: 'Pane body. Rendered on the same inner display, beside the content.' },
    ],
  },
  {
    slug: 'spanning-scroll',
    name: 'SpanningScroll',
    category: 'Duo Layout',
    tagline: 'A scroll view that never lets the fold bisect a row.',
    description:
      'Scrollable content is allowed to cross the fold — that is the documented exception. What looks wrong is a row cut in half by it. SpanningScroll pads so a row boundary lands on the division region instead. It only does anything while the device is partially open; fully open there is nothing to avoid, and closed there is no fold.',
    file: 'Duo/SpanningScroll.swift',
    duoOnly: true,
    dependsOn: ['duo-stage'],
    poses: ['closed', 'seated', 'landscape'],
    usage: `SpanningScroll(rowHeight: 76) {
    ForEach(tracks) { track in
        TrackRow(track: track)
            .frame(height: 76)
    }
}`,
    api: [
      { name: 'rowHeight', type: 'CGFloat', description: 'Uniform row height. Required — the snap math needs it.' },
      { name: 'content', type: '() -> Content', description: 'Rows, in a LazyVStack.' },
    ],
  },
  {
    slug: 'duo-preview',
    name: 'DuoPreviewStage',
    category: 'Media',
    tagline: 'Show the subject what the camera sees.',
    description:
      'This implements the pattern behind Apple\u2019s shipping Duo Preview feature: with the device open, the outer display faces the person you are photographing, so they can see their own framing while you shoot with the rear cameras. It renders an operator view and a subject view, mirrors the subject panel so it reads correctly to them, and keeps both in sync.',
    file: 'Duo/DuoPreviewStage.swift',
    duoOnly: true,
    dependsOn: ['duo-stage'],
    poses: ['closed', 'landscape', 'seated'],
    usage: `DuoPreviewStage {
    CameraPreview(session: session)
        .overlay(alignment: .bottom) { ShutterBar() }
} subject: {
    CameraPreview(session: session)
        .overlay(CountdownRing(seconds: countdown))
}`,
    api: [
      { name: 'operatorView', type: '() -> Operator', description: 'What the photographer sees, on the primary panel.' },
      { name: 'subject', type: '() -> Subject', description: 'What the subject sees, on the outward panel.' },
    ],
  },
  {
    slug: 'duo-theme',
    name: 'DuoTheme',
    category: 'Foundations',
    tagline: 'Spacing, radii, colour and type — four scales, no config file.',
    description:
      'Concentric corner radii so nested cards line up with the Duo’s display corners, a doubling spacing scale, semantic colours that adapt to the cooler white point of the secondary panel, and a type ramp named by role rather than size.',
    file: 'Foundations/DuoTheme.swift',
    poses: ['closed', 'landscape'],
    usage: `Text("Now Playing")
    .font(.duo(.headline))
    .foregroundStyle(DuoColor.label)
    .padding(DuoSpacing.lg)
    .background(DuoColor.surface, in:
        RoundedRectangle(cornerRadius: DuoRadius.lg, style: .continuous))

// Children stay concentric with their parent:
let inner = DuoRadius.concentric(inside: DuoRadius.panel, inset: DuoSpacing.md)`,
    api: [
      { name: 'DuoSpacing', type: 'enum', description: 'xs 4, sm 8, md 12, lg 20, xl 32, xxl 52.' },
      { name: 'DuoRadius', type: 'enum', description: 'sm 10, md 18, lg 28, panel 44, plus concentric(inside:inset:).' },
      { name: 'DuoColor', type: 'enum', description: 'accent, surface, hairline, label, positive, critical, accentGradient.' },
      { name: 'Font.duo(_:)', type: '(DuoTextStyle) -> Font', description: 'display, title, headline, body, label, mono, caption.' },
    ],
  },
  {
    slug: 'glass-card',
    name: 'GlassCard',
    category: 'Foundations',
    tagline: 'The material every floating surface is drawn on.',
    description:
      'A blur, a hairline, and one specular edge that tracks the hinge angle — so as the Duo unfolds, light moves across your cards the way it moves across the chassis. Three depths cover every surface in an app, and none of them stack shadows on shadows.',
    file: 'Foundations/DuoGlass.swift',
    dependsOn: ['duo-theme'],
    poses: ['closed', 'landscape'],
    usage: `GlassCard {
    Text("Battery").font(.duo(.label))
    ProgressRing(progress: 0.82, label: "82%")
}

// Or apply the material to anything:
MapView()
    .duoGlass(.floating, radius: DuoRadius.panel)`,
    api: [
      { name: 'depth', type: 'DuoGlass.Depth', default: '.raised', description: '.floating (docks, toasts), .raised (cards), .inset (inputs).' },
      { name: 'padding', type: 'CGFloat', default: 'DuoSpacing.lg', description: 'Inner padding of the card.' },
      { name: '.duoGlass(_:radius:)', type: 'View modifier', description: 'Apply the material without the card padding.' },
    ],
  },
  {
    slug: 'duo-haptics',
    name: 'DuoHaptics',
    category: 'Foundations',
    tagline: 'One call site, and it fires on the right panel.',
    description:
      'One call site for feedback, so every tap in your app feels the same. DuoHaptics takes the display along with the event so call sites stay explicit about where the touch happened. Every duocn control routes through it.',
    file: 'Foundations/DuoHaptics.swift',
        poses: ['closed', 'landscape'],
    usage: `Button("Save") {
    try await store.save()
    DuoHaptics.play(.success, on: screen)
}

// Events: .select .toggleOn .toggleOff .success .warning .failure .hingeDetent`,
    api: [
      { name: 'play(_:on:)', type: '(Event, DuoScreen) -> Void', default: 'on: .primary', description: 'Fire feedback. No-op where haptics are unavailable.' },
      { name: 'Event', type: 'enum', description: 'select, toggleOn, toggleOff, success, warning, failure, hingeDetent.' },
    ],
  },
  {
    slug: 'duo-button',
    name: 'DuoButton',
    category: 'Controls',
    tagline: 'Four roles, three sizes, one press that feels like glass.',
    description:
      'The press animation scales the button and dims its specular edge at the same time, which is what separates a glass button from a rounded rectangle with a tint. Haptics fire on press, not release, and on the panel that was touched.',
    file: 'Controls/DuoButton.swift',
    dependsOn: ['duo-theme', 'duo-haptics'],
    poses: ['closed', 'landscape'],
    usage: `Button("Continue") { advance() }
    .buttonStyle(.duo(.primary, size: .large))

Button("Not now") { dismiss() }
    .buttonStyle(.duo(.plain))

Button("Delete album", role: .destructive) { delete() }
    .buttonStyle(.duo(.destructive))`,
    api: [
      { name: 'role', type: 'DuoButtonStyle.Role', default: '.secondary', description: '.primary, .secondary, .plain, .destructive.' },
      { name: 'size', type: 'DuoButtonStyle.Size', default: '.regular', description: '.compact 34pt, .regular 46pt, .large 56pt.' },
    ],
  },
  {
    slug: 'liquid-slider',
    name: 'LiquidSlider',
    category: 'Controls',
    tagline: 'Velocity-aware, rubber-banded, grows under the thumb.',
    description:
      'The fill overshoots on release and settles once. Drag past either end and it resists instead of clipping. The gesture reads predicted end location, so a flick lands where the user aimed rather than where their thumb happened to stop.',
    file: 'Controls/LiquidSlider.swift',
    dependsOn: ['duo-theme', 'duo-haptics'],
    poses: ['closed', 'landscape'],
    usage: `LiquidSlider(value: $volume, in: 0...1) {
    Image(systemName: "speaker.wave.3.fill")
}

LiquidSlider(value: $exposure, in: -2...2)`,
    api: [
      { name: 'value', type: 'Binding<Double>', description: 'The bound value.' },
      { name: 'in', type: 'ClosedRange<Double>', default: '0...1', description: 'Bounds. Any range, including negative.' },
      { name: 'icon', type: '() -> Icon', default: 'EmptyView()', description: 'Optional leading glyph drawn over the fill.' },
    ],
  },
  {
    slug: 'haptic-toggle',
    name: 'HapticToggle',
    category: 'Controls',
    tagline: 'A knob that leans into the motion, and state you can feel.',
    description:
      'A rigid tick going on, a soft one going off — so the state is legible without looking, which matters when the control is on the panel you are not watching. The knob squashes toward its travel direction and rounds out on arrival.',
    file: 'Controls/HapticToggle.swift',
    dependsOn: ['duo-haptics'],
    poses: ['closed', 'landscape'],
    usage: `HapticToggle("Spatial audio",
             subtitle: "Head tracking on supported devices",
             isOn: $spatial)`,
    api: [
      { name: 'title', type: 'String', description: 'Primary label.' },
      { name: 'subtitle', type: 'String?', default: 'nil', description: 'Secondary line.' },
      { name: 'isOn', type: 'Binding<Bool>', description: 'Bound state. Exposed to VoiceOver as a real Toggle.' },
    ],
  },
  {
    slug: 'segmented-pill',
    name: 'SegmentedPill',
    category: 'Controls',
    tagline: 'One pill that travels, not a crossfade.',
    description:
      'The selection indicator is a single matched-geometry object, so it slides between options as one continuous piece of glass. Generic over any Hashable & Identifiable, so your enum drops straight in.',
    file: 'Controls/SegmentedPill.swift',
    dependsOn: ['duo-theme'],
    poses: ['closed', 'landscape'],
    usage: `enum Range: String, CaseIterable, Identifiable {
    case day, week, month
    var id: Self { self }
}

SegmentedPill(selection: $range, options: Range.allCases) {
    $0.rawValue.capitalized
}`,
    api: [
      { name: 'selection', type: 'Binding<Option>', description: 'Current option.' },
      { name: 'options', type: '[Option]', description: 'All options, in display order.' },
      { name: 'label', type: '(Option) -> String', description: 'Title for each option.' },
    ],
  },
  {
    slug: 'floating-dock',
    name: 'FloatingDock',
    category: 'Navigation',
    tagline: 'Magnifying action strip with distance falloff.',
    description:
      'Items grow with a falloff across their neighbours, so the row reads as one elastic strip rather than a set of independent buttons. Sized for thumbs when closed and for a pointer when the Duo is docked to a display.',
    file: 'Navigation/FloatingDock.swift',
    dependsOn: ['glass-card'],
    poses: ['closed', 'landscape'],
    usage: `FloatingDock(items: [
    .init(systemImage: "wand.and.stars", title: "Enhance") { enhance() },
    .init(systemImage: "crop", title: "Crop") { crop() },
    .init(systemImage: "slider.horizontal.3", title: "Adjust") { adjust() },
    .init(systemImage: "square.and.arrow.up", title: "Share") { share() },
])`,
    api: [
      { name: 'items', type: '[FloatingDock.Item]', description: 'SF Symbol, accessibility title, and action.' },
    ],
  },
  {
    slug: 'duo-sheet',
    name: 'DuoSheet',
    category: 'Navigation',
    tagline: 'A sheet when closed. A resident column when open.',
    description:
      'A bottom sheet covering half your screen is a compromise you make on a phone with one display. On an open Duo you do not have to. The same call presents detents when closed and a resident column on the inner display when open — and nothing gets covered.',
    file: 'Navigation/DuoSheet.swift',
    duoOnly: true,
    dependsOn: ['companion-pane'],
    poses: ['closed', 'landscape'],
    usage: `PhotoGrid(photos: photos)
    .duoSheet(isPresented: $showsFilters, detents: [0.32, 0.9]) {
        FiltersView(filter: $filter)
    }`,
    api: [
      { name: 'isPresented', type: 'Binding<Bool>', description: 'Presentation state, same as .sheet.' },
      { name: 'detents', type: '[CGFloat]', default: '[0.4, 0.95]', description: 'Fractional detents, used only when the device is closed.' },
      { name: 'content', type: '() -> C', description: 'Sheet or panel body.' },
    ],
  },
  {
    slug: 'toast-center',
    name: 'ToastCenter',
    category: 'Feedback',
    tagline: 'Queued transient messages, on the panel that earned them.',
    description:
      'A confirmation on the far screen is a confirmation nobody reads. Toasts are posted with the screen the action happened on, and queued so two never collide. Install once at the root; post from anywhere.',
    file: 'Feedback/ToastCenter.swift',
    dependsOn: ['glass-card', 'duo-haptics'],
    poses: ['closed', 'landscape'],
    usage: `DuoStage { RootView() }
    .toastCenter(alignment: .top)

// anywhere in the app:
ToastCenter.shared.post(.success("Saved to Library"), on: screen)
ToastCenter.shared.post(.error("Offline — queued for later"))`,
    api: [
      { name: 'post(_:on:)', type: '(Toast, DuoScreen) -> Void', description: 'Enqueue a toast.' },
      { name: 'Toast.success / .error / .info', type: 'static', description: 'Preset tint, symbol and duration.' },
      { name: '.toastCenter(alignment:)', type: 'View modifier', default: '.top', description: 'Install the presenter. Apply once, at the root.' },
    ],
  },
  {
    slug: 'shimmer-skeleton',
    name: 'ShimmerSkeleton',
    category: 'Feedback',
    tagline: 'One light source across two panels.',
    description:
      'A loading placeholder whose sweep is phased by which display it is on, so a skeleton on the outer display does not look like a second, unrelated app. Respects Reduce Motion.',
    file: 'Feedback/ShimmerSkeleton.swift',
        poses: ['closed', 'landscape'],
    usage: `if tracks.isEmpty {
    ShimmerSkeleton(lines: 4)
        .padding(DuoSpacing.lg)
} else {
    TrackList(tracks: tracks)
}`,
    api: [
      { name: 'lines', type: 'Int', default: '3', description: 'Placeholder line count. The last line is short.' },
      { name: 'cornerRadius', type: 'CGFloat', default: 'DuoRadius.sm', description: 'Line corner radius.' },
    ],
  },
  {
    slug: 'progress-ring',
    name: 'ProgressRing',
    category: 'Feedback',
    tagline: 'Determinate and indeterminate from one view.',
    description:
      'An angular gradient rotates with the value so the brightest point sits at the head of the arc. Pass nil for progress and the same view spins as an indeterminate indicator — no second component, no swapping views mid-transition.',
    file: 'Feedback/ProgressRing.swift',
    dependsOn: ['duo-theme'],
    poses: ['closed', 'landscape'],
    usage: `ProgressRing(progress: downloaded, label: "\\(Int(downloaded * 100))%")
    .frame(width: 120, height: 120)

ProgressRing(progress: nil)   // indeterminate
    .frame(width: 28, height: 28)`,
    api: [
      { name: 'progress', type: 'Double?', description: '0…1 clamped, or nil for indeterminate.' },
      { name: 'label', type: 'String?', default: 'nil', description: 'Centre text. Animates with .numericText().' },
      { name: 'lineWidth', type: 'CGFloat', default: '10', description: 'Stroke width.' },
    ],
  },
  {
    slug: 'cover-carousel',
    name: 'CoverCarousel',
    category: 'Media',
    tagline: 'Cards that fold along the same line as the hardware.',
    description:
      'A depth carousel that reads the hinge angle as a real camera angle. Cards tilt away from centre in 3D, and the tilt strengthens as the Duo folds, so the stack appears to hinge along the same line as the chassis. It is the effect that makes an app feel made for the device rather than resized onto it.',
    file: 'Media/CoverCarousel.swift',
    duoOnly: true,
    dependsOn: ['duo-stage'],
    poses: ['closed', 'landscape'],
    usage: `CoverCarousel(items: albums, cardWidth: 220) { album in
    AsyncImage(url: album.artworkURL) { $0.resizable().scaledToFill() }
        placeholder: { ShimmerSkeleton(lines: 1) }
}`,
    api: [
      { name: 'items', type: '[Item]', description: 'Any Identifiable collection.' },
      { name: 'cardWidth', type: 'CGFloat', default: '220', description: 'Card width. Height is 1.25×.' },
      { name: 'card', type: '(Item) -> Card', description: 'Card body, clipped to the kit radius.' },
    ],
  },
  {
    slug: 'avatar-stack',
    name: 'AvatarStack',
    category: 'Media',
    tagline: 'Overlapping faces with a live ring on the speaker.',
    description:
      'Built for the Duo split-call layout, where the roster lives on one panel and the stage on the other. Overflow collapses into a count, the active speaker gets a ring and a lift, and the whole stack is one accessibility element instead of twelve.',
    file: 'Media/AvatarStack.swift',
    dependsOn: ['duo-theme'],
    poses: ['closed', 'landscape'],
    usage: `AvatarStack(
    people: room.participants,
    visible: 4,
    speakingID: room.activeSpeaker,
    initials: \\.initials
)`,
    api: [
      { name: 'people', type: '[Person]', description: 'Any Identifiable collection.' },
      { name: 'visible', type: 'Int', default: '4', description: 'How many to show before the overflow count.' },
      { name: 'speakingID', type: 'Person.ID?', default: 'nil', description: 'Gets the live ring and a lift.' },
      { name: 'size', type: 'CGFloat', default: '38', description: 'Avatar diameter.' },
      { name: 'image / initials', type: 'closures', description: 'Image if you have one, initials as the fallback.' },
    ],
  },
];

export const bySlug = (slug: string) => COMPONENTS.find((c) => c.slug === slug);

export const byCategory = () =>
  CATEGORIES.map((category) => ({
    category,
    items: COMPONENTS.filter((c) => c.category === category),
  })).filter((g) => g.items.length > 0);
