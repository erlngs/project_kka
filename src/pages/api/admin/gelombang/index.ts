import type { APIRoute } from "astro";
import { prisma } from "../../../../lib/prisma";

export const prerender = false;

export const GET: APIRoute = async () => {
  const data = await prisma.gelombang.findMany({
    include: { biaya: true },
    orderBy: { tanggalMulai: "asc" },
  });
  return new Response(JSON.stringify(data), { status: 200 });
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();

  if (!body.nama || !body.tanggalMulai || !body.tanggalSelesai) {
    return new Response(JSON.stringify({ message: "Nama dan tanggal wajib diisi" }), { status: 400 });
  }

  const created = await prisma.gelombang.create({
    data: {
      nama: body.nama,
      tanggalMulai: new Date(body.tanggalMulai),
      tanggalSelesai: new Date(body.tanggalSelesai),
      isActive: body.isActive ?? true,
      biaya: {
        create: [
          { jenjang: "SD_MI", harga: body.hargaSd || 0 },
          { jenjang: "SMP_MTS", harga: body.hargaSmp || 0 },
          { jenjang: "SMA_MA_SMK", harga: body.hargaSma || 0 },
        ],
      },
    },
  });

  return new Response(JSON.stringify(created), { status: 201 });
};