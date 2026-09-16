"use client";

import { useEffect, useState } from "react";

// iOS/안드로이드 셸은 Capacitor appendUserAgent로 "BFSOSApp"을 붙인다.
// 앱 안에서는 결제·요금 UI를 노출하지 않는다(스토어 IAP 정책 대응) — 결제는 웹에서만.
export function isNativeApp() {
  if (typeof navigator === "undefined") return false;
  return navigator.userAgent.includes("BFSOSApp");
}

export function useIsNativeApp() {
  const [native, setNative] = useState(false);
  useEffect(() => {
    setNative(isNativeApp());
  }, []);
  return native;
}
