import type { APIRoute } from "astro";
import { prisma } from "../../../../lib/prisma";

export const prerender = false;

export const GET: APIRoute = async () => {
  const data = await prisma.page.findMany({ orderBy: { createdAt: "desc" } });
  return new Response(JSON.stringify(data), { status: 200 });
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();

  if (!body.slug || !body.title) {
    return new Response(JSON.stringify({ message: "Slug dan judul wajib diisi" }), { status: 400 });
  }

  const created = await prisma.page.create({
    data: {
      slug: body.slug,
      title: body.title,
      metaDescription: body.metaDescription || null,
      isPublished: body.isPublished ?? true,
    },
  });

  return new Response(JSON.stringify(created), { status: 201 });
};