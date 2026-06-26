import { useEffect, useRef } from "react";

const BANNER_SCRIPT =
  "//pricklyassociation.com/bmX/V.sbdFGslM0BY/WAcf/peVmY9Ku/ZoUilWk/P/TAcVx/NEjkMl2qMPj/EitgNFzgE_2/MUzBYryvN_QK";

export default function BannerAd2() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Prevent duplicate script injection
    let script = document.querySelector(`script[src="${BANNER_SCRIPT}"]`);

    if (!script) {
      script = document.createElement("script");
      script.src = BANNER_SCRIPT;
      script.async = true;
      script.referrerPolicy = "no-referrer-when-downgrade";
      document.body.appendChild(script);
    }

    const moveAd = () => {
      const iframe = document.querySelector(
        'iframe[src*="pricklyassociation.com"]',
      );

      if (!iframe) return;

      const ad = iframe.closest("div[id]");

      if (!ad) return;

      if (ad.parentElement !== container) {
        container.appendChild(ad);
      }

      // Make responsive
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
