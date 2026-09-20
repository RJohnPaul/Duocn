import SwiftUI

/// A depth carousel that uses the hinge angle as a real camera angle.
///
/// Cards tilt away from centre in 3D. When the Duo is partly folded the tilt
/// is biased toward the seam, so the stack appears to fold along the same line
/// as the hardware. It is the one effect that makes an app feel *made* for the
/// device rather than resized onto it.
///
/// ```swift
/// CoverCarousel(items: albums) { album in
///     AsyncImage(url: album.art)
/// }
/// ```
public struct CoverCarousel<Item: Identifiable, Card: View>: View {
    private let items: [Item]
    private let cardWidth: CGFloat
    private let card: (Item) -> Card

    @Environment(\.duoFold) private var fold

    public init(items: [Item], cardWidth: CGFloat = 220, @ViewBuilder card: @escaping (Item) -> Card) {
        self.items = items
        self.cardWidth = cardWidth
        self.card = card
    }

    public var body: some View {
        GeometryReader { outer in
            let centre = outer.frame(in: .global).midX
            ScrollView(.horizontal) {
                HStack(spacing: DuoSpacing.lg) {
                    ForEach(items) { item in
                        GeometryReader { inner in
                            let delta = (inner.frame(in: .global).midX - centre) / cardWidth
                            card(item)
                                .frame(width: cardWidth, height: cardWidth * 1.25)
                                .clipShape(RoundedRectangle(cornerRadius: DuoRadius.lg, style: .continuous))
                                .rotation3DEffect(
                                    .degrees(Double(delta) * tiltStrength),
                                    axis: (x: 0, y: 1, z: 0),
                                    perspective: 0.6
                                )
                                .scaleEffect(1 - min(abs(delta) * 0.12, 0.28))
                                .opacity(1 - min(abs(Double(delta)) * 0.25, 0.55))
                        }
                        .frame(width: cardWidth, height: cardWidth * 1.25)
                    }
                }
                .scrollTargetLayout()
                .padding(.horizontal, (outer.size.width - cardWidth) / 2)
            }
            .scrollTargetBehavior(.viewAligned)
            .scrollIndicators(.hidden)
        }
        .frame(height: cardWidth * 1.25)
    }

    /// Flat hinge = gentle tilt; a folded book angle exaggerates it to match.
    private var tiltStrength: Double {
        let fold = 1 - (fold.angle.degrees / 180)
        return 26 + fold * 18
    }
}
