import type { APIRoute } from "astro";
import { prisma } from "../../../../lib/prisma";

export const prerender = false;

export const GET: APIRoute = async () => {
  const data = await prisma.testimoni.findMany({ orderBy: { orderIndex: "asc" } });
  return new Response(JSON.stringify(data), { status: 200 });
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();

  if (!body.nama || !body.pesan) {
    return new Response(JSON.stringify({ message: "Nama dan pesan wajib diisi" }), { status: 400 });
  }

  const created = await prisma.testimoni.create({
    data: {
      nama: body.nama,
      asal: body.asal || null,
      pesan: body.pesan,
      fotoUrl: body.fotoUrl || null,
      rating: body.rating ?? 5,
      orderIndex: body.orderIndex ?? 0,
      isActive: body.isActive ?? true,
    },
  });

  return new Response(JSON.stringify(created), { status: 201 });
};