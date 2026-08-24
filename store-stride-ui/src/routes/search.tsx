import { useNavigate, useSearch } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/customer/Header";
import { Footer } from "@/components/customer/Footer";
import { ShoppingAssistant } from "@/components/customer/ShoppingAssistant";
import { useShop } from "@/store/shop";
import { productService } from "@/services";
import { ProductCard } from "@/components/common/ProductCard";
import { EmptyState } from "@/components/common/EmptyState";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: (search.q as string) || "",
  }),
  component: SearchPage,
});

function SearchPage() {
  const navigate = useNavigate();
  const { q } = useSearch({ from: "/search" });
  const { markViewed, addRecentSearch } = useShop();

  useEffect(() => {
    if (q.trim()) addRecentSearch(q);
  }, [addRecentSearch, q]);

  const { data, isPending } = useQuery({
    queryKey: ["search", q],
    enabled: Boolean(q.trim()),
    queryFn: () => productService.list({ search: q, page: 1, perPage: 50 }),
  });
  const results = data?.items || [];

  const handleProductClick = (productId: string) => {
    markViewed(productId);
    navigate({ to: "/products/$id", params: { id: productId } });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Results</h1>
        <p className="text-gray-600 mb-8">
          {results.length} results found for "{q}"
        </p>

        {isPending ? (
          <div className="py-12 text-center text-sm text-gray-500">Searching the catalogue...</div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {results.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={() => handleProductClick(product.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No products found"
            description={`We couldn't find any products matching "${q}"`}
            action={{
              label: "Browse All Products",
              onClick: () => navigate({ to: "/products" }),
            }}
          />
        )}
      </div>

      <ShoppingAssistant />
      <Footer />
    </div>
  );
}
