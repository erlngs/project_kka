import type { APIRoute } from "astro";
import { prisma } from "../../../../lib/prisma";

export const prerender = false;

export const PUT: APIRoute = async ({ params, request }) => {
  const body = await request.json();

  await prisma.gelombang.update({
    where: { id: params.id },
    data: {
      nama: body.nama,
      tanggalMulai: new Date(body.tanggalMulai),
      tanggalSelesai: new Date(body.tanggalSelesai),
      isActive: body.isActive ?? true,
    },
  });

  // Update harga per jenjang (upsert biar aman kalau belum ada)
  const jenjangMap = [
    { jenjang: "SD_MI", harga: body.hargaSd || 0 },
    { jenjang: "SMP_MTS", harga: body.hargaSmp || 0 },
    { jenjang: "SMA_MA_SMK", harga: body.hargaSma || 0 },
  ];

  for (const j of jenjangMap) {
    await prisma.biayaPendaftaran.upsert({
      where: { gelombangId_jenjang: { gelombangId: params.id!, jenjang: j.jenjang as any } },
      update: { harga: j.harga },
      create: { gelombangId: params.id!, jenjang: j.jenjang as any, harga: j.harga },
    });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};

export const DELETE: APIRoute = async ({ params }) => {
  await prisma.gelombang.delete({ where: { id: params.id } });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
};