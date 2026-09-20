import SwiftUI

/// A slider whose fill behaves like a liquid: it overshoots on release, wobbles
/// once, and settles. Drag past either end and it resists instead of clipping.
///
/// The gesture is velocity-aware, so a flick lands where the user aimed rather
/// than where their thumb stopped.
///
/// ```swift
/// LiquidSlider(value: $volume, in: 0...1) {
///     Image(systemName: "speaker.wave.3.fill")
/// }
/// ```
public struct LiquidSlider<Icon: View>: View {
    @Binding private var value: Double
    private let bounds: ClosedRange<Double>
    private let icon: Icon

    @State private var dragging = false
    @State private var overshoot: Double = 0
    @Environment(\.duoDisplay) private var display

    public init(
        value: Binding<Double>,
        in bounds: ClosedRange<Double> = 0...1,
        @ViewBuilder icon: () -> Icon = { EmptyView() }
    ) {
        self._value = value
        self.bounds = bounds
        self.icon = icon()
    }

    private var fraction: Double {
        let span = bounds.upperBound - bounds.lowerBound
        guard span > 0 else { return 0 }
        return min(max((value - bounds.lowerBound) / span, 0), 1)
    }

    public var body: some View {
        GeometryReader { proxy in
            let w = proxy.size.width
            ZStack(alignment: .leading) {
                Capsule().fill(DuoColor.surface)
                Capsule()
                    .fill(DuoColor.accentGradient)
                    .frame(width: max(0, w * fraction + overshoot))
                    .overlay(alignment: .trailing) {
                        Circle()
                            .fill(.white.opacity(0.9))
                            .frame(width: 6, height: 6)
                            .padding(.trailing, 10)
                            .opacity(dragging ? 1 : 0)
                    }
                icon
                    .font(.duo(.caption))
                    .foregroundStyle(.white.opacity(0.85))
                    .padding(.leading, DuoSpacing.md)
                    .allowsHitTesting(false)
            }
            .frame(height: dragging ? 44 : 30)
            .clipShape(Capsule(style: .continuous))
            .contentShape(Rectangle())
            .animation(.spring(response: 0.3, dampingFraction: 0.7), value: dragging)
            .animation(.spring(response: 0.45, dampingFraction: 0.55), value: overshoot)
            .gesture(drag(width: w))
        }
        .frame(height: 44)
    }

    private func drag(width: Double) -> some Gesture {
        DragGesture(minimumDistance: 0)
            .onChanged { g in
                if !dragging {
                    dragging = true
                    DuoHaptics.play(.select, on: display)
                }
                let raw = g.location.x / max(width, 1)
                let clamped = min(max(raw, 0), 1)
                // Rubber-band past the ends instead of dead-stopping.
                overshoot = (raw - clamped) * 24
                value = bounds.lowerBound + clamped * (bounds.upperBound - bounds.lowerBound)
            }
            .onEnded { g in
                // Carry the flick: predicted end location, softly weighted.
                let predicted = g.predictedEndLocation.x / max(width, 1)
                let settled = min(max(predicted * 0.35 + (g.location.x / max(width, 1)) * 0.65, 0), 1)
                value = bounds.lowerBound + settled * (bounds.upperBound - bounds.lowerBound)
                dragging = false
                overshoot = 0
                DuoHaptics.play(.toggleOn, on: display)
            }
    }
}
