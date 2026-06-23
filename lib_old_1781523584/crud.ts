import { NextResponse } from "next/server";
import { z } from "zod";
import type { Model, Query } from "mongoose";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import type { Role } from "@/lib/utils";

type CrudConfig = {
  model: Model<any>;
  schema: z.ZodTypeAny & { partial: () => z.ZodTypeAny };
  searchable: string[];
  rolesCanCreate?: Role[];
  rolesCanUpdate?: Role[];
  rolesCanDelete?: Role[];
  ownerField?: string;
  enrichCreate?: (data: any, session: any) => any;
};

function can(role: Role | undefined, allowed?: Role[]) {
  if (!allowed || allowed.length === 0) return true;
  return !!role && allowed.includes(role);
}

function searchQuery(fields: string[], q: string | null) {
  if (!q) return {};
  return {
    $or: fields.map((field) => ({ [field]: { $regex: q, $options: "i" } }))
  };
}

export function createCollectionHandlers(config: CrudConfig) {
  return {
    async GET(req: Request) {
      try {
        await connectDB();
        const session = await auth();
        if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const { searchParams } = new URL(req.url);
        const q = searchParams.get("q");
        const department = searchParams.get("department");
        const category = searchParams.get("category");
        const status = searchParams.get("status");
        const filter: any = { ...searchQuery(config.searchable, q) };
        if (department) filter.department = department;
        if (category) filter.category = category;
        if (status) filter.status = status;
        const items = await config.model.find(filter).sort({ createdAt: -1 }).limit(60).lean();
        return NextResponse.json({ items });
      } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Unable to fetch records" }, { status: 500 });
      }
    },
    async POST(req: Request) {
      try {
        await connectDB();
        const session = await auth();
        if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        if (!can(session.user.role, config.rolesCanCreate)) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        const json = await req.json();
        const parsed = config.schema.safeParse(json);
        if (!parsed.success) return NextResponse.json({ message: "Validation failed", errors: parsed.error.flatten() }, { status: 422 });
        const payload = config.enrichCreate ? config.enrichCreate(parsed.data, session) : parsed.data;
        const item = await config.model.create(payload);
        return NextResponse.json({ item }, { status: 201 });
      } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Unable to create record" }, { status: 500 });
      }
    }
  };
}

export function createItemHandlers(config: CrudConfig) {
  return {
    async GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
      try {
        await connectDB();
        const session = await auth();
        if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const { id } = await params;
        const item = await config.model.findById(id).lean();
        if (!item) return NextResponse.json({ message: "Not found" }, { status: 404 });
        return NextResponse.json({ item });
      } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Unable to fetch record" }, { status: 500 });
      }
    },
    async PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
      try {
        await connectDB();
        const session = await auth();
        if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        if (!can(session.user.role, config.rolesCanUpdate)) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        const json = await req.json();
        const parsed = config.schema.partial().safeParse(json);
        if (!parsed.success) return NextResponse.json({ message: "Validation failed", errors: parsed.error.flatten() }, { status: 422 });
        const { id } = await params;
        const item = await config.model.findByIdAndUpdate(id, parsed.data as any, { new: true });
        if (!item) return NextResponse.json({ message: "Not found" }, { status: 404 });
        return NextResponse.json({ item });
      } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Unable to update record" }, { status: 500 });
      }
    },
    async DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
      try {
        await connectDB();
        const session = await auth();
        if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        if (!can(session.user.role, config.rolesCanDelete)) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        const { id } = await params;
        const item = await config.model.findByIdAndDelete(id);
        if (!item) return NextResponse.json({ message: "Not found" }, { status: 404 });
        return NextResponse.json({ ok: true });
      } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Unable to delete record" }, { status: 500 });
      }
    }
  };
}
