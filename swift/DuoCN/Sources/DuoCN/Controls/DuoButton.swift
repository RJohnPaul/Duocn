import SwiftUI

/// The button style for the whole kit.
///
/// Four roles, one shape language, and a press animation that scales *and*
/// dims the specular edge — the thing that makes a glass button feel like
/// glass instead of a rounded rectangle.
///
/// ```swift
/// Button("Continue") { send() }
///     .buttonStyle(.duo(.primary))
/// ```
public struct DuoButtonStyle: ButtonStyle {
    public enum Role: Sendable {
        /// Accent-filled. One per screen.
        case primary
        /// Glass. The default for everything else.
        case secondary
        /// Text only. Inline and destructive-adjacent actions.
        case plain
        /// Red fill. Confirmations that delete.
        case destructive
    }

    public enum Size: Sendable {
        case compact, regular, large

        var height: CGFloat {
            switch self {
            case .compact: 34
            case .regular: 46
            case .large: 56
            }
        }
        var horizontalPadding: CGFloat {
            switch self {
            case .compact: DuoSpacing.md
            case .regular: DuoSpacing.lg
            case .large: DuoSpacing.xl
            }
        }
    }

    private let role: Role
    private let size: Size
    @Environment(\.isEnabled) private var isEnabled
    @Environment(\.duoDisplay) private var display

    public init(role: Role = .secondary, size: Size = .regular) {
        self.role = role
        self.size = size
    }

    public func makeBody(configuration: Configuration) -> some View {
        let pressed = configuration.isPressed
        return configuration.label
            .font(.duo(.label))
            .foregroundStyle(foreground)
            .padding(.horizontal, size.horizontalPadding)
            .frame(minHeight: size.height)
            .background(background(pressed: pressed))
            .clipShape(Capsule(style: .continuous))
            .overlay(
                Capsule(style: .continuous)
                    .strokeBorder(.white.opacity(pressed ? 0.06 : 0.22), lineWidth: 1)
                    .blendMode(.plusLighter)
            )
            .opacity(isEnabled ? 1 : 0.4)
            .scaleEffect(pressed ? 0.96 : 1)
            .animation(.spring(response: 0.26, dampingFraction: 0.7), value: pressed)
            .onChange(of: pressed) { _, isDown in
                if isDown { DuoHaptics.play(.select, on: display) }
            }
    }

    @ViewBuilder
    private func background(pressed: Bool) -> some View {
        switch role {
        case .primary:
            DuoColor.accentGradient.brightness(pressed ? -0.06 : 0)
        case .secondary:
            Color.clear.background(.regularMaterial)
        case .plain:
            Color.primary.opacity(pressed ? 0.08 : 0)
        case .destructive:
            DuoColor.critical.brightness(pressed ? -0.06 : 0)
        }
    }

    private var foreground: Color {
        switch role {
        case .primary, .destructive: .white
        case .secondary: DuoColor.label
        case .plain: DuoColor.accent
        }
    }
}

public extension ButtonStyle where Self == DuoButtonStyle {
    /// `.buttonStyle(.duo(.primary))`
    static func duo(_ role: DuoButtonStyle.Role = .secondary, size: DuoButtonStyle.Size = .regular) -> DuoButtonStyle {
        DuoButtonStyle(role: role, size: size)
    }
}
