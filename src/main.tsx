import { createRoot } from "react-dom/client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import { initGA4 } from "./lib/analytics";
import { loadHiddenProducts } from "./lib/hiddenProducts";

const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
const posthogHost = import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com";

if (posthogKey) {
  posthog.init(posthogKey, {
    api_host: posthogHost,
    capture_pageview: false,
    loaded: (client) => {
      if (import.meta.env.DEV) {
        client.debug();
      }
    },
  });
} else if (import.meta.env.DEV) {
  console.warn("[PostHog] Missing VITE_POSTHOG_KEY; analytics is disabled.");
}

initGA4();

function mount() {
  createRoot(document.getElementById("root")!).render(
    <HelmetProvider>
      <PostHogProvider client={posthog}>
        <App />
      </PostHogProvider>
    </HelmetProvider>,
  );
}

// Filter out products whose image or affiliate URL is dead before first render
// (populated daily by the validate-products edge function) so hidden products
// can never be selected into fixed per-page carousel/listing snapshots.
loadHiddenProducts().finally(mount);
