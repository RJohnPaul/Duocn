import SwiftUI

/// A detented sheet that becomes a side panel when the Duo opens.
///
/// A bottom sheet covering half the screen is a compromise you make on a phone
/// with one display. On a Duo you don't have to: the same call presents a sheet
/// when folded and a resident panel on the second screen when open.
///
/// ```swift
/// ContentView()
///     .duoSheet(isPresented: $showsFilters, detents: [0.32, 0.9]) {
///         FiltersView()
///     }
/// ```
public struct DuoSheet<SheetContent: View>: ViewModifier {
    @Binding private var isPresented: Bool
    private let detents: [CGFloat]
    private let sheetContent: SheetContent

    @Environment(\.duoPose) private var pose

    public init(isPresented: Binding<Bool>, detents: [CGFloat], @ViewBuilder content: () -> SheetContent) {
        self._isPresented = isPresented
        self.detents = detents.isEmpty ? [0.5] : detents
        self.sheetContent = content()
    }

    public func body(content: Content) -> some View {
        if pose.isOpen {
            // Second panel is free real estate — no need to cover anything.
            content.companionPane {
                if isPresented {
                    VStack(alignment: .leading, spacing: DuoSpacing.md) {
                        HStack {
                            Spacer()
                            Button { isPresented = false } label: {
                                Image(systemName: "xmark")
                            }
                            .buttonStyle(.duo(.plain, size: .compact))
                        }
                        sheetContent
                        Spacer(minLength: 0)
                    }
                    .transition(.move(edge: .trailing).combined(with: .opacity))
                }
            }
            .animation(.duoFold, value: isPresented)
        } else {
            content.sheet(isPresented: $isPresented) {
                sheetContent
                    .presentationDetents(Set(detents.map { PresentationDetent.fraction($0) }))
                    .presentationDragIndicator(.visible)
                    .presentationBackground(.regularMaterial)
                    .presentationCornerRadius(DuoRadius.panel)
            }
        }
    }
}

public extension View {
    /// Present content as a sheet when folded, as a panel when open.
    func duoSheet<C: View>(
        isPresented: Binding<Bool>,
        detents: [CGFloat] = [0.4, 0.95],
        @ViewBuilder content: () -> C
    ) -> some View {
        modifier(DuoSheet(isPresented: isPresented, detents: detents, content: content))
    }
}
