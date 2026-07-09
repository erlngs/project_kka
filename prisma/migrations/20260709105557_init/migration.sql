-- CreateEnum
CREATE TYPE "LinkType" AS ENUM ('internal_page', 'external_url', 'anchor');

-- CreateEnum
CREATE TYPE "BlockType" AS ENUM ('heading', 'paragraph', 'image', 'gallery', 'table', 'testimonial', 'cta_button', 'hero');

-- CreateEnum
CREATE TYPE "Jenjang" AS ENUM ('SD_MI', 'SMP_MTS', 'SMA_MA_SMK');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('L', 'P');

-- CreateEnum
CREATE TYPE "JenisPendaftaran" AS ENUM ('mandiri', 'kolektif');

-- CreateEnum
CREATE TYPE "StatusPendaftaran" AS ENUM ('pending', 'menunggu_verifikasi', 'lunas', 'ditolak', 'dibatalkan');

-- CreateEnum
CREATE TYPE "StatusInvoice" AS ENUM ('menunggu_pembayaran', 'menunggu_verifikasi', 'terverifikasi', 'ditolak');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('admin', 'superadmin');

-- CreateTable
CREATE TABLE "nav_menu" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "link_type" "LinkType" NOT NULL,
    "target" TEXT NOT NULL,
    "parent_id" TEXT,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nav_menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pages" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "meta_description" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_blocks" (
    "id" TEXT NOT NULL,
    "page_id" TEXT NOT NULL,
    "block_type" "BlockType" NOT NULL,
    "content" JSONB NOT NULL DEFAULT '{}',
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "page_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_settings" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "wilayah" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "region" TEXT,
    "logo_url" TEXT,
    "deskripsi" TEXT,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "wilayah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kecamatan" (
    "id" TEXT NOT NULL,
    "wilayah_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "kecamatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sekolah" (
    "id" TEXT NOT NULL,
    "kecamatan_id" TEXT,
    "nama" TEXT NOT NULL,
    "jenjang" "Jenjang",
    "npsn" TEXT,

    CONSTRAINT "sekolah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gelombang" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "tanggal_mulai" DATE NOT NULL,
    "tanggal_selesai" DATE NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "gelombang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "biaya_pendaftaran" (
    "id" TEXT NOT NULL,
    "gelombang_id" TEXT NOT NULL,
    "jenjang" "Jenjang" NOT NULL,
    "harga" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "biaya_pendaftaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pendaftaran" (
    "id" TEXT NOT NULL,
    "nama_siswa" TEXT NOT NULL,
    "nisn" TEXT NOT NULL,
    "no_whatsapp" TEXT NOT NULL,
    "gender" "Gender",
    "wilayah_id" TEXT,
    "kecamatan_id" TEXT,
    "jenjang" "Jenjang",
    "kelas" TEXT,
    "sekolah_id" TEXT,
    "sekolah_manual" TEXT,
    "gelombang_id" TEXT,
    "jenis_pendaftaran" "JenisPendaftaran" NOT NULL DEFAULT 'mandiri',
    "status" "StatusPendaftaran" NOT NULL DEFAULT 'pending',
    "synced_to_sheet" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pendaftaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "pendaftaran_id" TEXT NOT NULL,
    "invoice_code" TEXT NOT NULL,
    "jumlah_tagihan" DECIMAL(12,2) NOT NULL,
    "metode_pembayaran" TEXT,
    "bukti_pembayaran_url" TEXT,
    "status" "StatusInvoice" NOT NULL DEFAULT 'menunggu_pembayaran',
    "dikonfirmasi_oleh" TEXT,
    "dikonfirmasi_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "nama" TEXT,
    "role" "AdminRole" NOT NULL DEFAULT 'admin',

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pages_slug_key" ON "pages"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "biaya_pendaftaran_gelombang_id_jenjang_key" ON "biaya_pendaftaran"("gelombang_id", "jenjang");

-- CreateIndex
CREATE INDEX "pendaftaran_status_idx" ON "pendaftaran"("status");

-- CreateIndex
CREATE INDEX "pendaftaran_synced_to_sheet_idx" ON "pendaftaran"("synced_to_sheet");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_pendaftaran_id_key" ON "invoices"("pendaftaran_id");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoice_code_key" ON "invoices"("invoice_code");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- AddForeignKey
ALTER TABLE "nav_menu" ADD CONSTRAINT "nav_menu_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "nav_menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_blocks" ADD CONSTRAINT "page_blocks_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kecamatan" ADD CONSTRAINT "kecamatan_wilayah_id_fkey" FOREIGN KEY ("wilayah_id") REFERENCES "wilayah"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sekolah" ADD CONSTRAINT "sekolah_kecamatan_id_fkey" FOREIGN KEY ("kecamatan_id") REFERENCES "kecamatan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "biaya_pendaftaran" ADD CONSTRAINT "biaya_pendaftaran_gelombang_id_fkey" FOREIGN KEY ("gelombang_id") REFERENCES "gelombang"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pendaftaran" ADD CONSTRAINT "pendaftaran_wilayah_id_fkey" FOREIGN KEY ("wilayah_id") REFERENCES "wilayah"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pendaftaran" ADD CONSTRAINT "pendaftaran_kecamatan_id_fkey" FOREIGN KEY ("kecamatan_id") REFERENCES "kecamatan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pendaftaran" ADD CONSTRAINT "pendaftaran_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "sekolah"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pendaftaran" ADD CONSTRAINT "pendaftaran_gelombang_id_fkey" FOREIGN KEY ("gelombang_id") REFERENCES "gelombang"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_pendaftaran_id_fkey" FOREIGN KEY ("pendaftaran_id") REFERENCES "pendaftaran"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_dikonfirmasi_oleh_fkey" FOREIGN KEY ("dikonfirmasi_oleh") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
