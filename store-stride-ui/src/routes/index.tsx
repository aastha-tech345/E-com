import { useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ShieldCheck, Sparkles, Star, Truck, RotateCcw } from "lucide-react";
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
    <div className="min-h-screen bg-[#fcfaf6]">
      <Header />

      {/* Hero Banner */}
      <section className="relative overflow-hidden border-b border-stone-200 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.18),_transparent_28%),linear-gradient(135deg,#122033_0%,#1f3045_48%,#2f4b68_100%)] text-white">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.04)_50%,transparent_100%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-[1.2fr_0.8fr] md:py-24 lg:items-center">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-white/15 bg-white/8 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">
              Premium marketplace
            </p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              Timeless essentials for a smarter, more elegant way to shop.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
              ShopNest brings together elevated fashion, trusted electronics, beauty, and home picks with dependable service and curated value.
            </p>
            <div className="mt-8 flex gap-4 flex-wrap">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate({ to: "/products" })}
                className="rounded-full bg-amber-400 px-7 text-slate-950 hover:bg-amber-300"
              >
                Explore Collection <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="rounded-full border border-white/20 bg-white/5 text-white hover:bg-white/10"
                onClick={() => navigate({ to: "/products", search: { category: "electronics" } })}
              >
                Shop Electronics
              </Button>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { value: "50K+", label: "curated shoppers" },
                { value: "1K+", label: "trusted brands" },
                { value: "4.8/5", label: "average rating" },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/10 bg-white/6 px-5 py-4 backdrop-blur">
                  <p className="text-2xl font-semibold text-white">{item.value}</p>
                  <p className="mt-1 text-sm text-slate-300">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden md:block">
            <div className="rounded-[32px] border border-white/10 bg-white/8 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.28)] backdrop-blur">
              <div className="rounded-[28px] bg-[#f8f3e7] p-6 text-slate-900">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">Editor’s pick</p>
                    <h2 className="mt-2 text-2xl font-bold">Classic living, modern utility</h2>
                  </div>
                  <div className="rounded-full bg-white p-3 shadow-sm">
                    <Sparkles className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
                <div className="mt-8 grid gap-4">
                  {[
                    "Handpicked arrivals refreshed daily",
                    "Exclusive offers on premium essentials",
                    "Fast delivery with reliable after-sales support",
                  ].map((line) => (
                    <div key={line} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
                      <Star className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-medium text-slate-700">{line}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-[28px] border border-stone-200 bg-white px-6 py-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
              <div className="flex items-center gap-4">
                <Truck className="h-8 w-8 text-amber-700" />
                <div>
                  <h3 className="font-semibold text-slate-900">Free Delivery</h3>
                  <p className="text-sm text-slate-600">On orders above ₹999</p>
                </div>
              </div>
            </div>
            <div className="rounded-[28px] border border-stone-200 bg-white px-6 py-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
              <div className="flex items-center gap-4">
                <RotateCcw className="h-8 w-8 text-amber-700" />
                <div>
                  <h3 className="font-semibold text-slate-900">7-Day Returns</h3>
                  <p className="text-sm text-slate-600">Easy replacements</p>
                </div>
              </div>
            </div>
            <div className="rounded-[28px] border border-stone-200 bg-white px-6 py-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
              <div className="flex items-center gap-4">
                <ShieldCheck className="h-8 w-8 text-amber-700" />
                <div>
                  <h3 className="font-semibold text-slate-900">100% Authentic</h3>
                  <p className="text-sm text-slate-600">Guaranteed products</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">Best of ShopNest</p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Featured Products</h2>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate({ to: "/products" })}
              className="rounded-full text-slate-700 hover:text-slate-950"
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
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">Fresh demand</p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Trending Now</h2>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate({ to: "/products", search: { sort: "trending" } })}
              className="rounded-full text-slate-700 hover:text-slate-950"
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
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">Customer favorites</p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Best Sellers</h2>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate({ to: "/products", search: { sort: "best-seller" } })}
              className="rounded-full text-slate-700 hover:text-slate-950"
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
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-800">Limited-time selection</p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Hot Deals</h2>
              <p className="mt-1 text-slate-600">Exceptional value on standout picks</p>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate({ to: "/products", search: { sort: "deals" } })}
              className="rounded-full text-slate-700 hover:text-slate-950"
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
