import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);
  await prisma.adminUser.create({
    data: {
      email: "admin@kkakediri.com",
      passwordHash,
      role: "superadmin",
    },
  });
  console.log("Admin berhasil dibuat");
}

main().then(() => process.exit(0));