// Lightweight GA4 + analytics helper. No-op when VITE_GA4_MEASUREMENT_ID is unset.

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID as string | undefined;

let initialized = false;

export function initGA4() {
  if (initialized || !GA_ID || typeof window === "undefined") return;
  initialized = true;

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  window.gtag = function gtag(...args: any[]) { window.dataLayer!.push(args); };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { send_page_view: false });
}

export function trackPageview(path: string) {
  if (!GA_ID || !window.gtag) return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    send_to: GA_ID,
  });
}

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (!GA_ID || !window.gtag) return;
  window.gtag("event", name, params);
}

export const isGAEnabled = () => Boolean(GA_ID);