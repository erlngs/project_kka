import type { APIRoute } from "astro";
import { prisma } from "../../../../lib/prisma";

export const prerender = false;

export const GET: APIRoute = async () => {
  const setting = await prisma.setting.findUnique({ where: { key: "rekening" } });
  return new Response(
    JSON.stringify(
      setting ?? { bankNama: "", bankNorek: "", bankAtasNama: "" }
    ),
    { status: 200 }
  );
};

export const PUT: APIRoute = async ({ request }) => {
  const body = await request.json();

  const updated = await prisma.setting.upsert({
    where: { key: "rekening" },
    update: {
      bankNama: body.bankNama || null,
      bankNorek: body.bankNorek || null,
      bankAtasNama: body.bankAtasNama || null,
    },
    create: {
      key: "rekening",
      bankNama: body.bankNama || null,
      bankNorek: body.bankNorek || null,
      bankAtasNama: body.bankAtasNama || null,
    },
  });

  return new Response(JSON.stringify({ success: true, data: updated }), { status: 200 });
};