import SwiftUI

/// Root container for an iPhone Duo scene.
///
/// `DuoStage` resolves the current ``DuoPose``, computes fold geometry and
/// publishes both through the environment, so previews and the simulator can
/// exercise every pose without the hardware.
///
/// ```swift
/// @main struct DemoApp: App {
///     var body: some Scene {
///         WindowGroup {
///             DuoStage { LibraryView() }
///         }
///     }
/// }
/// ```
///
/// **What this is for.** Apple's guidance is to lay out with size classes and
/// let content expand — not to branch per pose. `DuoStage` exists for the cases
/// size classes genuinely do not cover: previewing a specific pose, and reading
/// fold geometry for the handful of components that need it. It is a harness,
/// not a replacement for adaptive layout.
///
/// On iOS 27.1 and later, prefer `onHingeChange` and
/// `GeometryProxy.reservedRegions(kind: .division)` for live values. Pass
/// `pose:` here to pin a pose while you build a screen.
public struct DuoStage<Content: View>: View {
    private let forcedPose: DuoPose?
    private let content: Content

    #if os(iOS)
    @Environment(\.horizontalSizeClass) private var horizontalSizeClass
    #endif

    /// - Parameters:
    ///   - pose: Pin the stage to one pose. `nil` (default) resolves it from the environment.
    ///   - content: Your scene.
    public init(pose: DuoPose? = nil, @ViewBuilder content: () -> Content) {
        self.forcedPose = pose
        self.content = content()
    }

    public var body: some View {
        GeometryReader { proxy in
            let resolved = forcedPose ?? DuoStage.inferPose(
                size: proxy.size,
                isCompactWidth: DuoStage.isCompactWidth(sizeClass)
            )
            let fold = DuoStage.fold(for: resolved, in: proxy.size)

            content
                .environment(\.duoPose, resolved)
                .environment(\.duoFold, fold)
                .environment(\.duoDisplay, resolved.display)
                .animation(.duoFold, value: resolved)
        }
    }

    #if os(iOS)
    private var sizeClass: UserInterfaceSizeClass? { horizontalSizeClass }
    private static func isCompactWidth(_ sizeClass: UserInterfaceSizeClass?) -> Bool? {
        sizeClass.map { $0 == .compact }
    }
    #else
    private var sizeClass: Int? { nil }
    private static func isCompactWidth(_ sizeClass: Int?) -> Bool? { nil }
    #endif

    /// Resolve a pose from window size and the horizontal size class.
    ///
    /// **The size class is not optional here, and that is the point.** On real
    /// hardware the closed outer display is 1398×2034 (ratio 0.687) and the
    /// fully open device in Portrait is 1878×2670 (ratio 0.703). Those are
    /// 2% apart: no aspect-ratio threshold can separate a closed phone from an
    /// open one. This is exactly why the HIG says to use size classes —
    /// compact width is the outer display, regular width is the inner one.
    ///
    /// Seated and Standing cannot be derived from geometry at all: they are
    /// partially-open states that only `DeviceHinge.status` reports. Pass them
    /// explicitly via `pose:`, or read the hinge on iOS 27.1+.
    ///
    /// - Parameter isCompactWidth: `nil` on platforms without size classes,
    ///   in which case this falls back to the aspect ratio and can only
    ///   distinguish the two fully-open orientations.
    static func inferPose(size: CGSize, isCompactWidth: Bool?) -> DuoPose {
        guard size.width > 0, size.height > 0 else { return .closed }

        if let isCompactWidth {
            guard !isCompactWidth else { return .closed }
            return size.width >= size.height ? .landscape : .portrait
        }

        // No size class available. A landscape window is unambiguous; anything
        // portrait-shaped is reported closed, because it genuinely cannot be
        // told apart from the outer display by geometry alone.
        return size.width > size.height ? .landscape : .closed
    }

    /// Fold geometry for a pose.
    ///
    /// The division width is a preview default only — Apple publishes no fixed
    /// value. Read `ReservedRegion.frame` at runtime for the real one.
    static func fold(for pose: DuoPose, in size: CGSize) -> DuoFold {
        guard let axis = pose.divisionAxis else {
            // Closed, or fully open: one continuous surface, nothing to avoid.
            return DuoFold(
                axis: .vertical,
                angle: .degrees(pose == .closed ? 0 : 180),
                isDivisionActive: false
            )
        }
        return DuoFold(
            axis: axis,
            angle: .degrees(pose == .seated ? 115 : 80),
            position: 0.5,
            divisionWidth: 20,
            isDivisionActive: true
        )
    }
}

public extension Animation {
    /// DuoCN's fold curve.
    ///
    /// Apple does not publish an unfold curve, so this is our opinion, not a
    /// system value: a high-stiffness spring with near-critical damping, chosen
    /// because a friction-damped hinge settles without overshooting.
    static let duoFold: Animation = .spring(response: 0.52, dampingFraction: 1.0)
}
