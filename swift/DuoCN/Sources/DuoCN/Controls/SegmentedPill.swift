import SwiftUI

/// Segmented control with a glass pill that slides between options using a
/// `matchedGeometryEffect`, so the selection is one continuous object instead
/// of a crossfade.
///
/// ```swift
/// SegmentedPill(selection: $range, options: Range.allCases) { $0.label }
/// ```
public struct SegmentedPill<Option: Hashable & Identifiable>: View {
    @Binding private var selection: Option
    private let options: [Option]
    private let label: (Option) -> String

    @Namespace private var pill
    @Environment(\.duoDisplay) private var display

    public init(selection: Binding<Option>, options: [Option], label: @escaping (Option) -> String) {
        self._selection = selection
        self.options = options
        self.label = label
    }

    public var body: some View {
        HStack(spacing: 2) {
            ForEach(options) { option in
                let active = option == selection
                Button {
                    guard !active else { return }
                    withAnimation(.spring(response: 0.36, dampingFraction: 0.78)) { selection = option }
                    DuoHaptics.play(.select, on: display)
                } label: {
                    Text(label(option))
                        .font(.duo(.label))
                        .foregroundStyle(active ? DuoColor.label : DuoColor.secondaryLabel)
                        .padding(.vertical, DuoSpacing.sm)
                        .frame(maxWidth: .infinity)
                        .background {
                            if active {
                                Capsule(style: .continuous)
                                    .fill(.regularMaterial)
                                    .overlay(Capsule().strokeBorder(.white.opacity(0.2), lineWidth: 1))
                                    .matchedGeometryEffect(id: "pill", in: pill)
                            }
                        }
                        .contentShape(Capsule())
                }
                .buttonStyle(.plain)
            }
        }
        .padding(3)
        .background(DuoColor.surface, in: Capsule(style: .continuous))
    }
}
