import SwiftUI

/// Content that only exists when there is a second panel to put it on.
///
/// The Duo's win is that controls no longer have to cover the thing they
/// control. Wrap your inspector, transport bar, keyboard or tool palette in a
/// `CompanionPane` and it moves to the secondary panel when open, and
/// gracefully becomes a bottom bar when folded.
///
/// ```swift
/// ZStack { Canvas(...) }
///     .companionPane(edge: .trailing) { BrushInspector() }
/// ```
public struct CompanionPane<Base: View, Pane: View>: View {
    private let base: Base
    private let pane: Pane
    private let edge: HorizontalEdge
    private let width: CGFloat

    @Environment(\.duoPose) private var pose
    @Environment(\.duoFold) private var fold

    public init(edge: HorizontalEdge = .trailing, width: CGFloat = 320, base: Base, @ViewBuilder pane: () -> Pane) {
        self.edge = edge
        self.width = width
        self.base = base
        self.pane = pane()
    }

    public var body: some View {
        if pose == .landscape {
            HStack(spacing: fold.divisionWidth) {
                if edge == .leading { paneView }
                base.frame(maxWidth: .infinity)
                if edge == .trailing { paneView }
            }
            .transition(.move(edge: edge == .leading ? .leading : .trailing))
        } else if pose == .portrait || pose == .seated {
            VStack(spacing: fold.divisionWidth) {
                base.frame(maxHeight: .infinity)
                paneView.frame(maxWidth: .infinity)
            }
        } else {
            base.safeAreaInset(edge: .bottom, spacing: 0) {
                pane
                    .padding(DuoSpacing.md)
                    .duoGlass(.floating, radius: DuoRadius.lg)
                    .padding(.horizontal, DuoSpacing.md)
            }
        }
    }

    private var paneView: some View {
        pane
            .frame(width: width)
            .padding(DuoSpacing.lg)
            .duoGlass(.raised, radius: DuoRadius.panel)
    }
}

public extension View {
    /// Attach a companion pane that relocates itself per pose.
    func companionPane<Pane: View>(
        edge: HorizontalEdge = .trailing,
        width: CGFloat = 320,
        @ViewBuilder content: () -> Pane
    ) -> some View {
        CompanionPane(edge: edge, width: width, base: self, pane: content)
    }
}
