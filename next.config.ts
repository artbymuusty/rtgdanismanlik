import type { NextConfig } from "next";

/**
 * Security headers audit (2026-09) confirmed, before choosing these
 * directives, that the app:
 *   - loads zero third-party/external scripts, stylesheets or analytics
 *     (grepped the whole tree — none found);
 *   - self-hosts every font via next/font/google (built at compile time
 *     into /_next/static — no runtime request to fonts.googleapis.com or
 *     fonts.gstatic.com, so font-src needs only 'self');
 *   - uses exactly one data: URI, an inline SVG <img> in WorldMap.tsx
 *     (img-src needs 'self' + data:, nothing else);
 *   - never calls fetch() to a cross-origin URL from client code — every
 *     Apps Script/CRM call happens server-side, in a Server Action
 *     (connect-src needs only 'self');
 *   - renders two <script type="application/ld+json"> blocks via
 *     dangerouslySetInnerHTML (app/[lang]/layout.tsx, app/[lang]/sss/page.tsx).
 *     These are inert JSON data blocks, not executed as script by any
 *     spec-compliant browser, so script-src's policy does not need to
 *     special-case them.
 *   - relies on Next.js App Router's own inline hydration scripts, and on
 *     plain React `style={{...}}` props (rendered as inline `style="..."`
 *     attributes) in several components (EditorialPhoto, CRM login page,
 *     University Explorer, ...). Both require 'unsafe-inline' in
 *     script-src/style-src respectively unless the app adopts a
 *     nonce-per-request pipeline (a materially bigger change — new
 *     middleware logic wired through every layout — deliberately left
 *     out of this pass to avoid risking the very breakage this exercise
 *     is trying to prevent). 'unsafe-inline' still leaves the policy
 *     doing real work: it blocks loading a script/style from any
 *     *external* origin, which is the part of a real XSS payload this
 *     policy can stop without a larger refactor.
 * Verified against the full test/E2E suite after adding this (see the
 * remediation report) — nothing broke in a production build (`next
 * start`). `next dev` specifically needs 'unsafe-eval' too — React's own
 * development-mode tooling (fast refresh, better component stack traces)
 * uses eval() there, and only there; the production bundle never does.
 * That's why this one keyword is dev-only instead of just adding it
 * unconditionally: production stays on the strictest policy.
 */
const isDev = process.env.NODE_ENV !== "production";
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  // MIME-sniffing protection — a response is only ever interpreted as the
  // content-type it declares.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Sends the full URL to same-origin navigations/requests, only the
  // origin (no path/query) cross-origin — balances analytics-free
  // referrer usefulness against leaking query strings (e.g. ?token=...
  // patterns, though this app has none today) to third parties.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Browsers only honor this over HTTPS (Vercel's production domains are
  // HTTPS-only), so it's a no-op in local http:// dev.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Clickjacking protection — CSP's frame-ancestors is the modern
  // mechanism (below); X-Frame-Options is kept alongside it for browsers
  // that don't support frame-ancestors. Most concretely: /crm/login (the
  // page that collects CRM_ADMIN_SECRET) can no longer be embedded in an
  // attacker's <iframe>. No page in this app has a legitimate reason to
  // be framed by another origin, so this applies site-wide.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: CSP },
  // The site uses none of these browser capabilities anywhere — disabling
  // them is a no-risk hardening step, not a feature removal.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
