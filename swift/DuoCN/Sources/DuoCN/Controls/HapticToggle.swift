import SwiftUI

/// A toggle with a knob that leans into the motion, and distinct on/off haptics
/// — a rigid tick on, a soft one off, so users can tell state by feel.
///
/// ```swift
/// HapticToggle("Spatial audio", isOn: $spatial)
/// ```
public struct HapticToggle: View {
    private let title: String
    private let subtitle: String?
    @Binding private var isOn: Bool
    @Environment(\.duoDisplay) private var display

    public init(_ title: String, subtitle: String? = nil, isOn: Binding<Bool>) {
        self.title = title
        self.subtitle = subtitle
        self._isOn = isOn
    }

    public var body: some View {
        Button {
            withAnimation(.spring(response: 0.34, dampingFraction: 0.66)) { isOn.toggle() }
            DuoHaptics.play(isOn ? .toggleOn : .toggleOff, on: display)
        } label: {
            HStack(spacing: DuoSpacing.md) {
                VStack(alignment: .leading, spacing: 2) {
                    Text(title).font(.duo(.label)).foregroundStyle(DuoColor.label)
                    if let subtitle {
                        Text(subtitle).font(.duo(.caption)).foregroundStyle(DuoColor.secondaryLabel)
                    }
                }
                Spacer(minLength: DuoSpacing.md)
                track
            }
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .accessibilityRepresentation {
            Toggle(title, isOn: $isOn)
        }
    }

    private var track: some View {
        Capsule()
            .fill(isOn ? AnyShapeStyle(DuoColor.accentGradient) : AnyShapeStyle(DuoColor.surfaceRaised))
            .frame(width: 52, height: 32)
            .overlay(alignment: isOn ? .trailing : .leading) {
                Circle()
                    .fill(.white)
                    .padding(3)
                    .shadow(color: .black.opacity(0.22), radius: 3, y: 1)
                    // Knob squashes toward travel direction, then rounds out.
                    .scaleEffect(x: 1.14, y: 0.92, anchor: isOn ? .trailing : .leading)
            }
            .frame(width: 52, height: 32)
    }
}
