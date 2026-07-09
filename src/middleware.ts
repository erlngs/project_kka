import { defineMiddleware } from "astro:middleware";
import jwt from "jsonwebtoken";

export const onRequest = defineMiddleware(async (context, next) => {
  const isAdminRoute = context.url.pathname.startsWith("/admin");
  const isLoginPage = context.url.pathname === "/admin/login";

  if (isAdminRoute && !isLoginPage) {
    const token = context.cookies.get("admin_token")?.value;
    if (!token) return context.redirect("/admin/login");

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
        email: string;
        role: string;
      };
      context.locals.admin = payload;
    } catch {
      return context.redirect("/admin/login");
    }
  }

  return next();
});