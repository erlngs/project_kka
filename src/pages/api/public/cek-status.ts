import type { APIRoute } from "astro";
import { prisma } from "../../../lib/prisma";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const code = url.searchParams.get("code");
  if (!code) {
    return new Response(JSON.stringify({ message: "Kode invoice wajib diisi" }), { status: 400 });
  }

  const invoice = await prisma.invoice.findUnique({
    where: { invoiceCode: code.trim().toUpperCase() },
    include: { pendaftaran: { include: { wilayah: true, gelombang: true } } },
  });

  if (!invoice) {
    return new Response(JSON.stringify({ message: "Kode invoice tidak ditemukan" }), { status: 404 });
  }

  return new Response(JSON.stringify(invoice), { status: 200 });
};