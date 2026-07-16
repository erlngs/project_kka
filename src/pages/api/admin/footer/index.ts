import type { APIRoute } from "astro";
import { prisma } from "../../../../lib/prisma";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    const result = await prisma.setting.upsert({
      where: {
        key: "footer",
      },
      update: {
        footerText: body.footerText,
        footerLogo: body.footerLogo,
        whatsapp: body.whatsapp,
        email: body.email,
        alamat: body.alamat,
        jamOperasional: body.jamOperasional,
        instagramUrl: body.instagramUrl,
        facebookUrl: body.facebookUrl,
        tiktokUrl: body.tiktokUrl,
        youtubeUrl: body.youtubeUrl,
        copyright: body.copyright,
      },
      create: {
        key: "footer",
        footerText: body.footerText,
        footerLogo: body.footerLogo,
        whatsapp: body.whatsapp,
        email: body.email,
        alamat: body.alamat,
        jamOperasional: body.jamOperasional,
        instagramUrl: body.instagramUrl,
        facebookUrl: body.facebookUrl,
        tiktokUrl: body.tiktokUrl,
        youtubeUrl: body.youtubeUrl,
        copyright: body.copyright,
      },
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error(err);

    return new Response(
      JSON.stringify({
        error: String(err),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};