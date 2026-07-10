import type { APIRoute } from "astro";
import { prisma } from "../../../../lib/prisma";

export const prerender = false;

export const PUT: APIRoute = async ({ params, request }) => {
  const body = await request.json();

  const updated = await prisma.page.update({
    where: { id: params.id },
    data: {
      slug: body.slug,
      title: body.title,
      metaDescription: body.metaDescription || null,
      heroSubtitle: body.heroSubtitle || null,     // ← Tambahkan ini
      heroImageUrl: body.heroImageUrl || null,     // ← Tambahkan ini
      isPublished: body.isPublished ?? true,
    },
  });

  return new Response(JSON.stringify(updated), { status: 200 });
};

export const DELETE: APIRoute = async ({ params }) => {
  await prisma.page.delete({ where: { id: params.id } });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
};