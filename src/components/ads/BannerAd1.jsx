import { useEffect, useRef } from "react";

const BANNER_SCRIPT =
  "//pricklyassociation.com/b.XRV/sMdwGdlo0vYbWjc-/CeqmG9HuOZ/UZlrkhPwTcccxsNUjmMw0/N/DKEIt_NizUEx2WMWz/QO0/N_Qc";

export default function BannerAd1() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Load HilltopAds script
    const script = document.createElement("script");
    script.src = BANNER_SCRIPT;
    script.async = true;
    script.referrerPolicy = "no-referrer-when-downgrade";

    document.body.appendChild(script);

    const moveAd = () => {
      const iframe = document.querySelector(
        'iframe[src*="pricklyassociation.com"]',
      );

      if (!iframe || !container) return;

      const ad = iframe.closest("div[id]");

      if (!ad) return;

      if (ad.parentElement !== container) {
        container.appendChild(ad);
      }

      // Responsive styling
      ad.style.width = "100%";
      ad.style.display = "flex";
      ad.style.justifyContent = "center";

      iframe.style.width = "100%";
      iframe.style.maxWidth = "100%";
      iframe.style.border = "0";
    };

    const observer = new MutationObserver(moveAd);

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    moveAd();

    return () => {
      observer.disconnect();
      script.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        margin: "24px 0",
      }}
    />
  );
}
