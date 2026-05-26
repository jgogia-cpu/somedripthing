import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { usePostHog } from "posthog-js/react";
import { trackEvent as gaTrackEvent } from "@/lib/analytics";

type TrackingProperties = Record<string, string | number | boolean | null | undefined>;

interface TrackedOutboundLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  eventName?: string;
  trackingProperties?: TrackingProperties;
}

export default function TrackedOutboundLink({
  children,
  eventName = "outbound_brand_click",
  href,
  onClick,
  trackingProperties = {},
  ...props
}: TrackedOutboundLinkProps) {
  const posthog = usePostHog();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (event.defaultPrevented || !href) {
      return;
    }

    const payload = {
      destination_url: href,
      source_path: window.location.pathname,
      source_url: window.location.href,
      ...trackingProperties,
    };

    if (posthog.__loaded) posthog.capture(eventName, payload);

    // GA4 events
    const clickType = (trackingProperties?.click_type as string | undefined) || "";
    const gaName =
      clickType === "product" ? "affiliate_click_product"
      : clickType === "shop" ? "affiliate_click_brand"
      : clickType === "promo" ? "affiliate_click_promo"
      : eventName === "outbound_checkout_click" ? "checkout_redirect"
      : `outbound_${clickType || "click"}`;

    gaTrackEvent(gaName, {
      destination: href,
      brand_id: trackingProperties?.brand_id,
      brand_name: trackingProperties?.brand_name,
      product_id: trackingProperties?.product_id,
      product_name: trackingProperties?.product_name,
      source: trackingProperties?.source,
    });

    if (clickType === "product" || clickType === "shop" || clickType === "promo") {
      gaTrackEvent("checkout_redirect", {
        destination: href,
        brand_id: trackingProperties?.brand_id,
        brand_name: trackingProperties?.brand_name,
        product_id: trackingProperties?.product_id,
        click_type: clickType,
      });
    }
  };

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
