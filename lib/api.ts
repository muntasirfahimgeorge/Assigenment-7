const BASE_URL =
  "https://api.api-store.workers.dev/api/bazardor";

export type Market = {
  market: string;
  division: string;
  min: number;
  max: number;
};

export type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: "kg" | "litre" | "dozen" | "piece";
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
  markets: Market[];
};

export type Category = {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
  products: Product[];
};

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${BASE_URL}/products`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}

export async function getProduct(
  slug: string,
): Promise<Product> {
  const products = await getProducts();

  const product = products.find(
    (item) => item.slug === slug,
  );

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
}

export async function getCategories() {
  const response = await fetch(
    `${BASE_URL}/categories`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return response.json();
}

export async function getCategory(
  slug: string,
): Promise<Category> {
  const [categories, products] =
    await Promise.all([
      getCategories(),
      getProducts(),
    ]);

  const category = categories.find(
    (item: {
      id: string;
      slug: string;
      nameBn: string;
      icon: string;
    }) =>
      item.slug === slug || item.id === slug,
  );

  if (!category) {
    throw new Error("Category not found");
  }

  const categoryProducts = products.filter(
    (product) => product.category === slug,
  );

  return {
    ...category,
    products: categoryProducts,
  };
}