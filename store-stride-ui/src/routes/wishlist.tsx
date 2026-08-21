import { useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/customer/Header";
import { Footer } from "@/components/customer/Footer";
import { ShoppingAssistant } from "@/components/customer/ShoppingAssistant";
import { useShop } from "@/store/shop";
import { productService } from "@/services";
import { ProductCard } from "@/components/common/ProductCard";
import { EmptyState } from "@/components/common/EmptyState";

export const Route = createFileRoute("/wishlist")({
  component: WishlistPage,
});

function WishlistPage() {
  const navigate = useNavigate();
  const { wishlist, markViewed } = useShop();

  const wishlistProducts = wishlist
    .map((id) => productService.byId(id))
    .filter((p) => p !== undefined);

  const handleProductClick = (productId: string) => {
    markViewed(productId);
    navigate({ to: "/products/$id", params: { id: productId } });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
        <p className="text-gray-600 mb-8">
          {wishlistProducts.length} {wishlistProducts.length === 1 ? "item" : "items"}
        </p>

        {wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={() => handleProductClick(product.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Your wishlist is empty"
            description="Add products to your wishlist to save them for later"
            action={{
              label: "Start Shopping",
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
