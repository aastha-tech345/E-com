import { useNavigate, useParams } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Share2, Truck, RotateCcw, ShieldCheck, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Rating, StarRow } from "@/components/common/Rating";
import { Price } from "@/components/common/Price";
import { QuantitySelector } from "@/components/common/QuantitySelector";
import { ProductCard } from "@/components/common/ProductCard";
import { Header } from "@/components/customer/Header";
import { Footer } from "@/components/customer/Footer";
import { ShoppingAssistant } from "@/components/customer/ShoppingAssistant";
import { useShop } from "@/store/shop";
import { productService } from "@/services";
import { toast } from "sonner";

export const Route = createFileRoute("/products/$id")({
  component: ProductDetailsPage,
});

function ProductDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams({ from: "/products/$id" });
  const { addToCart, toggleWishlist, isWishlisted, markViewed } = useShop();

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  const product = productService.byId(id);

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Header />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h1>
          <Button onClick={() => navigate({ to: "/products" })} className="mt-4">
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  markViewed(product.id);

  const relatedProducts = productService
    .all()
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (product.colors.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }
    if (product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    addToCart(product.id, quantity, {
      color: selectedColor || undefined,
      size: selectedSize || undefined,
    });
    setQuantity(1);
  };

  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const inStock = product.stock - product.reserved > 0;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Breadcrumb */}
      <div className="border-b bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm">
          <button onClick={() => navigate({ to: "/" })} className="text-blue-600 hover:underline">
            Home
          </button>
          <ChevronRight className="w-4 h-4 text-gray-500" />
          <button
            onClick={() =>
              navigate({ to: "/products", search: { category: product.categorySlug } })
            }
            className="text-blue-600 hover:underline"
          >
            {product.category}
          </button>
          <ChevronRight className="w-4 h-4 text-gray-500" />
          <span className="text-gray-700">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div>
            <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 aspect-square flex items-center justify-center">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === idx ? "border-blue-600" : "border-gray-200"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${idx}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">{product.brand}</p>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <StarRow value={product.rating} size={16} />
                  <span className="text-sm text-gray-600">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-baseline gap-3 mb-2">
                <Price value={product.price} className="text-3xl font-bold" />
                <Price value={product.mrp} className="text-lg line-through text-gray-500" />
              </div>
              {discount > 0 && (
                <div className="text-red-600 font-semibold text-lg">{discount}% OFF</div>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              <p className={`font-semibold ${inStock ? "text-green-600" : "text-red-600"}`}>
                {inStock ? `${product.stock - product.reserved} in stock` : "Out of stock"}
              </p>
            </div>

            {/* Colors */}
            {product.colors.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Color</label>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border-2 text-sm font-medium ${
                        selectedColor === color
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Size</label>
                <div className="flex gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border-2 text-sm font-medium ${
                        selectedSize === size
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="mb-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Quantity</label>
                <QuantitySelector
                  value={quantity}
                  max={product.stock - product.reserved}
                  onChange={setQuantity}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleAddToCart}
                  disabled={!inStock}
                >
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => toggleWishlist(product.id)}
                  className={isWishlisted(product.id) ? "text-red-600" : ""}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted(product.id) ? "fill-current" : ""}`} />
                </Button>
              </div>

              <Button size="lg" variant="outline" className="w-full">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="space-y-3 border-t pt-6">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Free Delivery</p>
                  <p className="text-sm text-gray-600">On orders above ₹999</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCcw className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">7-Day Returns</p>
                  <p className="text-sm text-gray-600">Easy replacements</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">1 Year Warranty</p>
                  <p className="text-sm text-gray-600">Brand warranty included</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Tabs */}
        <div className="mb-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="border-b bg-transparent rounded-none w-full justify-start">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-blue-600"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="specifications"
                className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-blue-600"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-blue-600"
              >
                Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="py-6">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </TabsContent>

            <TabsContent value="specifications" className="py-6">
              <div className="space-y-4">
                {product.specifications?.map((spec, idx) => (
                  <div key={idx} className="flex border-b pb-3 last:border-0">
                    <span className="font-semibold text-gray-900 w-32">{spec.label}</span>
                    <span className="text-gray-700">{spec.value}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="py-6">
              <div className="space-y-4">
                <p className="text-gray-700">
                  {product.reviewCount} customer reviews • Average rating {product.rating}/5
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onProductClick={() => {
                    markViewed(p.id);
                    navigate({ to: "/products/$id", params: { id: p.id } });
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <ShoppingAssistant />
      <Footer />
    </div>
  );
}
