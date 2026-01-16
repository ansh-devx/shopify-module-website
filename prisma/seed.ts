require("dotenv").config({ path: ".env" });

const { PrismaClient, UserRole } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Example: Promote a user to superadmin
  // Replace with your actual email
  const email = process.env.SUPERADMIN_EMAIL || "admin@example.com";

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      const updated = await prisma.user.update({
        where: { email },
        data: { role: UserRole.SUPERADMIN },
      });
      console.log(`✅ Promoted ${email} to SUPERADMIN`);
      console.log(updated);
    } else {
      console.log(`⚠️  User with email ${email} not found`);
      console.log("   Please sign in first, then run this seed script again");
    }
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
