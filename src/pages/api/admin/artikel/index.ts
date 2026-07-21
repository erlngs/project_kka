import type { APIRoute } from "astro";
import { prisma } from "../../../../lib/prisma";

export const prerender = false;

export const GET: APIRoute = async () => {
  const data = await prisma.article.findMany({ orderBy: { createdAt: "desc" } });
  return new Response(JSON.stringify(data), { status: 200 });
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();

  if (!body.title || !body.slug || !body.content) {
    return new Response(JSON.stringify({ message: "Judul, slug, dan konten wajib diisi" }), { status: 400 });
  }

  const created = await prisma.article.create({
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
      publishedAt: body.isPublished ? new Date() : null,
    },
  });

  return new Response(JSON.stringify(created), { status: 201 });
};