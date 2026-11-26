import type { ComponentProps } from "react";

/**
 * A link to another page of this site, marked as the current page where it is one.
 *
 * Deliberately a plain <a>, not next/link: every page change is a full page load for now. With
 * cacheComponents on, a client-side navigation keeps the previous page mounted (hidden by React
 * Activity), so the home's opening — its intro logo, which docks into the header and finds it in the
 * document — would meet a second header, and the pre-hydration reveal contract would not be re-armed.
 * A full load keeps every page on the exact path it was built and tested on. Moving to next/link is a
 * separate step with its own checks.
 */
export function PageLink({ href, current, ...props }: ComponentProps<"a"> & { href: string; current?: string }) {
  return <a {...props} href={href} aria-current={current === href ? "page" : undefined} />;
}
