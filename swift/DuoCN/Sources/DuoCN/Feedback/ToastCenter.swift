import SwiftUI

/// App-wide transient messages, queued so two never collide.
///
/// On an open Duo toasts appear on the panel the action happened on, which is
/// the whole point — a confirmation on the far screen is a confirmation nobody
/// reads.
///
/// ```swift
/// DuoStage { RootView() }
///     .toastCenter()
///
/// // anywhere:
/// ToastCenter.shared.post(.success("Saved to Library"))
/// ```
@MainActor
@Observable
public final class ToastCenter {
    public static let shared = ToastCenter()

    public struct Toast: Identifiable, Equatable {
        public let id = UUID()
        public var message: String
        public var systemImage: String
        public var tint: Color
        public var duration: Duration

        public static func success(_ message: String) -> Toast {
            Toast(message: message, systemImage: "checkmark.circle.fill", tint: DuoColor.positive, duration: .seconds(2))
        }
        public static func error(_ message: String) -> Toast {
            Toast(message: message, systemImage: "exclamationmark.triangle.fill", tint: DuoColor.critical, duration: .seconds(3))
        }
        public static func info(_ message: String, systemImage: String = "info.circle.fill") -> Toast {
            Toast(message: message, systemImage: systemImage, tint: DuoColor.accent, duration: .seconds(2))
        }

        public static func == (lhs: Toast, rhs: Toast) -> Bool { lhs.id == rhs.id }
    }

    public private(set) var current: Toast?
    private var queue: [Toast] = []
    private var draining = false

    public func post(_ toast: Toast, on display: DuoDisplay = .inner) {
        queue.append(toast)
        DuoHaptics.play(toast.tint == DuoColor.critical ? .failure : .success, on: display)
        guard !draining else { return }
        draining = true
        Task { await drain() }
    }

    private func drain() async {
        while !queue.isEmpty {
            let next = queue.removeFirst()
            withAnimation(.spring(response: 0.4, dampingFraction: 0.78)) { current = next }
            try? await Task.sleep(for: next.duration)
            withAnimation(.easeIn(duration: 0.2)) { current = nil }
            try? await Task.sleep(for: .milliseconds(180))
        }
        draining = false
    }
}

public extension View {
    /// Install the toast presenter. Apply once, at the root.
    func toastCenter(alignment: Alignment = .top) -> some View {
        overlay(alignment: alignment) {
            if let toast = ToastCenter.shared.current {
                HStack(spacing: DuoSpacing.sm) {
                    Image(systemName: toast.systemImage).foregroundStyle(toast.tint)
                    Text(toast.message).font(.duo(.label))
                }
                .padding(.horizontal, DuoSpacing.lg)
                .padding(.vertical, DuoSpacing.md)
                .duoGlass(.floating, radius: DuoRadius.panel)
                .padding(DuoSpacing.lg)
                .transition(.move(edge: alignment == .bottom ? .bottom : .top).combined(with: .opacity))
                .accessibilityAddTraits(.isStaticText)
            }
        }
    }
}
