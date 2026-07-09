// scripts/seed-content.js
// Jalankan dengan: node scripts/seed-content.js
// Pastikan .env sudah ada (DATABASE_URL)

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Mulai seeding konten KKA 2026...\n");

  // ============================================================
  // 1. SITE SETTINGS
  // ============================================================
  console.log("⚙️  Seeding SiteSetting...");
  await prisma.siteSetting.upsert({
    where: { key: "site_name" },
    update: {},
    create: { key: "site_name", value: "KKA Jawa Pos Radar Kediri 2026" },
  });
  await prisma.siteSetting.upsert({
    where: { key: "site_description" },
    update: {},
    create: {
      key: "site_description",
      value:
        "KKA Radar Kediri 2026: Ajang kompetisi akademik bergengsi untuk siswa-siswi SD/MI, SMP/MTs, dan SMA/MA/SMK se-Karesidenan Kediri.",
    },
  });
  await prisma.siteSetting.upsert({
    where: { key: "contact_whatsapp" },
    update: {},
    create: { key: "contact_whatsapp", value: "" },
  });
  await prisma.siteSetting.upsert({
    where: { key: "social_instagram" },
    update: {},
    create: { key: "social_instagram", value: "" },
  });
  console.log("   ✅ SiteSetting selesai\n");

  // ============================================================
  // 2. NAV MENU
  // ============================================================
  console.log("📋 Seeding NavMenu...");

  // Hapus semua nav lama agar tidak duplikat
  await prisma.navMenu.deleteMany({});

  const navItems = [
    { label: "Beranda", linkType: "anchor", target: "#beranda", orderIndex: 0 },
    { label: "Tentang KKA", linkType: "internal_page", target: "tentang-kka", orderIndex: 1 },
    { label: "Informasi", linkType: "internal_page", target: "informasi", orderIndex: 2 },
    { label: "Regulasi", linkType: "internal_page", target: "regulasi", orderIndex: 3 },
    { label: "Galeri", linkType: "internal_page", target: "galeri", orderIndex: 4 },
    { label: "Daftar", linkType: "internal_page", target: "daftar", orderIndex: 5 },
  ];

  for (const item of navItems) {
    await prisma.navMenu.create({ data: item });
  }
  console.log("   ✅ NavMenu selesai\n");

  // ============================================================
  // 3. WILAYAH (7 wilayah dari referensi)
  // ============================================================
  console.log("🗺️  Seeding Wilayah...");

  const wilayahData = [
    {
      nama: "Kota Kediri",
      region: "Region 1",
      deskripsi:
        "Pusat kompetisi KKA 2026 wilayah Region 1. Ajang bergengsi bagi siswa terbaik Kota Kediri untuk mengukur kemampuan akademik dan meraih tiket menuju Grand Final.",
      orderIndex: 0,
      logoUrl: null,
    },
    {
      nama: "Kabupaten Kediri",
      region: "Region 1",
      deskripsi:
        "Kompetisi akademik untuk seluruh pelajar Kabupaten Kediri. Ukur kemampuanmu bersama ribuan siswa terbaik se-Region 1 dan buktikan prestasimu di panggung Grand Final.",
      orderIndex: 1,
      logoUrl: null,
    },
    {
      nama: "Kabupaten Nganjuk",
      region: "Region 2",
      deskripsi:
        "Wakili Kabupaten Nganjuk di KKA 2026! Bersaing dengan peserta terbaik Region 2 — Nganjuk, Kota Blitar, dan Kab. Blitar — dan tunjukkan kemampuan akademik terbaikmu.",
      orderIndex: 2,
      logoUrl: null,
    },
    {
      nama: "Kabupaten Blitar",
      region: "Region 2",
      deskripsi:
        "KKA 2026 hadir untuk pelajar Kabupaten Blitar! Bergabung dalam Region 2 bersama Kab. Nganjuk dan Kota Blitar. Asah kemampuan, raih medali, dan cetak prestasi terbaikmu.",
      orderIndex: 3,
      logoUrl: null,
    },
    {
      nama: "Kota Blitar",
      region: "Region 2",
      deskripsi:
        "Siswa Kota Blitar siap unjuk kemampuan di KKA 2026! Bersama peserta Region 2, buktikan bahwa pelajar Kota Blitar siap bersaing di tingkat regional hingga Grand Final.",
      orderIndex: 4,
      logoUrl: null,
    },
    {
      nama: "Kabupaten Tulungagung",
      region: "Region 3",
      deskripsi:
        "Pelajar Kabupaten Tulungagung kini punya kesempatan bersaing di Region 3 bersama Kab. Trenggalek. Jadikan KKA 2026 sebagai batu loncatan menuju sekolah atau kampus impianmu.",
      orderIndex: 5,
      logoUrl: null,
    },
    {
      nama: "Kabupaten Trenggalek",
      region: "Region 3",
      deskripsi:
        "KKA 2026 kini hadir di Kabupaten Trenggalek! Bergabung dalam Region 3 bersama Kab. Tulungagung dan tunjukkan bahwa pelajar Trenggalek siap bersaing di level terbaik.",
      orderIndex: 6,
      logoUrl: null,
    },
  ];

  for (const w of wilayahData) {
    const existing = await prisma.wilayah.findFirst({ where: { nama: w.nama } });
    if (!existing) {
      await prisma.wilayah.create({ data: w });
    } else {
      console.log(`   ⚠️  Wilayah "${w.nama}" sudah ada, skip.`);
    }
  }
  console.log("   ✅ Wilayah selesai\n");

  // ============================================================
  // 4. GELOMBANG & BIAYA PENDAFTARAN
  // ============================================================
  console.log("📅 Seeding Gelombang & Biaya...");

  const existingG1 = await prisma.gelombang.findFirst({ where: { nama: "Gelombang 1" } });
  let gelombang1 = existingG1;
  if (!existingG1) {
    gelombang1 = await prisma.gelombang.create({
      data: {
        nama: "Gelombang 1",
        tanggalMulai: new Date("2026-07-01"),
        tanggalSelesai: new Date("2026-07-31"),
        isActive: true,
      },
    });
  }

  const existingG2 = await prisma.gelombang.findFirst({ where: { nama: "Gelombang 2" } });
  let gelombang2 = existingG2;
  if (!existingG2) {
    gelombang2 = await prisma.gelombang.create({
      data: {
        nama: "Gelombang 2",
        tanggalMulai: new Date("2026-08-01"),
        tanggalSelesai: new Date("2026-08-31"),
        isActive: true,
      },
    });
  }

  // Biaya per gelombang per jenjang
  const biayaData = [
    // Gelombang 1
    { gelombangId: gelombang1.id, jenjang: "SD_MI",      harga: 75000 },
    { gelombangId: gelombang1.id, jenjang: "SMP_MTS",    harga: 85000 },
    { gelombangId: gelombang1.id, jenjang: "SMA_MA_SMK", harga: 95000 },
    // Gelombang 2
    { gelombangId: gelombang2.id, jenjang: "SD_MI",      harga: 90000 },
    { gelombangId: gelombang2.id, jenjang: "SMP_MTS",    harga: 100000 },
    { gelombangId: gelombang2.id, jenjang: "SMA_MA_SMK", harga: 110000 },
  ];

  for (const b of biayaData) {
    const existing = await prisma.biayaPendaftaran.findFirst({
      where: { gelombangId: b.gelombangId, jenjang: b.jenjang },
    });
    if (!existing) {
      await prisma.biayaPendaftaran.create({ data: b });
    }
  }
  console.log("   ✅ Gelombang & Biaya selesai\n");

  // ============================================================
  // 5. PAGES + BLOCKS
  // ============================================================
  console.log("📄 Seeding Pages & Blocks...");

  // Helper untuk upsert page + blocks
  async function seedPage(slug, title, metaDescription, blocks) {
    const existingPage = await prisma.page.findUnique({ where: { slug } });
    if (existingPage) {
      console.log(`   ⚠️  Halaman /${slug} sudah ada, skip.`);
      return;
    }

    const page = await prisma.page.create({
      data: { slug, title, metaDescription, isPublished: true },
    });

    for (let i = 0; i < blocks.length; i++) {
      await prisma.pageBlock.create({
        data: {
          pageId: page.id,
          blockType: blocks[i].blockType,
          content: blocks[i].content,
          orderIndex: i,
        },
      });
    }
    console.log(`   ✅ /${slug} (${blocks.length} blok)`);
  }

  // --- Halaman: Tentang KKA ---
  await seedPage(
    "tentang-kka",
    "Tentang KKA",
    "Kompetisi Kompetensi Akademik (KKA) 2026 Jawa Pos Radar Kediri — ajang bergengsi se-Karesidenan Kediri.",
    [
      {
        blockType: "heading",
        content: { text: "Tentang KKA 2026", level: "h1" },
      },
      {
        blockType: "paragraph",
        content: {
          text: "Kompetisi Kompetensi Akademik (KKA) adalah ajang kompetisi akademik bergengsi yang diselenggarakan oleh Jawa Pos Radar Kediri. KKA hadir untuk siswa-siswi jenjang SD/MI, SMP/MTs, dan SMA/MA/SMK se-Karesidenan Kediri.",
        },
      },
      {
        blockType: "heading",
        content: { text: "Visi & Misi", level: "h2" },
      },
      {
        blockType: "paragraph",
        content: {
          text: "KKA bertujuan menjadi wadah pengukur kemampuan akademik siswa secara objektif, sekaligus memberikan motivasi untuk terus berprestasi. Melalui kompetisi yang fair dan terstruktur, KKA mendorong siswa untuk mempersiapkan diri menghadapi seleksi masuk sekolah atau perguruan tinggi unggulan.",
        },
      },
      {
        blockType: "heading",
        content: { text: "Jenjang yang Dilombakan", level: "h2" },
      },
      {
        blockType: "paragraph",
        content: {
          text: "KKA 2026 membuka pendaftaran untuk tiga jenjang:\n\n• SD/MI: Siswa kelas IV, V, dan VI\n• SMP/MTs: Siswa kelas VIII dan IX\n• SMA/MA/SMK: Siswa kelas XI dan XII",
        },
      },
      {
        blockType: "image",
        content: { url: "", alt: "KKA 2026 Jawa Pos Radar Kediri", caption: "" },
      },
      {
        blockType: "cta_button",
        content: { text: "Daftar Sekarang", url: "/daftar", style: "primary" },
      },
    ]
  );

  // --- Halaman: Informasi ---
  await seedPage(
    "informasi",
    "Informasi KKA 2026",
    "Informasi lengkap seputar KKA 2026 — jadwal, lokasi ujian, materi soal, dan ketentuan peserta.",
    [
      {
        blockType: "heading",
        content: { text: "Informasi KKA 2026", level: "h1" },
      },
      {
        blockType: "heading",
        content: { text: "Materi Soal", level: "h2" },
      },
      {
        blockType: "paragraph",
        content: {
          text: "Jenjang SD/MI:\nMatematika, Bahasa Indonesia\n\nJenjang SMP/MTs:\nMatematika, Bahasa Indonesia\n\nJenjang SMA/MA/SMK:\nMatematika, Bahasa Indonesia, Bahasa Inggris, ditambah 2 mata pelajaran pilihan sesuai jurusan.",
        },
      },
      {
        blockType: "heading",
        content: { text: "Jadwal Pelaksanaan", level: "h2" },
      },
      {
        blockType: "paragraph",
        content: {
          text: "Informasi jadwal pelaksanaan ujian KKA 2026 akan segera diumumkan. Pantau terus halaman ini untuk update terbaru.",
        },
      },
      {
        blockType: "heading",
        content: { text: "Hadiah & Penghargaan", level: "h2" },
      },
      {
        blockType: "paragraph",
        content: {
          text: "Peserta KKA 2026 berkesempatan mendapatkan medali, sertifikat, dan berbagai hadiah menarik. Informasi detail hadiah akan segera diumumkan.",
        },
      },
      {
        blockType: "cta_button",
        content: { text: "Daftar Sekarang", url: "/daftar", style: "primary" },
      },
    ]
  );

  // --- Halaman: Regulasi ---
  await seedPage(
    "regulasi",
    "Regulasi KKA 2026",
    "Peraturan dan ketentuan resmi pelaksanaan KKA 2026 Jawa Pos Radar Kediri.",
    [
      {
        blockType: "heading",
        content: { text: "Regulasi KKA 2026", level: "h1" },
      },
      {
        blockType: "paragraph",
        content: {
          text: "Berikut adalah peraturan dan ketentuan resmi yang berlaku dalam pelaksanaan Kompetisi Kompetensi Akademik (KKA) 2026 Jawa Pos Radar Kediri.",
        },
      },
      {
        blockType: "heading",
        content: { text: "Syarat Peserta", level: "h2" },
      },
      {
        blockType: "paragraph",
        content: {
          text: "1. Peserta adalah siswa aktif jenjang SD/MI, SMP/MTs, atau SMA/MA/SMK\n2. Berdomisili atau bersekolah di wilayah Karesidenan Kediri (Kota Kediri, Kabupaten Kediri, Nganjuk, Blitar, Kota Blitar, Tulungagung, Trenggalek)\n3. Mendaftar sesuai jenjang yang ditempuh\n4. Melunasi biaya pendaftaran sesuai gelombang",
        },
      },
      {
        blockType: "heading",
        content: { text: "Ketentuan Ujian", level: "h2" },
      },
      {
        blockType: "paragraph",
        content: {
          text: "1. Peserta wajib hadir tepat waktu di lokasi ujian\n2. Membawa kartu peserta yang telah dicetak\n3. Dilarang menggunakan alat bantu apapun selama ujian berlangsung\n4. Keputusan panitia bersifat final dan tidak dapat diganggu gugat",
        },
      },
      {
        blockType: "heading",
        content: { text: "Ketentuan Penilaian", level: "h2" },
      },
      {
        blockType: "paragraph",
        content: {
          text: "Penilaian dilakukan secara objektif berdasarkan skor ujian. Peserta dengan skor tertinggi di masing-masing jenjang dan wilayah akan melaju ke babak Grand Final.",
        },
      },
      {
        blockType: "cta_button",
        content: { text: "Daftar Sekarang", url: "/daftar", style: "primary" },
      },
    ]
  );

  // --- Halaman: Galeri ---
  await seedPage(
    "galeri",
    "Galeri KKA",
    "Dokumentasi foto dan video kegiatan KKA Jawa Pos Radar Kediri.",
    [
      {
        blockType: "heading",
        content: { text: "Galeri KKA 2026", level: "h1" },
      },
      {
        blockType: "paragraph",
        content: {
          text: "Dokumentasi foto dan video kegiatan Kompetisi Kompetensi Akademik (KKA) Jawa Pos Radar Kediri.",
        },
      },
      {
        blockType: "gallery",
        content: { images: [], caption: "Dokumentasi KKA 2025" },
      },
    ]
  );

  console.log("\n🎉 Seeding selesai! Semua konten berhasil ditanam.\n");
  console.log("📝 Catatan:");
  console.log("   - Logo wilayah masih kosong, upload via admin → Wilayah");
  console.log("   - Gambar gallery masih kosong, upload via admin → Halaman → Galeri");
  console.log("   - Tanggal gelombang perlu disesuaikan via admin → (belum ada CRUD Gelombang)");
  console.log("   - Biaya pendaftaran perlu disesuaikan dengan harga asli\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed gagal:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
