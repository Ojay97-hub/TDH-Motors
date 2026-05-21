import { z } from "zod";
import { createServiceClient } from "@/lib/supabase-server";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  car: z.string().optional(),
  type: z.enum(["Viewing", "Part-Exchange", "Bespoke Sourcing", "General"]),
  message: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: "Invalid data", issues: parsed.error.flatten() }, { status: 422 });
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from("enquiries").insert(parsed.data);

  if (error) {
    console.error("Supabase insert error:", error);
    return Response.json({ error: "Failed to save enquiry" }, { status: 500 });
  }

  return Response.json({ ok: true }, { status: 201 });
}
