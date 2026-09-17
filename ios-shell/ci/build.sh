#!/bin/bash
# BFS OS iOS 빌드 스크립트 — 워크플로는 이 파일만 호출한다 (수정은 레포 푸시로).
# 필요 env: ASC_KEY_ID / ASC_ISSUER_ID / APPLE_TEAM_ID / ASC_KEY_P8_BASE64
set -euo pipefail

cd "$(dirname "$0")/.."   # ios-shell/
echo "== Xcode 선택 (최신 버전) =="
ls -d /Applications/Xcode*.app
LATEST=$(ls -d /Applications/Xcode_*.app 2>/dev/null | sort -V | tail -1)
if [ -n "$LATEST" ]; then sudo xcode-select -s "$LATEST"; fi
xcodebuild -version

echo "== Capacitor sync =="
npm ci
npx cap sync ios

echo "== ASC API key =="
mkdir -p ~/private_keys
echo "$ASC_KEY_P8_BASE64" | base64 -d > ~/private_keys/AuthKey_${ASC_KEY_ID}.p8
AUTH=(-authenticationKeyPath "$HOME/private_keys/AuthKey_${ASC_KEY_ID}.p8" \
      -authenticationKeyID "$ASC_KEY_ID" \
      -authenticationKeyIssuerID "$ASC_ISSUER_ID")

cd ios/App

echo "== Archive (서명 없이 — 서명은 export에서 배포용으로) =="
xcodebuild -project App.xcodeproj -scheme App -configuration Release \
  -destination 'generic/platform=iOS' \
  -archivePath "$PWD/App.xcarchive" archive \
  CODE_SIGNING_ALLOWED=NO CODE_SIGNING_REQUIRED=NO \
  DEVELOPMENT_TEAM="$APPLE_TEAM_ID"

echo "== Export IPA (App Store 배포 서명 자동 생성) =="
cat > exportOptions.plist <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>method</key><string>app-store-connect</string>
  <key>teamID</key><string>${APPLE_TEAM_ID}</string>
  <key>signingStyle</key><string>automatic</string>
  <key>uploadSymbols</key><true/>
</dict></plist>
PLIST
xcodebuild -exportArchive -archivePath "$PWD/App.xcarchive" \
  -exportOptionsPlist exportOptions.plist -exportPath "$PWD/out" \
  -allowProvisioningUpdates "${AUTH[@]}"

echo "== Upload to TestFlight =="
UPLOAD_OUT=$(xcrun altool --upload-app -f out/*.ipa -t ios   --apiKey "$ASC_KEY_ID" --apiIssuer "$ASC_ISSUER_ID" 2>&1) || true
echo "$UPLOAD_OUT"
# altool이 에러를 찍고도 0으로 끝나는 경우가 있어 출력으로 성공을 확정한다.
if ! echo "$UPLOAD_OUT" | grep -q "UPLOAD SUCCEEDED"; then
  echo "!! TestFlight upload FAILED"; exit 1
fi
echo "== DONE =="
