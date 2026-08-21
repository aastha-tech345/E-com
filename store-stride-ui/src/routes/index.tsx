import { useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Zap, Truck, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/common/ProductCard";
import { Header } from "@/components/customer/Header";
import { Footer } from "@/components/customer/Footer";
import { ShoppingAssistant } from "@/components/customer/ShoppingAssistant";
import { useShop } from "@/store/shop";
import { productService } from "@/services";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const { markViewed } = useShop();

  const { data: featured = [] } = useQuery({
    queryKey: ["featured"],
    queryFn: () => productService.featured(),
  });
  
  const { data: trending = [] } = useQuery({
    queryKey: ["trending"],
    queryFn: () => productService.trending(),
  });
  
  const { data: bestSellers = [] } = useQuery({
    queryKey: ["bestSellers"],
    queryFn: () => productService.bestSellers(),
  });
  
  const { data: deals = [] } = useQuery({
    queryKey: ["deals"],
    queryFn: () => productService.deals(),
  });

  const handleProductClick = (productId: string) => {
    markViewed(productId);
    navigate({ to: "/products/$id", params: { id: productId } });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Your Daily Shopping Companion
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8">
              Discover millions of products at unbeatable prices. From electronics to fashion, everything you need is here.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate({ to: "/products" })}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Shop Now <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-white border-white hover:bg-white/10"
                onClick={() => navigate({ to: "/products", search: { category: "electronics" } })}
              >
                Explore Electronics
              </Button>
            </div>
          </div>
          <div className="flex-1 hidden md:block">
            <div className="bg-white/10 rounded-lg p-8 h-64 flex items-center justify-center">
              <div className="text-center">
                <Zap className="w-24 h-24 mx-auto mb-4 text-yellow-300" />
                <p className="text-lg font-semibold">Mega Deals Today</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <Truck className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Free Delivery</h3>
                <p className="text-sm text-gray-600">On orders above ₹999</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <RotateCcw className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">7-Day Returns</h3>
                <p className="text-sm text-gray-600">Easy replacements</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Zap className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">100% Authentic</h3>
                <p className="text-sm text-gray-600">Guaranteed products</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Products</h2>
            <Button
              variant="ghost"
              onClick={() => navigate({ to: "/products" })}
              className="text-blue-600 hover:text-blue-700"
            >
              View All <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={() => handleProductClick(product.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Trending Now</h2>
            <Button
              variant="ghost"
              onClick={() => navigate({ to: "/products", search: { sort: "trending" } })}
              className="text-blue-600 hover:text-blue-700"
            >
              View All <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trending.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={() => handleProductClick(product.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Best Sellers</h2>
            <Button
              variant="ghost"
              onClick={() => navigate({ to: "/products", search: { sort: "best-seller" } })}
              className="text-blue-600 hover:text-blue-700"
            >
              View All <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={() => handleProductClick(product.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Deals Section */}
      <section className="py-12 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">🔥 Hot Deals</h2>
              <p className="text-gray-600 mt-1">Limited time offers</p>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate({ to: "/products", search: { sort: "deals" } })}
              className="text-blue-600 hover:text-blue-700"
            >
              View All <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {deals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={() => handleProductClick(product.id)}
              />
            ))}
          </div>
        </div>
      </section>

      <ShoppingAssistant />
      <Footer />
    </div>
  );
}
