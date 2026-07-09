import type { APIRoute } from "astro";
import { supabaseAdmin } from "../../../lib/supabase";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return new Response(JSON.stringify({ message: "File tidak ditemukan" }), { status: 400 });
  }

  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from("project_kka") // ganti sesuai nama bucket kamu
    .upload(fileName, file, { contentType: file.type });

  if (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }

  const { data } = supabaseAdmin.storage.from("kka-assets").getPublicUrl(fileName);

  return new Response(JSON.stringify({ url: data.publicUrl }), { status: 200 });
};