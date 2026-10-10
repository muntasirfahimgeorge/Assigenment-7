const BASE_URLS = [
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

async function fetchList<T>(resource: "products" | "categories"): Promise<T[]> {
  let cause: unknown;
  for (const baseURL of BASE_URLS) {
    try {
      const response = await fetch(`${baseURL}/${resource}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) throw new Error(`API returned ${response.status}`);
      const data: unknown = await response.json();
      if (!Array.isArray(data)) throw new Error("API response must be a list");
      return data as T[];
    } catch (error) {
      cause = error;
    }
  }
  throw new Error(`Failed to fetch ${resource}`, { cause });
}

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
  return fetchList<Product>("products");
}

export async function getProduct(slug: string): Promise<Product> {
  const products = await getProducts();

  const product = products.find((item) => item.slug === slug);

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
}

export async function getCategories(): Promise<Omit<Category, "products">[]> {
  return fetchList<Omit<Category, "products">>("categories");
}

export async function getCategory(slug: string): Promise<Category> {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  const category = categories.find(
    (item: { id: string; slug: string; nameBn: string; icon: string }) =>
      item.slug === slug || item.id === slug,
  );

  if (!category) {
    throw new Error("Category not found");
  }

  const categoryProducts = products.filter(
    (product) =>
      product.category === category.id || product.category === category.slug,
  );

  return {
    ...category,
    products: categoryProducts,
  };
}
