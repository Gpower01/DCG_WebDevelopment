"use client";

import { useEffect } from "react";

/**
 * Client-review commenting overlay (@reviewjs/annotate, firebase live-sync branch). Rendered only when
 * NEXT_PUBLIC_ENABLE_ANNOTATE=true (build-time) AND the visitor holds a valid admin session
 * (checked via /api/admin/me). Non-admins never download the overlay code.
 * Comments sync through Firestore (`annotateReviews/{reviewId}`), signed in anonymously.
 */
export default function Annotate() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENABLE_ANNOTATE !== "true") return;
    let cancelled = false;
    (async () => {
      const me = await fetch("/api/admin/me", { credentials: "same-origin", cache: "no-store" })
        .then((r) => (r.ok ? (r.json() as Promise<{ admin?: boolean }>) : { admin: false }))
        .catch(() => ({ admin: false }));
      if (!me.admin || cancelled) return;
      const [{ init }, { firebaseTransport }, { getApps, initializeApp }, { firebaseConfig }] = await Promise.all([
        import("@reviewjs/annotate"),
        import("@reviewjs/annotate/firebase"),
        import("firebase/app"),
        import("@/lib/firebase/config"),
      ]);
      if (cancelled) return;
      // Dedicated named app so it never shares authDomain/session with the admin sign-in app.
      const app = getApps().find((a) => a.name === "annotate") ?? initializeApp(firebaseConfig, "annotate");
      const reviewId = "dcg-website";
      init({
        project: "dcg-website",
        reviewId,
        accent: "#6d28d9",
        spa: true,
        transport: firebaseTransport({ app, reviewId }),
      });
    })().catch((e) => console.warn("[annotate] failed to start", e));
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}
