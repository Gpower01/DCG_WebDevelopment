"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    AnnotateConfig?: { project: string; accent?: string };
  }
}

/**
 * Client-review commenting overlay (reviewjs/annotate). Rendered only on the test deployment:
 * set NEXT_PUBLIC_ENABLE_ANNOTATE=true in that Cloudflare Pages project's env (build-time).
 */
export default function Annotate() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENABLE_ANNOTATE !== "true") return;
    if (document.getElementById("annotate-js")) return;
    window.AnnotateConfig = { project: "dcg-website", accent: "#6d28d9" };
    const s = document.createElement("script");
    s.id = "annotate-js";
    s.src = "https://cdn.jsdelivr.net/npm/@reviewjs/annotate/annotate.js";
    s.defer = true;
    document.body.appendChild(s);
  }, []);
  return null;
}
