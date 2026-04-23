import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { usePostHog } from "posthog-js/react";

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

    if (event.defaultPrevented || !href || !posthog.__loaded) {
      return;
    }

    posthog.capture(eventName, {
      destination_url: href,
      source_path: window.location.pathname,
      source_url: window.location.href,
      ...trackingProperties,
    });
  };

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
