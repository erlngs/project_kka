export async function appendPendaftaranToSheet(data: {
  namaSiswa: string;
  nisn: string;
  noWhatsapp: string;
  gender: string;
  jenjang: string;
  sekolah: string;
  gelombang: string;
  invoiceCode: string;
  biaya: number;
}) {
  const url = import.meta.env.GOOGLE_APPS_SCRIPT_URL;
  if (!url) throw new Error("GOOGLE_APPS_SCRIPT_URL belum diset");

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain" }, // Apps Script kadang strict soal content-type, text/plain paling aman
    body: JSON.stringify({
      waktu: new Date().toLocaleString("id-ID"),
      ...data,
    }),
  });

  if (!res.ok) {
    throw new Error(`Gagal sync ke Sheets: ${res.status}`);
  }
}