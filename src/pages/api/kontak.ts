import type { APIRoute } from "astro";
import { prisma } from "../../lib/prisma";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();

  if (!body.nama || !body.email || !body.pesan) {
    return new Response(JSON.stringify({ message: "Nama, email, dan pesan wajib diisi" }), { status: 400 });
  }

  await prisma.pesan.create({
    data: {
      nama: body.nama,
      email: body.email,
      telepon: body.telepon || null,
      pesan: body.pesan,
    },
  });

  return new Response(JSON.stringify({ success: true }), { status: 201 });
};