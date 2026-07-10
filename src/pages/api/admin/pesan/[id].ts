import type { APIRoute } from "astro";
import { prisma } from "../../../../lib/prisma";

export const prerender = false;

export const PUT: APIRoute = async ({ params }) => {
  await prisma.pesan.update({ where: { id: params.id }, data: { isRead: true } });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
};