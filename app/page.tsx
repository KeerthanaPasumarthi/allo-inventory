import ReserveButton from "./ReserveButton";
async function getProducts() {

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`,
    {
      cache: "no-store",
    }
  );

  return res.json();
}

export default async function Home() {

  const products = await getProducts();

  return (
    <main className="p-10">

      <h1 className="text-3xl font-bold mb-8">
        Allo Inventory System
      </h1>

      <div className="grid gap-6">

        {products.map((product: any) => (

          <div
            key={product.id}
            className="border p-5 rounded-lg"
          >

            <h2 className="text-2xl font-semibold">
              {product.name}
            </h2>

            <p className="mb-4">
              {product.description}
            </p>

            {product.inventory.map((item: any) => (

              <div
                key={item.id}
                className="border-t pt-3 mt-3"
              >

                <p>
                  Warehouse:
                  {" "}
                  {item.warehouse.name}
                </p>

                <p>
                  Location:
                  {" "}
                  {item.warehouse.location}
                </p>

                <p>
                  Total Stock:
                  {" "}
                  {item.totalStock}
                </p>

                <p>
                  Reserved Stock:
                  {" "}
                  {item.reservedStock}
                </p>

                <p className="font-bold">
                  Available:
                  {" "}
                  {item.totalStock - item.reservedStock}
                </p>

                <ReserveButton
  productId={product.id}
  warehouseId={item.warehouse.id}
/>

              </div>
            ))}

          </div>
        ))}

      </div>

    </main>
  );
}