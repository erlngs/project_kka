import type { APIRoute } from "astro";
import { prisma } from "../../../../lib/prisma";

export const prerender = false;

export const PUT: APIRoute = async ({ params, request, locals }) => {
  const body = await request.json(); // { action: "verify" | "reject", catatan?: string }

  const invoice = await prisma.invoice.findUnique({ where: { id: params.id } });
  if (!invoice) {
    return new Response(JSON.stringify({ message: "Invoice tidak ditemukan" }), { status: 404 });
  }

  const newInvoiceStatus = body.action === "verify" ? "terverifikasi" : "ditolak";
  const newPendaftaranStatus = body.action === "verify" ? "lunas" : "ditolak";

  await prisma.invoice.update({
    where: { id: params.id },
    data: {
      status: newInvoiceStatus,
      catatanAdmin: body.action === "reject" ? (body.catatan || "Bukti pembayaran tidak valid, silakan upload ulang.") : null,
      dikonfirmasiOleh: locals.admin?.id,
      dikonfirmasiAt: new Date(),
    },
  });

  await prisma.pendaftaran.update({
    where: { id: invoice.pendaftaranId },
    data: { status: newPendaftaranStatus },
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};