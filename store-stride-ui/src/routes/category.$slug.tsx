import { useNavigate, useParams } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/customer/Header";
import { Footer } from "@/components/customer/Footer";
import { useShop } from "@/store/shop";
import { productService } from "@/services";
import { categories } from "@/data/catalog";
import { ProductCard } from "@/components/common/ProductCard";
import { EmptyState } from "@/components/common/EmptyState";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/category/$slug")({
  component: CategoryPage,
});

function CategoryPage() {
  const navigate = useNavigate();
  const { slug } = useParams({ from: "/category/$slug" });
  const { markViewed } = useShop();

  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center py-12">
          <EmptyState
            title="Category not found"
            description="The category you're looking for doesn't exist"
            action={{
              label: "Back to Shopping",
              onClick: () => navigate({ to: "/products" }),
            }}
          />
        </div>
        <Footer />
      </div>
    );
  }

  const products = productService
    .all()
    .filter((p) => p.categorySlug === category.slug && p.status === "active");

  const handleProductClick = (productId: string) => {
    markViewed(productId);
    navigate({ to: "/products/$id", params: { id: productId } });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-start gap-4">
            <img
              src={category.image}
              alt={category.name}
              className="w-24 h-24 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
              <p className="text-blue-100 mb-4">{category.description}</p>
              <p className="text-blue-100">{products.length} products available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="border-b bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm">
          <button onClick={() => navigate({ to: "/" })} className="text-blue-600 hover:underline">
            Home
          </button>
          <ChevronRight className="w-4 h-4 text-gray-500" />
          <span className="text-gray-700">{category.name}</span>
        </div>
      </div>

      {/* Subcategories */}
      {category.subcategories.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Subcategories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {category.subcategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() =>
                  navigate({
                    to: "/products",
                    search: { category: category.slug },
                  })
                }
                className="p-4 border rounded-lg hover:border-blue-600 hover:bg-blue-50 transition text-center"
              >
                <p className="font-semibold text-gray-900">{sub.name}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">All Products</h2>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={() => handleProductClick(product.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No products in this category"
            description="Check back soon for new products"
            action={{
              label: "Browse Other Categories",
              onClick: () => navigate({ to: "/products" }),
            }}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}
