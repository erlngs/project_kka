import type { APIRoute } from "astro";
import { prisma } from "../../../../lib/prisma";

export const prerender = false;

export const GET: APIRoute = async () => {
  const data = await prisma.navMenu.findMany({ orderBy: { orderIndex: "asc" } });
  return new Response(JSON.stringify(data), { status: 200 });
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();

  if (!body.label || !body.target) {
    return new Response(JSON.stringify({ message: "Label dan target wajib diisi" }), { status: 400 });
  }

  const created = await prisma.navMenu.create({
    data: {
      label: body.label,
      linkType: body.linkType,
      target: body.target,
      orderIndex: body.orderIndex ?? 0,
      isActive: body.isActive ?? true,
    },
  });

  return new Response(JSON.stringify(created), { status: 201 });
};