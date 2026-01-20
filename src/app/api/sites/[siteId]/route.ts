import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ siteId: string }> }
) {
  const { siteId } = await ctx.params;

  const { data, error } = await supabaseAdmin
    .from("sites")
    .select("id,name")
    .eq("id", siteId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
