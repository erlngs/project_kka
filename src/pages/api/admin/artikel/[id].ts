import type { APIRoute } from "astro";
import { prisma } from "../../../../lib/prisma";

export const prerender = false;

export const PUT: APIRoute = async ({ params, request }) => {
  const body = await request.json();
  const existing = await prisma.article.findUnique({ where: { id: params.id } });

  const updated = await prisma.article.update({
    where: { id: params.id },
    data: {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt || null,
      category: body.category || null,
      author: body.author || null,
      thumbnail: body.thumbnail || null,
      content: body.content,
      tags: body.tags || null,
      metaDescription: body.metaDescription || null,
      publishedAt: body.isPublished ? (existing?.publishedAt ?? new Date()) : null,
    },
  });

  return new Response(JSON.stringify(updated), { status: 200 });
};

export const DELETE: APIRoute = async ({ params }) => {
  await prisma.article.delete({ where: { id: params.id } });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
};