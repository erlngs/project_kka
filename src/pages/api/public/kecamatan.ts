import type { APIRoute } from "astro";
import { prisma } from "../../../lib/prisma";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const wilayahId = url.searchParams.get("wilayahId");
  if (!wilayahId) return new Response(JSON.stringify([]), { status: 200 });

  const data = await prisma.kecamatan.findMany({
    where: { wilayahId },
    orderBy: { nama: "asc" },
  });
  return new Response(JSON.stringify(data), { status: 200 });
};