import XCTest
import SwiftUI
@testable import DuoCN

/// These tests exist because the previous implementation inferred the pose from
/// the window aspect ratio, which is provably impossible on real hardware.
final class PoseInferenceTests: XCTestCase {

    /// The regression that motivated the rewrite.
    ///
    /// The closed outer display is 1398x2034 (ratio 0.687) and the fully open
    /// device in Portrait is 1878x2670 (ratio 0.703). Those are 2% apart, so no
    /// aspect-ratio threshold can separate them. The old code returned `.folded`
    /// for both — reporting an open device as closed.
    func testClosedAndPortraitAreIndistinguishableByRatioAlone() {
        let outer = CGSize(width: 1398, height: 2034)
        let innerPortrait = CGSize(width: 1878, height: 2670)

        let ratioGap = abs((outer.width / outer.height) - (innerPortrait.width / innerPortrait.height))
        XCTAssertLessThan(ratioGap, 0.02, "If this grows, the size class may no longer be required.")

        // With the size class, both resolve correctly.
        XCTAssertEqual(DuoStage<EmptyView>.inferPose(size: outer, isCompactWidth: true), .closed)
        XCTAssertEqual(DuoStage<EmptyView>.inferPose(size: innerPortrait, isCompactWidth: false), .portrait)
    }

    func testInferPoseUsesSizeClass() {
        let landscape = CGSize(width: 2670, height: 1878)
        XCTAssertEqual(DuoStage<EmptyView>.inferPose(size: landscape, isCompactWidth: false), .landscape)
        // Compact width is the outer display regardless of shape.
        XCTAssertEqual(DuoStage<EmptyView>.inferPose(size: landscape, isCompactWidth: true), .closed)
    }

    func testDegenerateSizeDoesNotCrash() {
        XCTAssertEqual(DuoStage<EmptyView>.inferPose(size: .zero, isCompactWidth: false), .closed)
    }

    func testWithoutSizeClassOnlyLandscapeIsUnambiguous() {
        // No size class (non-iOS): a landscape window is still unambiguous.
        XCTAssertEqual(
            DuoStage<EmptyView>.inferPose(size: CGSize(width: 2670, height: 1878), isCompactWidth: nil),
            .landscape
        )
        // Portrait-shaped windows are reported closed, because they genuinely
        // cannot be told apart from the outer display by geometry.
        XCTAssertEqual(
            DuoStage<EmptyView>.inferPose(size: CGSize(width: 1878, height: 2670), isCompactWidth: nil),
            .closed
        )
    }
}

final class PoseModelTests: XCTestCase {

    func testPosesMapOntoThreeHingeStatuses() {
        XCTAssertEqual(DuoPose.closed.hingeStatus, .closed)
        XCTAssertEqual(DuoPose.portrait.hingeStatus, .fullyOpen)
        XCTAssertEqual(DuoPose.landscape.hingeStatus, .fullyOpen)
        XCTAssertEqual(DuoPose.seated.hingeStatus, .partiallyOpen)
        XCTAssertEqual(DuoPose.standing.hingeStatus, .partiallyOpen)

        XCTAssertEqual(Set(DuoPose.allCases.map(\.hingeStatus)).count, 3)
    }

    /// A fully open Duo is one continuous canvas. This is the correction that
    /// the old `isSpanned` model got wrong: it treated "open" as "divided".
    func testFullyOpenHasNoActiveDivisionRegion() {
        for pose in [DuoPose.portrait, .landscape] {
            XCTAssertNil(pose.divisionAxis, "\(pose) is fully open — nothing to avoid")
            let fold = DuoStage<EmptyView>.fold(for: pose, in: CGSize(width: 2670, height: 1878))
            XCTAssertFalse(fold.isDivisionActive)
            XCTAssertTrue(fold.divisionRect(in: CGSize(width: 2670, height: 1878)).isNull)
        }
    }

    func testPartiallyOpenPosesDivide() {
        XCTAssertEqual(DuoPose.seated.divisionAxis, .horizontal)
        XCTAssertEqual(DuoPose.standing.divisionAxis, .vertical)

        let size = CGSize(width: 1000, height: 600)
        let fold = DuoStage<EmptyView>.fold(for: .seated, in: size)
        XCTAssertTrue(fold.isDivisionActive)

        let rect = fold.divisionRect(in: size)
        XCTAssertEqual(rect.midY, 300, accuracy: 0.001)
        XCTAssertEqual(rect.width, 1000, accuracy: 0.001)
    }

    func testClosedAndStandingUseTheOuterDisplay() {
        XCTAssertEqual(DuoPose.closed.display, .outer)
        XCTAssertEqual(DuoPose.standing.display, .outer)
        XCTAssertEqual(DuoPose.landscape.display, .inner)
        XCTAssertFalse(DuoPose.closed.isOpen)
        XCTAssertTrue(DuoPose.seated.isOpen)
    }
}
