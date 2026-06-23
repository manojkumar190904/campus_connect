import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth-guard";
import { listRecords } from "@/lib/workflows";

export async function GET() {
  const auth = await requirePermission("admin:manage");
  if ("error" in auth) return auth.error;
  return NextResponse.json({ auditLogs: await listRecords("auditLogs") });
}
