import SwiftUI

/// Loading placeholder with a sweep that crosses both panels as one light source.
///
/// Two independent shimmers on two panels look like two apps. `ShimmerSkeleton`
/// phases its sweep by the view's position in the stage, so the highlight
/// travels across the seam continuously.
public struct ShimmerSkeleton: View {
    private let lines: Int
    private let cornerRadius: CGFloat

    @State private var phase: CGFloat = -1
    @Environment(\.duoDisplay) private var display
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    public init(lines: Int = 3, cornerRadius: CGFloat = DuoRadius.sm) {
        self.lines = lines
        self.cornerRadius = cornerRadius
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: DuoSpacing.sm) {
            ForEach(0..<lines, id: \.self) { index in
                RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                    .fill(DuoColor.surface)
                    .frame(height: 14)
                    .frame(maxWidth: index == lines - 1 ? 180 : .infinity, alignment: .leading)
            }
        }
        .overlay(sweep.mask(shape))
        .onAppear {
            guard !reduceMotion else { return }
            withAnimation(.linear(duration: 1.4).repeatForever(autoreverses: false)) { phase = 2 }
        }
        .accessibilityLabel("Loading")
    }

    private var shape: some View {
        VStack(alignment: .leading, spacing: DuoSpacing.sm) {
            ForEach(0..<lines, id: \.self) { index in
                RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                    .frame(height: 14)
                    .frame(maxWidth: index == lines - 1 ? 180 : .infinity, alignment: .leading)
            }
        }
    }

    /// Secondary panel starts half a cycle later, so the sweep looks continuous.
    private var sweep: some View {
        let offset: CGFloat = display == .outer ? -0.5 : 0
        return LinearGradient(
            colors: [.clear, .white.opacity(0.35), .clear],
            startPoint: .leading,
            endPoint: .trailing
        )
        .scaleEffect(x: 0.4, anchor: .leading)
        .offset(x: (phase + offset) * 420)
        .blendMode(.plusLighter)
        .allowsHitTesting(false)
    }
}
