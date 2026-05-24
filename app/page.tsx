import { prisma } from "@/lib/prisma";

async function getProducts() {
  return prisma.product.findMany({
    include: {
      inventory: {
        include: {
          warehouse: true,
        },
      },
    },
  });
}

export default async function Home() {

  const products = await getProducts();

  return (
    <main className="p-10">

      <h1 className="text-3xl font-bold mb-8">
        Inventory System
      </h1>

      <div className="grid gap-6">

        {products.map((product) => {

          const inventory =
            product.inventory[0];

          const available =
            inventory.totalStock -
            inventory.reservedStock;

          return (
            <div
              key={product.id}
              className="border p-6 rounded-lg"
            >

              <h2 className="text-2xl font-semibold">
                {product.name}
              </h2>

              <p>
                {product.description}
              </p>

              <p className="mt-2">
                Warehouse:
                {" "}
                {inventory.warehouse.name}
              </p>

              <p>
                Location:
                {" "}
                {inventory.warehouse.location}
              </p>

              <p>
                Total Stock:
                {" "}
                {inventory.totalStock}
              </p>

              <p>
                Reserved Stock:
                {" "}
                {inventory.reservedStock}
              </p>

              <p className="font-bold">
                Available:
                {" "}
                {available}
              </p>

            </div>
          );
        })}

      </div>

    </main>
  );
}