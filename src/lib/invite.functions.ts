import { createServerFn } from "@tanstack/react-start";
import { generateResponse, GatewayError } from "@lovable.dev/ai-gateway";

export const SENDER = "Thabiso bee";

export const createInvitation = createServerFn({ method: "POST" })
  .inputValidator((input: { name: string; details: string }) => {
    const name = String(input?.name ?? "").trim().slice(0, 80);
    const details = String(input?.details ?? "").trim().slice(0, 1000);
    if (!name || !details) throw new Error("Please add a name and a few details.");
    return { name, details };
  })
  .handler(async ({ data }) => {
    let message = "";
    try {
      const res = await generateResponse({
        model: "openai/gpt-6-astra",
        instructions: `You write short, sweet, playful date invitations. Address the person by name, weave in their personal details naturally, keep it 60-110 words, warm and charming (a couple of emojis is fine). Sign it exactly: "— ${SENDER} 💌". Plain text only.`,
        input: `Name: ${data.name}\nAbout them: ${data.details}`,
      });
      for (const item of res.output ?? []) {
        if (item.type === "message") {
          for (const c of item.content ?? []) if (c.type === "output_text") message += c.text;
        }
      }
    } catch (e) {
      console.error("invite AI failed", e instanceof GatewayError ? e.code : e);
      return { error: "Couldn't write the invitation right now. Please try again.", id: null, message: "" };
    }
    message = message.trim();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("date_invitations")
      .insert({ name: data.name, details: data.details, message })
      .select("id")
      .single();
    return { error: null, id: row?.id ?? null, message };
  });

export const saveAnswer = createServerFn({ method: "POST" })
  .inputValidator((input: { id: string; date_time: string; food: string; activity: string }) => ({
    id: String(input.id).slice(0, 40),
    date_time: String(input.date_time).slice(0, 40),
    food: String(input.food).slice(0, 40),
    activity: String(input.activity).slice(0, 40),
  }))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("date_invitations")
      .update({ date_time: data.date_time, food: data.food, activity: data.activity })
      .eq("id", data.id)
      .is("date_time", null);
    return { ok: true };
  });
