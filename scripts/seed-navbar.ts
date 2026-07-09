import { prisma } from "../src/lib/prisma";

async function main() {
  await prisma.navMenu.createMany({
    data: [
      { label: "Tentang Kami", linkType: "internal_page", target: "tentang-kami", orderIndex: 0 },
      { label: "Informasi", linkType: "internal_page", target: "informasi", orderIndex: 1 },
      { label: "Regulasi", linkType: "internal_page", target: "regulasi", orderIndex: 2 },
      { label: "Galeri", linkType: "internal_page", target: "galeri", orderIndex: 3 },
      { label: "Kontak", linkType: "anchor", target: "#kontak", orderIndex: 4 },
    ],
  });
  console.log("Navbar seeded");
}

main().then(() => process.exit(0));