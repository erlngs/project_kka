import type { APIRoute } from "astro";
import { prisma } from "../../../../../../../lib/prisma";

export const prerender = false;

export const POST: APIRoute = async ({ params, request }) => {
  const { direction } = await request.json(); // "up" | "down"

  const current = await prisma.pageBlock.findUnique({ where: { id: params.blockId } });
  if (!current) return new Response(JSON.stringify({ message: "Blok tidak ditemukan" }), { status: 404 });

  const target = await prisma.pageBlock.findFirst({
    where: {
      pageId: current.pageId,
      orderIndex: direction === "up" ? { lt: current.orderIndex } : { gt: current.orderIndex },
    },
    orderBy: { orderIndex: direction === "up" ? "desc" : "asc" },
  });

  if (!target) return new Response(JSON.stringify({ success: true })); // udah paling atas/bawah

  await prisma.$transaction([
    prisma.pageBlock.update({ where: { id: current.id }, data: { orderIndex: target.orderIndex } }),
    prisma.pageBlock.update({ where: { id: target.id }, data: { orderIndex: current.orderIndex } }),
  ]);

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};