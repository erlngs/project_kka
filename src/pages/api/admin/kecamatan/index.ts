import type { APIRoute } from "astro";
import { prisma } from "../../../../lib/prisma";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const wilayahId = url.searchParams.get("wilayahId");
  const data = await prisma.kecamatan.findMany({
    where: wilayahId ? { wilayahId } : undefined,
    include: { wilayah: true },
    orderBy: { nama: "asc" },
  });
  return new Response(JSON.stringify(data), { status: 200 });
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();

  if (!body.nama || !body.wilayahId) {
    return new Response(JSON.stringify({ message: "Nama dan wilayah wajib diisi" }), { status: 400 });
  }

  const created = await prisma.kecamatan.create({
    data: { nama: body.nama, wilayahId: body.wilayahId },
  });

  return new Response(JSON.stringify(created), { status: 201 });
};