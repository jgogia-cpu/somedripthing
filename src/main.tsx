import { createRoot } from "react-dom/client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import App from "./App.tsx";
import "./index.css";

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

createRoot(document.getElementById("root")!).render(
  <PostHogProvider client={posthog}>
    <App />
  </PostHogProvider>,
);
