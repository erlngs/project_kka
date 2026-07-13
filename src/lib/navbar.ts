import { prisma } from "./prisma";

let cache: any[] | null = null;
let expired = 0;

export async function getNavbarMenu() {
  const now = Date.now();

  // cache 10 menit
  if (cache && now < expired) {
    return cache;
  }

  cache = await prisma.navMenu.findMany({
    where: { isActive: true },
    orderBy: { orderIndex: "asc" },
  });

  expired = now + 10 * 60 * 1000;

  return cache;
}