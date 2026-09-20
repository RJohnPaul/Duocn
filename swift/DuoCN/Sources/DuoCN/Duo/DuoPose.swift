import SwiftUI

/// The five ways Apple describes holding an iPhone Duo.
///
/// This is the *design* vocabulary — the nouns Apple uses on apple.com and in
/// the HIG. It is what you name a preview, a screenshot or a Playground tab.
///
/// It is deliberately **not** what you branch on at runtime. The runtime model
/// is ``DuoHingeStatus`` (three values, from `DeviceHinge.Status`) crossed with
/// the horizontal size class. Five poses collapse onto three hinge states —
/// Portrait and Landscape are both fully open and differ only by orientation.
public enum DuoPose: String, CaseIterable, Sendable, Hashable, Identifiable {
    /// Outer display only. The system moves controls to the side.
    case closed
    /// Open, hinge horizontal. Wider keyboard; pin content to the top half.
    case portrait
    /// Open, hinge vertical. Split View multitasking.
    case landscape
    /// Set down at a viewing angle, controls along the bottom.
    case seated
    /// Standing on its edges — StandBy and outer-display viewing.
    case standing

    public var id: String { rawValue }

    /// The hinge state this pose implies.
    public var hingeStatus: DuoHingeStatus {
        switch self {
        case .closed: .closed
        case .portrait, .landscape: .fullyOpen
        case .seated, .standing: .partiallyOpen
        }
    }

    /// Whether the device is open at all — the inner display is in use.
    ///
    /// Prefer the horizontal size class for layout decisions; this is for the
    /// cases where you genuinely need to know the hardware is unfolded.
    public var isOpen: Bool { hingeStatus != .closed }

    /// Which display the person is looking at.
    public var display: DuoDisplay {
        switch self {
        case .closed, .standing: .outer
        case .portrait, .landscape, .seated: .inner
        }
    }

    /// The axis the fold runs along, or `nil` when there is no active fold.
    ///
    /// Note that a **fully open** device has no active division region — the
    /// inner display is one continuous canvas. Only a partially open device
    /// splits into separate usable regions.
    public var divisionAxis: Axis? {
        switch self {
        case .seated: .horizontal
        case .standing: .vertical
        case .closed, .portrait, .landscape: nil
        }
    }

    public var title: String {
        rawValue.prefix(1).uppercased() + rawValue.dropFirst()
    }

    public var symbolName: String {
        switch self {
        case .closed: "iphone"
        case .portrait: "rectangle.portrait.split.2x1"
        case .landscape: "rectangle.split.2x1"
        case .seated: "laptopcomputer"
        case .standing: "rectangle.portrait.on.rectangle.portrait.angled"
        }
    }
}

/// The runtime hinge state. Mirrors `DeviceHinge.Status` (iOS 27.1+), so code
/// written against this maps one-to-one onto the system type when you adopt it.
public enum DuoHingeStatus: String, CaseIterable, Sendable, Hashable {
    case closed
    case partiallyOpen
    case fullyOpen
}

/// Which physical display content is on. The Duo has exactly two.
///
/// The inner panel is a single continuous 7.6-inch display, not two screens —
/// modelling its halves as separate screens is the mistake that leads to
/// inventing seam-crossing bugs that do not exist.
public enum DuoDisplay: String, Sendable, Hashable {
    case inner
    case outer
}

/// Geometry of the fold.
///
/// This mirrors what `ReservedRegion(kind: .division)` gives you at runtime.
/// Adopt the system API when you target iOS 27.1; this type exists so the same
/// layout code can be previewed and tested without the hardware.
public struct DuoFold: Equatable, Sendable {
    /// Axis the fold runs along.
    public var axis: Axis
    /// Angle between the two halves. 180° is flat.
    public var angle: Angle
    /// Where the fold sits, as a fraction of the stage along `axis`.
    public var position: CGFloat
    /// Width of the region content should avoid, in points.
    ///
    /// Apple publishes no fixed value for this — read it from
    /// `ReservedRegion.frame` at runtime. The default here is for previews only.
    public var divisionWidth: CGFloat
    /// Whether the division region is currently active.
    ///
    /// False when the device is flat or closed. `ReservedRegion` returns
    /// regions whether or not they are active, so you must check this.
    public var isDivisionActive: Bool

    public init(
        axis: Axis = .vertical,
        angle: Angle = .degrees(180),
        position: CGFloat = 0.5,
        divisionWidth: CGFloat = 0,
        isDivisionActive: Bool = false
    ) {
        self.axis = axis
        self.angle = angle
        self.position = position
        self.divisionWidth = divisionWidth
        self.isDivisionActive = isDivisionActive
    }

    /// No fold — a closed device, or any non-folding hardware.
    public static let none = DuoFold()

    /// The region to keep interactive elements out of.
    ///
    /// Scrollable content may cross this freely; it is tap targets, controls
    /// and anything a person needs to hit that must stay clear.
    public func divisionRect(in size: CGSize) -> CGRect {
        guard isDivisionActive, divisionWidth > 0 else { return .null }
        switch axis {
        case .vertical:
            return CGRect(
                x: size.width * position - divisionWidth / 2,
                y: 0,
                width: divisionWidth,
                height: size.height
            )
        case .horizontal:
            return CGRect(
                x: 0,
                y: size.height * position - divisionWidth / 2,
                width: size.width,
                height: divisionWidth
            )
        }
    }
}

private struct DuoPoseKey: EnvironmentKey { static let defaultValue: DuoPose = .closed }
private struct DuoFoldKey: EnvironmentKey { static let defaultValue: DuoFold = .none }
private struct DuoDisplayKey: EnvironmentKey { static let defaultValue: DuoDisplay = .outer }

public extension EnvironmentValues {
    /// The current pose. Use it for presentation; prefer the size class for layout.
    var duoPose: DuoPose {
        get { self[DuoPoseKey.self] }
        set { self[DuoPoseKey.self] = newValue }
    }
    /// Fold geometry for the current stage.
    var duoFold: DuoFold {
        get { self[DuoFoldKey.self] }
        set { self[DuoFoldKey.self] = newValue }
    }
    /// Which display this subtree is rendering on.
    var duoDisplay: DuoDisplay {
        get { self[DuoDisplayKey.self] }
        set { self[DuoDisplayKey.self] = newValue }
    }
}
