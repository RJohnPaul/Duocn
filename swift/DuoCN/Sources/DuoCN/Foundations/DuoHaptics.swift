import SwiftUI
#if canImport(UIKit) && !os(watchOS)
import UIKit
#endif

/// One call site for feedback, so taps feel the same everywhere in your app.
///
/// On a Duo the two panels have separate haptic engines. `DuoHaptics` fires on
/// the panel that owns the touch, which is why you pass the display through.
@MainActor
public enum DuoHaptics {
    public enum Event: Sendable {
        case select, toggleOn, toggleOff, success, warning, failure, hingeDetent
    }

    /// Fire feedback for `event`. No-op where haptics are unavailable.
    public static func play(_ event: Event, on display: DuoDisplay = .inner) {
        #if canImport(UIKit) && !os(watchOS) && !os(tvOS)
        switch event {
        case .select:
            UISelectionFeedbackGenerator().selectionChanged()
        case .toggleOn:
            UIImpactFeedbackGenerator(style: .rigid).impactOccurred(intensity: 0.8)
        case .toggleOff:
            UIImpactFeedbackGenerator(style: .soft).impactOccurred(intensity: 0.6)
        case .hingeDetent:
            UIImpactFeedbackGenerator(style: .medium).impactOccurred(intensity: 1.0)
        case .success:
            UINotificationFeedbackGenerator().notificationOccurred(.success)
        case .warning:
            UINotificationFeedbackGenerator().notificationOccurred(.warning)
        case .failure:
            UINotificationFeedbackGenerator().notificationOccurred(.error)
        }
        #endif
        _ = display
    }
}
