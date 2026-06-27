import { useEffect, useRef } from "react";

const loadedScripts = new Set();

export default function BannerAd({ scriptUrl }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !scriptUrl) return;

    let cancelled = false;

    const loadScript = () => {
      if (!loadedScripts.has(scriptUrl)) {
        const existing = document.querySelector(`script[src="${scriptUrl}"]`);
        if (!existing) {
          const script = document.createElement("script");
          script.src = scriptUrl;
          script.async = true;
          script.referrerPolicy = "no-referrer-when-downgrade";
          document.body.appendChild(script);
        }
        loadedScripts.add(scriptUrl);
      }
    };

    const attachAdOnce = () => {
      if (cancelled) return;

      const iframe = document.querySelector(
        `iframe[src*="pricklyassociation.com"]`,
      );

      if (!iframe) {
        return false;
      }

      const adWrapper = iframe.closest("div[id]") || iframe.parentElement;
      if (!adWrapper) return false;

      if (adWrapper.dataset.movedTo === container.dataset.slotId) {
        return true;
      }

      if (adWrapper.parentElement !== container) {
        container.innerHTML = "";
        container.appendChild(adWrapper);
      }

      adWrapper.style.width = "100%";
      adWrapper.style.display = "flex";
      adWrapper.style.justifyContent = "center";
      adWrapper.style.overflow = "hidden";
      adWrapper.dataset.movedTo = container.dataset.slotId;

      iframe.style.width = "100%";
      iframe.style.maxWidth = "100%";
      iframe.style.border = "0";

      return true;
    };

    loadScript();

    let attempts = 0;
    const maxAttempts = 20;
    const timer = setInterval(() => {
      attempts += 1;
      const done = attachAdOnce();
      if (done || attempts >= maxAttempts) {
        clearInterval(timer);
      }
    }, 500);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [scriptUrl]);

  return (
    <div
      ref={containerRef}
      data-slot-id={scriptUrl}
    />
  );
}
