import SwiftUI

/// A floating dock of actions with magnification on hover or drag-over.
///
/// Items grow with distance falloff, so the row reads as one elastic strip.
/// Sized for thumbs when closed and for a pointer when the Duo is docked.
///
/// ```swift
/// FloatingDock(items: [
///     .init(systemImage: "wand.and.stars", title: "Enhance") { enhance() },
///     .init(systemImage: "crop", title: "Crop") { crop() }
/// ])
/// ```
public struct FloatingDock: View {
    public struct Item: Identifiable {
        public let id = UUID()
        public let systemImage: String
        public let title: String
        public let action: () -> Void

        public init(systemImage: String, title: String, action: @escaping () -> Void) {
            self.systemImage = systemImage
            self.title = title
            self.action = action
        }
    }

    private let items: [Item]
    @State private var focused: UUID?
    @Environment(\.duoDisplay) private var display

    public init(items: [Item]) { self.items = items }

    public var body: some View {
        HStack(spacing: DuoSpacing.sm) {
            ForEach(Array(items.enumerated()), id: \.element.id) { index, item in
                Button {
                    item.action()
                    DuoHaptics.play(.select, on: display)
                } label: {
                    Image(systemName: item.systemImage)
                        .font(.system(size: 20, weight: .medium))
                        .frame(width: 46, height: 46)
                        .background(DuoColor.surface, in: Circle())
                        .scaleEffect(scale(for: index))
                }
                .buttonStyle(.plain)
                .accessibilityLabel(item.title)
                .onHover { inside in
                    withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                        focused = inside ? item.id : (focused == item.id ? nil : focused)
                    }
                }
            }
        }
        .padding(DuoSpacing.sm)
        .duoGlass(.floating, radius: DuoRadius.panel)
    }

    /// Distance falloff: neighbours of the focused item grow a little too.
    private func scale(for index: Int) -> CGFloat {
        guard let focused, let focusIndex = items.firstIndex(where: { $0.id == focused }) else { return 1 }
        let distance = abs(index - focusIndex)
        switch distance {
        case 0: return 1.32
        case 1: return 1.14
        case 2: return 1.05
        default: return 1
        }
    }
}
