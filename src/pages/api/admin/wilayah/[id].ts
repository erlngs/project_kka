import type { APIRoute } from "astro";
import { prisma } from "../../../../lib/prisma";

export const prerender = false;

export const PUT: APIRoute = async ({ params, request }) => {
  const body = await request.json();

  const updated = await prisma.wilayah.update({
    where: { id: params.id },
    data: {
      nama: body.nama,
      region: body.region || null,
      deskripsi: body.deskripsi || null,
      logoUrl: body.logoUrl || null,
      orderIndex: body.orderIndex ?? 0,
      isActive: body.isActive ?? true,
    },
  });

  return new Response(JSON.stringify(updated), { status: 200 });
};

export const DELETE: APIRoute = async ({ params }) => {
  await prisma.wilayah.delete({ where: { id: params.id } });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
};