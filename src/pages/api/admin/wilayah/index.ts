import type { APIRoute } from "astro";
import { prisma } from "../../../../lib/prisma";

export const prerender = false;

export const GET: APIRoute = async () => {
  const data = await prisma.wilayah.findMany({ orderBy: { orderIndex: "asc" } });
  return new Response(JSON.stringify(data), { status: 200 });
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();

  if (!body.nama) {
    return new Response(JSON.stringify({ message: "Nama wilayah wajib diisi" }), { status: 400 });
  }

  const created = await prisma.wilayah.create({
    data: {
      nama: body.nama,
      region: body.region || null,
      deskripsi: body.deskripsi || null,
      logoUrl: body.logoUrl || null,   // ← ini yang kurang
      orderIndex: body.orderIndex ?? 0,
      isActive: body.isActive ?? true,
    },
  });

  return new Response(JSON.stringify(created), { status: 201 });
};