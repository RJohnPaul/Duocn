import SwiftUI

/// Overlapping avatars with an overflow count, and a live ring on whoever is
/// speaking. Built for the Duo's split call layout, where the roster sits on
/// one panel and the stage on the other.
///
/// ```swift
/// AvatarStack(people: room.participants, speakingID: room.activeSpeaker)
/// ```
public struct AvatarStack<Person: Identifiable>: View {
    private let people: [Person]
    private let visible: Int
    private let speakingID: Person.ID?
    private let size: CGFloat
    private let image: (Person) -> Image?
    private let initials: (Person) -> String

    public init(
        people: [Person],
        visible: Int = 4,
        speakingID: Person.ID? = nil,
        size: CGFloat = 38,
        image: @escaping (Person) -> Image? = { _ in nil },
        initials: @escaping (Person) -> String
    ) {
        self.people = people
        self.visible = max(visible, 1)
        self.speakingID = speakingID
        self.size = size
        self.image = image
        self.initials = initials
    }

    public var body: some View {
        HStack(spacing: -size * 0.32) {
            ForEach(people.prefix(visible)) { person in
                avatar(person)
                    .zIndex(person.id == speakingID ? 1 : 0)
            }
            if people.count > visible {
                Text("+\(people.count - visible)")
                    .font(.duo(.caption))
                    .foregroundStyle(DuoColor.secondaryLabel)
                    .frame(width: size, height: size)
                    .background(DuoColor.surfaceRaised, in: Circle())
                    .overlay(Circle().strokeBorder(DuoColor.hairline, lineWidth: 1))
            }
        }
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("\(people.count) participants")
    }

    @ViewBuilder
    private func avatar(_ person: Person) -> some View {
        let speaking = person.id == speakingID
        Group {
            if let image = image(person) {
                image.resizable().scaledToFill()
            } else {
                Text(initials(person))
                    .font(.system(size: size * 0.38, weight: .semibold))
                    .foregroundStyle(.white)
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .background(DuoColor.accentGradient)
            }
        }
        .frame(width: size, height: size)
        .clipShape(Circle())
        .overlay(
            Circle().strokeBorder(speaking ? DuoColor.positive : .black.opacity(0.35), lineWidth: speaking ? 2.5 : 2)
        )
        .scaleEffect(speaking ? 1.1 : 1)
        .animation(.spring(response: 0.3, dampingFraction: 0.6), value: speaking)
    }
}
