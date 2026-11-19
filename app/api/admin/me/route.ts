import { getAdmin } from "@/lib/auth/require-admin";

export const runtime = "edge";
export const dynamic = "force-dynamic";

/** Whether the caller holds a valid admin session. Used to gate the review overlay on the public site. */
export async function GET() {
  const admin = await getAdmin().catch(() => null);
  return Response.json(
    { admin: Boolean(admin), name: admin ? admin.email.split("@")[0] : null },
    { headers: { "Cache-Control": "no-store" } },
  );
}
