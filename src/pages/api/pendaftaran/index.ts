import type { APIRoute } from "astro";
import { prisma } from "../../../lib/prisma";
import { appendPendaftaranToSheet } from "../../../lib/googleSheets";

export const prerender = false;

function generateInvoiceCode() {
  const year = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `KKA-${year}-${rand}`;
}

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();

  const required = ["namaSiswa", "nisn", "noWhatsapp", "gender", "wilayahId", "kecamatanId", "jenjang"];
  for (const field of required) {
    if (!body[field]) {
      return new Response(JSON.stringify({ message: `Field ${field} wajib diisi` }), { status: 400 });
    }
  }

  const today = new Date();
  const gelombangAktif = await prisma.gelombang.findFirst({
    where: {
      isActive: true,
      tanggalMulai: { lte: today },
      tanggalSelesai: { gte: today },
    },
    include: { biaya: true },
  });

  if (!gelombangAktif) {
    return new Response(JSON.stringify({ message: "Pendaftaran sedang ditutup, tidak ada gelombang aktif saat ini." }), { status: 400 });
  }

  const biaya = gelombangAktif.biaya.find((b) => b.jenjang === body.jenjang);
  if (!biaya) {
    return new Response(JSON.stringify({ message: "Biaya untuk jenjang ini belum diatur." }), { status: 400 });
  }

  const pendaftaran = await prisma.pendaftaran.create({
    data: {
      namaSiswa: body.namaSiswa,
      nisn: body.nisn,
      noWhatsapp: body.noWhatsapp,
      gender: body.gender,
      wilayahId: body.wilayahId,
      kecamatanId: body.kecamatanId,
      jenjang: body.jenjang,
      kelas: body.kelas || null,
      sekolahManual: body.sekolahManual || null,
      gelombangId: gelombangAktif.id,
      jenisPendaftaran: body.jenisPendaftaran || "mandiri",
      status: "pending",
    },
  });

  const invoice = await prisma.invoice.create({
    data: {
      pendaftaranId: pendaftaran.id,
      invoiceCode: generateInvoiceCode(),
      jumlahTagihan: biaya.harga,
      status: "menunggu_pembayaran",
    },
  });

  try {
    await appendPendaftaranToSheet({
      namaSiswa: pendaftaran.namaSiswa,
      nisn: pendaftaran.nisn,
      noWhatsapp: pendaftaran.noWhatsapp,
      gender: pendaftaran.gender ?? "",
      jenjang: body.jenjang,
      sekolah: body.sekolahManual ?? "",
      gelombang: gelombangAktif.nama,
      invoiceCode: invoice.invoiceCode,
      biaya: Number(biaya.harga),
    });
    await prisma.pendaftaran.update({ where: { id: pendaftaran.id }, data: { syncedToSheet: true } });
  } catch (err) {
    console.error("Gagal sync ke Google Sheets:", err);
  }

  return new Response(JSON.stringify({ invoiceCode: invoice.invoiceCode }), { status: 201 });
};