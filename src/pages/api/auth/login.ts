import type { APIRoute } from "astro";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  const { email, password } = await request.json();

  const admin = await prisma.adminUser.findUnique({ where: { email } });

  if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
    return new Response(
      JSON.stringify({ success: false, message: "Email atau password salah" }),
      { status: 401 }
    );
  }

  const token = jwt.sign(
    { id: admin.id, role: admin.role },
    import.meta.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  cookies.set("admin_token", token, {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};