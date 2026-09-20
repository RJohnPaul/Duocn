import SwiftUI

/// The spacing scale. Four points, doubling — that's the whole system.
public enum DuoSpacing {
    public static let xs: CGFloat = 4
    public static let sm: CGFloat = 8
    public static let md: CGFloat = 12
    public static let lg: CGFloat = 20
    public static let xl: CGFloat = 32
    public static let xxl: CGFloat = 52
}

/// Corner radii tuned to the Duo's display corners so nested cards stay concentric.
public enum DuoRadius {
    public static let sm: CGFloat = 10
    public static let md: CGFloat = 18
    public static let lg: CGFloat = 28
    public static let panel: CGFloat = 44
    /// Radius for a child inset by `inset` inside a parent of `parent` radius.
    public static func concentric(inside parent: CGFloat, inset: CGFloat) -> CGFloat {
        max(parent - inset, 2)
    }
}

/// Semantic colors.
///
/// The palette is deliberately achromatic: contrast carries the hierarchy, not
/// hue. That keeps components legible on the outer display, which ships a
/// slightly cooler white point than the inner one, and it means an adopting app
/// can introduce its own accent without fighting ours.
public enum DuoColor {
    public static let accent = Color(white: 0.98)
    public static let accentAlt = Color(white: 0.62)
    public static let surface = Color.primary.opacity(0.06)
    public static let surfaceRaised = Color.primary.opacity(0.10)
    public static let hairline = Color.primary.opacity(0.14)
    public static let label = Color.primary
    public static let secondaryLabel = Color.primary.opacity(0.62)
    public static let tertiaryLabel = Color.primary.opacity(0.38)
    public static let positive = Color(white: 0.88)
    public static let critical = Color(white: 0.62)

    /// The signature two-stop wash used by buttons, rings and focus states.
    public static var accentGradient: LinearGradient {
        LinearGradient(colors: [accent, accentAlt], startPoint: .topLeading, endPoint: .bottomTrailing)
    }
}

/// Type ramp. Names describe role, not size, so the ramp can shift per pose.
public enum DuoTextStyle: Sendable {
    case display, title, headline, body, label, mono, caption

    var font: Font {
        switch self {
        case .display: .system(size: 40, weight: .bold, design: .rounded)
        case .title: .system(size: 26, weight: .semibold, design: .rounded)
        case .headline: .system(size: 19, weight: .semibold)
        case .body: .system(size: 16, weight: .regular)
        case .label: .system(size: 15, weight: .medium)
        case .mono: .system(size: 14, weight: .medium, design: .monospaced)
        case .caption: .system(size: 12, weight: .medium)
        }
    }
}

public extension Font {
    /// `Text("Hi").font(.duo(.headline))`
    static func duo(_ style: DuoTextStyle) -> Font { style.font }
}
