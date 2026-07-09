import type { APIRoute } from "astro";
import { prisma } from "../../../../../../lib/prisma";

export const prerender = false;

export const PUT: APIRoute = async ({ params, request }) => {
  const body = await request.json();

  const updated = await prisma.pageBlock.update({
    where: { id: params.blockId },
    data: { blockType: body.blockType, content: body.content },
  });

  return new Response(JSON.stringify(updated), { status: 200 });
};

export const DELETE: APIRoute = async ({ params }) => {
  await prisma.pageBlock.delete({ where: { id: params.blockId } });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
};