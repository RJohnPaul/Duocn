import SwiftUI

/// A progress ring with a gradient that rotates with the value, so the
/// brightest point is always at the head of the arc.
///
/// Supports determinate and indeterminate states from the same view — pass
/// `nil` for progress and it spins.
///
/// ```swift
/// ProgressRing(progress: 0.68, label: "68%")
/// ProgressRing(progress: nil)          // indeterminate
/// ```
public struct ProgressRing: View {
    private let progress: Double?
    private let label: String?
    private let lineWidth: CGFloat

    @State private var spin: Double = 0
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    public init(progress: Double?, label: String? = nil, lineWidth: CGFloat = 10) {
        self.progress = progress.map { min(max($0, 0), 1) }
        self.label = label
        self.lineWidth = lineWidth
    }

    public var body: some View {
        ZStack {
            Circle()
                .stroke(DuoColor.surface, lineWidth: lineWidth)
            Circle()
                .trim(from: 0, to: progress ?? 0.22)
                .stroke(
                    AngularGradient(
                        colors: [DuoColor.accentAlt, DuoColor.accent, DuoColor.accentAlt],
                        center: .center
                    ),
                    style: StrokeStyle(lineWidth: lineWidth, lineCap: .round)
                )
                .rotationEffect(.degrees(-90 + (progress == nil ? spin : 0)))
                .animation(.spring(response: 0.5, dampingFraction: 0.85), value: progress)
            if let label {
                Text(label)
                    .font(.duo(.headline))
                    .contentTransition(.numericText())
            }
        }
        .onAppear {
            guard progress == nil, !reduceMotion else { return }
            withAnimation(.linear(duration: 0.9).repeatForever(autoreverses: false)) { spin = 360 }
        }
        .accessibilityElement()
        .accessibilityLabel(label ?? "Progress")
        .accessibilityValue(progress.map { "\(Int($0 * 100)) percent" } ?? "In progress")
    }
}
