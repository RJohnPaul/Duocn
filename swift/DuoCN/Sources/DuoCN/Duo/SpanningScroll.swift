import SwiftUI

/// A scroll view that knows a seam runs through it.
///
/// Rows are snapped so none is ever bisected by the hinge, and the seam gets a
/// real gutter rather than a hidden row. Falls back to a plain `ScrollView`
/// when folded, with no layout change to your content.
///
/// ```swift
/// SpanningScroll(rowHeight: 76) {
///     ForEach(tracks) { TrackRow(track: $0) }
/// }
/// ```
public struct SpanningScroll<Content: View>: View {
    private let rowHeight: CGFloat
    private let content: Content

    @Environment(\.duoPose) private var pose
    @Environment(\.duoFold) private var fold

    public init(rowHeight: CGFloat, @ViewBuilder content: () -> Content) {
        self.rowHeight = rowHeight
        self.content = content()
    }

    public var body: some View {
        GeometryReader { proxy in
            ScrollView {
                LazyVStack(spacing: 0) { content }
                    .scrollTargetLayout()
                    .padding(.top, divisionPadding(in: proxy.size))
            }
            // Snap so a row edge, never a row middle, meets the seam.
            .scrollTargetBehavior(.viewAligned)
            .safeAreaPadding(.vertical, DuoSpacing.sm)
        }
    }

    /// Offset that puts a row boundary on the fold instead of through a row.
    ///
    /// Only meaningful while the division region is active: a fully open Duo is
    /// one continuous canvas, and a closed one has no fold. Scrollable content
    /// may cross the fold — this only stops a row being visually bisected.
    private func divisionPadding(in size: CGSize) -> CGFloat {
        guard fold.isDivisionActive, fold.axis == .horizontal, rowHeight > 0 else { return 0 }
        let foldY = size.height * fold.position
        let remainder = foldY.truncatingRemainder(dividingBy: rowHeight)
        return rowHeight - remainder
    }
}
