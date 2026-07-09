import type { APIRoute } from "astro";
import { prisma } from "../../../../../../lib/prisma";

export const prerender = false;

export const POST: APIRoute = async ({ params, request }) => {
  const body = await request.json();

  const lastBlock = await prisma.pageBlock.findFirst({
    where: { pageId: params.id },
    orderBy: { orderIndex: "desc" },
  });

  const created = await prisma.pageBlock.create({
    data: {
      pageId: params.id!,
      blockType: body.blockType,
      content: body.content,
      orderIndex: (lastBlock?.orderIndex ?? -1) + 1,
    },
  });

  return new Response(JSON.stringify(created), { status: 201 });
};