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

  const requiredKoordinator = ["namaKoordinator", "namaSekolah", "noWhatsapp", "wilayahId", "kecamatanId"];
  for (const field of requiredKoordinator) {
    if (!body[field]) {
      return new Response(JSON.stringify({ message: `Field ${field} wajib diisi` }), { status: 400 });
    }
  }
  if (!Array.isArray(body.siswaList) || body.siswaList.length < 2) {
    return new Response(JSON.stringify({ message: "Pendaftaran kolektif minimal 2 siswa" }), { status: 400 });
  }

  const today = new Date();
  const gelombangAktif = await prisma.gelombang.findFirst({
    where: { isActive: true, tanggalMulai: { lte: today }, tanggalSelesai: { gte: today } },
    include: { biaya: true },
  });
  if (!gelombangAktif) {
    return new Response(JSON.stringify({ message: "Pendaftaran sedang ditutup, tidak ada gelombang aktif." }), { status: 400 });
  }

  let totalTagihan = 0;
  for (const s of body.siswaList) {
    if (!s.namaSiswa || !s.nisn || !s.gender || !s.jenjang) {
      return new Response(JSON.stringify({ message: "Ada data siswa yang belum lengkap" }), { status: 400 });
    }
    const biaya = gelombangAktif.biaya.find((b) => b.jenjang === s.jenjang);
    if (!biaya) {
      return new Response(JSON.stringify({ message: `Biaya untuk jenjang ${s.jenjang} belum diatur` }), { status: 400 });
    }
    totalTagihan += Number(biaya.harga);
  }

  const batch = await prisma.pendaftaranBatch.create({
    data: {
      namaKoordinator: body.namaKoordinator,
      namaSekolah: body.namaSekolah,
      noWhatsapp: body.noWhatsapp,
      wilayahId: body.wilayahId,
      kecamatanId: body.kecamatanId,
      gelombangId: gelombangAktif.id,
    },
  });

  for (const s of body.siswaList) {
    await prisma.pendaftaran.create({
      data: {
        namaSiswa: s.namaSiswa,
        nisn: s.nisn,
        noWhatsapp: body.noWhatsapp,
        gender: s.gender,
        wilayahId: body.wilayahId,
        kecamatanId: body.kecamatanId,
        jenjang: s.jenjang,
        kelas: s.kelas || null,
        sekolahManual: body.namaSekolah,
        gelombangId: gelombangAktif.id,
        jenisPendaftaran: "kolektif",
        status: "pending",
        batchId: batch.id,
      },
    });
  }

  const invoice = await prisma.invoice.create({
    data: {
      batchId: batch.id,
      invoiceCode: generateInvoiceCode(),
      jumlahTagihan: totalTagihan,
      status: "menunggu_pembayaran",
    },
  });

  try {
    for (const s of body.siswaList) {
      const biaya = gelombangAktif.biaya.find((b) => b.jenjang === s.jenjang);
      await appendPendaftaranToSheet({
        namaSiswa: s.namaSiswa,
        nisn: s.nisn,
        noWhatsapp: body.noWhatsapp,
        gender: s.gender,
        jenjang: s.jenjang,
        sekolah: body.namaSekolah,
        gelombang: gelombangAktif.nama,
        invoiceCode: invoice.invoiceCode,
        biaya: Number(biaya?.harga ?? 0),
      });
    }
  } catch (err) {
    console.error("Gagal sync ke Sheets:", err);
  }

  return new Response(JSON.stringify({ invoiceCode: invoice.invoiceCode }), { status: 201 });
};