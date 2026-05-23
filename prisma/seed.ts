import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  const warehouse =
    await prisma.warehouse.create({
      data: {
        name: "Hyderabad Warehouse",
        location: "Hyderabad",
      },
    });

  const product =
    await prisma.product.create({
      data: {
        name: "iPhone 16",
        description: "Apple Phone",
      },
    });

  await prisma.inventory.create({
    data: {
      productId: product.id,
      warehouseId: warehouse.id,
      totalStock: 5,
      reservedStock: 0,
    },
  });

  console.log("Seed data inserted");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });