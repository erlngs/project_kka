import type { APIRoute } from "astro";
import { prisma } from "../../../../lib/prisma";

export const prerender = false;

export const PUT: APIRoute = async ({ params, request }) => {
  const body = await request.json();

  const updated = await prisma.navMenu.update({
    where: { id: params.id },
    data: {
      label: body.label,
      linkType: body.linkType,
      target: body.target,
      orderIndex: body.orderIndex ?? 0,
      isActive: body.isActive ?? true,
      parentId: body.parentId || null, // BARU
    },
  });

  return new Response(JSON.stringify(updated), { status: 200 });
};

export const DELETE: APIRoute = async ({ params }) => {
  await prisma.navMenu.delete({ where: { id: params.id } });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
};