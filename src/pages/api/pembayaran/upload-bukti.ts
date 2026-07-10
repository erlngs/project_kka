import type { APIRoute } from "astro";
import { prisma } from "../../../lib/prisma";
import { supabaseAdmin } from "../../../lib/supabase";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const invoiceCode = formData.get("invoiceCode") as string;

  if (!file || !invoiceCode) {
    return new Response(JSON.stringify({ message: "Data tidak lengkap" }), { status: 400 });
  }

  const invoice = await prisma.invoice.findUnique({ where: { invoiceCode } });
  if (!invoice) {
    return new Response(JSON.stringify({ message: "Invoice tidak ditemukan" }), { status: 404 });
  }

  const ext = file.name.split(".").pop();
  const fileName = `bukti-${invoiceCode}-${Date.now()}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from("project_kka")
    .upload(fileName, file, { contentType: file.type });

  if (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }

  const { data } = supabaseAdmin.storage.from("project_kka").getPublicUrl(fileName);

  await prisma.invoice.update({
    where: { invoiceCode },
    data: {
      buktiPembayaranUrl: data.publicUrl,
      status: "menunggu_verifikasi",
    },
  });

  await prisma.pendaftaran.update({
    where: { id: invoice.pendaftaranId },
    data: { status: "menunggu_verifikasi" },
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};