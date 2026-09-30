# Checklist

A minimal Android checklist app (plain Java, no third-party dependencies).
Add items, tick them off, delete them, or clear all completed ones. Items persist across restarts.

## Build the APK

    cd checklist-app && ./gradlew assembleDebug

Output: `app/build/outputs/apk/debug/app-debug.apk`. Requires JDK 17 and the Android SDK.
The `Build checklist APK` GitHub Actions workflow builds it on every push and uploads it as an artifact.
