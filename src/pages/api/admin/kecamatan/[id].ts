import type { APIRoute } from "astro";
import { prisma } from "../../../../lib/prisma";

export const prerender = false;

export const PUT: APIRoute = async ({ params, request }) => {
  const body = await request.json();

  const updated = await prisma.kecamatan.update({
    where: { id: params.id },
    data: { nama: body.nama, wilayahId: body.wilayahId },
  });

  return new Response(JSON.stringify(updated), { status: 200 });
};

export const DELETE: APIRoute = async ({ params }) => {
  await prisma.kecamatan.delete({ where: { id: params.id } });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
};