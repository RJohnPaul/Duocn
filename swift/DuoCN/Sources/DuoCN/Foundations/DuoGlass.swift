import SwiftUI

/// The material layer DuoCN draws every floating surface on.
///
/// It is a blur, a hairline, and a single specular edge that tracks the hinge
/// angle — so when the Duo unfolds, light moves across your cards the way it
/// moves across the chassis. Cheap: one material, one gradient, no shadows
/// stacked on shadows.
public struct DuoGlass: ViewModifier {
    public enum Depth: Sendable {
        /// Sits on the wallpaper. Controls, docks, toasts.
        case floating
        /// Sits on content. Cards, list rows, sheets.
        case raised
        /// Recessed well. Inputs, track grooves.
        case inset
    }

    private let depth: Depth
    private let radius: CGFloat
    @Environment(\.duoFold) private var fold
    @Environment(\.colorScheme) private var scheme

    public init(depth: Depth = .raised, radius: CGFloat = DuoRadius.lg) {
        self.depth = depth
        self.radius = radius
    }

    public func body(content: Content) -> some View {
        content
            .background(material, in: shape)
            .overlay(specular)
            .overlay(shape.strokeBorder(DuoColor.hairline, lineWidth: 0.5))
            .shadow(color: .black.opacity(shadowOpacity), radius: shadowRadius, y: shadowRadius / 2)
    }

    private var shape: RoundedRectangle {
        RoundedRectangle(cornerRadius: radius, style: .continuous)
    }

    private var material: Material {
        switch depth {
        case .floating: .ultraThinMaterial
        case .raised: .regularMaterial
        case .inset: .thinMaterial
        }
    }

    /// Specular highlight, rotated by the hinge angle. Flat = light from top.
    private var specular: some View {
        let lean = fold.angle.degrees / 180
        return shape
            .strokeBorder(
                LinearGradient(
                    colors: [.white.opacity(scheme == .dark ? 0.34 : 0.85), .white.opacity(0)],
                    startPoint: UnitPoint(x: 0.5 - 0.5 * lean, y: 0),
                    endPoint: UnitPoint(x: 0.5 + 0.5 * lean, y: 0.7)
                ),
                lineWidth: 1
            )
            .blendMode(.plusLighter)
            .allowsHitTesting(false)
    }

    private var shadowOpacity: Double {
        switch depth {
        case .floating: 0.28
        case .raised: 0.16
        case .inset: 0
        }
    }

    private var shadowRadius: CGFloat {
        switch depth {
        case .floating: 24
        case .raised: 12
        case .inset: 0
        }
    }
}

public extension View {
    /// Apply the DuoCN glass material.
    func duoGlass(_ depth: DuoGlass.Depth = .raised, radius: CGFloat = DuoRadius.lg) -> some View {
        modifier(DuoGlass(depth: depth, radius: radius))
    }
}

/// A padded glass container. The workhorse card.
///
/// ```swift
/// GlassCard {
///     Text("Battery").font(.duo(.label))
///     ProgressRing(progress: 0.82)
/// }
/// ```
public struct GlassCard<Content: View>: View {
    private let depth: DuoGlass.Depth
    private let padding: CGFloat
    private let content: Content

    public init(
        depth: DuoGlass.Depth = .raised,
        padding: CGFloat = DuoSpacing.lg,
        @ViewBuilder content: () -> Content
    ) {
        self.depth = depth
        self.padding = padding
        self.content = content()
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: DuoSpacing.md) { content }
            .padding(padding)
            .frame(maxWidth: .infinity, alignment: .leading)
            .duoGlass(depth, radius: DuoRadius.lg)
    }
}
