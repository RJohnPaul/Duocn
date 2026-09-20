// swift-tools-version: 6.0
import PackageDescription

// iOS 27.1 is the floor because the APIs DuoCN is built around — ReservedRegion,
// ArrangementView, DeviceHinge and the vertical toolbar behaviours — are all
// iOS 27.1 and currently flagged Beta by Apple. Building this needs an Xcode
// with the iOS 27.1 SDK.
//
// macOS is kept as a build target so the layout logic can be unit-tested on a
// Mac without a device; nothing Duo-specific is available there.
let package = Package(
    name: "DuoCN",
    platforms: [.iOS("27.1"), .macOS(.v14)],
    products: [
        .library(name: "DuoCN", targets: ["DuoCN"])
    ],
    targets: [
        .target(name: "DuoCN"),
        .testTarget(name: "DuoCNTests", dependencies: ["DuoCN"])
    ]
)
