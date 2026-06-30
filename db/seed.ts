import { prisma } from "./prisma";
import sampleData from "./sample-data";

// 1) install prisma dapater for neon database
// const adapter = new PrismaNeon({
//   connectionString: process.env.DATABASE_URL!,
// });

// 2) create prisma object
// const prisma = new PrismaClient({ adapter });

async function main() {
  // 3) fist delete everything from our table for avoid duplicate data, then add new data to it
  await prisma.product.deleteMany();
  // 4) seed data to our table from sample data file or directly write data
  await prisma.product.createMany({ data: sampleData.products });
}

main();
