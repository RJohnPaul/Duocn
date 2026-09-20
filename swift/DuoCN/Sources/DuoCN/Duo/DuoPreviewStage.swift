import SwiftUI

/// Show the subject a live preview on the outward-facing display.
///
/// This implements the pattern behind Apple's **Duo Preview**: while you shoot
/// with the rear cameras, the outer display faces the person you are
/// photographing, so they can see their own framing. It is not an invention of
/// this library — it is a shipping iPhone Duo camera feature, and this is a
/// SwiftUI scaffold for building your own version of it.
///
/// ```swift
/// DuoPreviewStage {
///     CameraPreview(session: session)          // what you see
///         .overlay(alignment: .bottom) { ShutterBar() }
/// } subject: {
///     CameraPreview(session: session)          // what they see
///         .overlay(CountdownRing(seconds: countdown))
/// }
/// ```
public struct DuoPreviewStage<Operator: View, Subject: View>: View {
    private let operatorView: Operator
    private let subjectView: Subject

    @Environment(\.duoPose) private var pose

    public init(@ViewBuilder operatorView: () -> Operator, @ViewBuilder subject: () -> Subject) {
        self.operatorView = operatorView()
        self.subjectView = subject()
    }

    /// True when a display is actually facing away from the operator.
    ///
    /// Closed, both displays face the same way as the person holding it, so
    /// there is no subject-facing surface and the preview is unavailable.
    private var subjectDisplayAvailable: Bool { pose.isOpen }

    public var body: some View {
        operatorView
            .environment(\.duoDisplay, .inner)
            .overlay(alignment: .topTrailing) {
                if subjectDisplayAvailable {
                    subjectView
                        .environment(\.duoDisplay, .outer)
                        .frame(width: 132, height: 176)
                        .clipShape(RoundedRectangle(cornerRadius: DuoRadius.md, style: .continuous))
                        // Mirrored, because the panel faces the subject.
                        .rotation3DEffect(.degrees(180), axis: (x: 0, y: 1, z: 0))
                        .overlay(alignment: .bottom) {
                            Label("Subject view", systemImage: "person.crop.rectangle")
                                .font(.duo(.caption))
                                .padding(.horizontal, DuoSpacing.sm)
                                .padding(.vertical, 4)
                                .background(.ultraThinMaterial, in: Capsule())
                                .padding(DuoSpacing.sm)
                        }
                        .padding(DuoSpacing.lg)
                        .transition(.scale(scale: 0.85).combined(with: .opacity))
                }
            }
            .animation(.duoFold, value: pose)
    }
}
