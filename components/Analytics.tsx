"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { GA_ID, trackPageView } from "@/lib/analytics";

/**
 * GA4 로더 + SPA page_view. NEXT_PUBLIC_GA_ID 없으면 아무것도 렌더하지 않는다.
 * 초기 page_view는 gtag config가 보내지 않도록 끄고(중복 방지) 라우터 훅에서만 보낸다.
 */
export default function Analytics() {
  const pathname = usePathname();
  const loaded = useRef(false);

  useEffect(() => {
    if (!GA_ID) return;
    // Script onLoad 이전 첫 렌더는 gtag 스텁(dataLayer push)이라도 안전하게 동작
    trackPageView(pathname);
    loaded.current = true;
  }, [pathname]);

  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: false });
        `}
      </Script>
    </>
  );
}
