import { useNavigate, useSearch } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Filter, Grid3x3, List, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/common/ProductCard";
import { Header } from "@/components/customer/Header";
import { Footer } from "@/components/customer/Footer";
import { ShoppingAssistant } from "@/components/customer/ShoppingAssistant";
import { useShop } from "@/store/shop";
import { productService } from "@/services";
import { categories, brands } from "@/data/catalog";
import { EmptyState } from "@/components/common/EmptyState";

export const Route = createFileRoute("/products/")({
  validateSearch: (search: Record<string, unknown>) => ({
    search: (search.search as string) || "",
    category: (search.category as string) || "",
    brand: Array.isArray(search.brand)
      ? search.brand
      : typeof search.brand === "string"
        ? search.brand.split(",").filter(Boolean)
        : [],
    priceMin: (search.priceMin as number) || 0,
    priceMax: (search.priceMax as number) || 15000,
    rating: (search.rating as number) || 0,
    sort: (search.sort as string) || "relevance",
    layout: (search.layout as string) || "grid",
    page: (search.page as number) || 1,
  }),
  component: ProductListingPage,
});

function ProductListingPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/products/" });
  const { markViewed } = useShop();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [localPriceMin, setLocalPriceMin] = useState(search.priceMin);
  const [localPriceMax, setLocalPriceMax] = useState(search.priceMax);

  const allProducts = productService.all().filter((p) => p.status === "active");

  const filtered = useMemo(() => {
    let result = allProducts;

    if (search.search) {
      const q = search.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q),
      );
    }

    if (search.category) {
      result = result.filter((p) => p.categorySlug === search.category);
    }

    if (search.brand.length > 0) {
      result = result.filter((p) => search.brand.includes(p.brand));
    }

    result = result.filter((p) => p.price >= search.priceMin && p.price <= search.priceMax);

    if (search.rating > 0) {
      result = result.filter((p) => p.rating >= search.rating);
    }

    // Sort
    const sorted = [...result];
    switch (search.sort) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "best-seller":
        sorted.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "deals":
        sorted.sort((a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp);
        break;
      case "trending":
      case "relevance":
      default:
        break;
    }

    return sorted;
  }, [allProducts, search]);

  const itemsPerPage = 12;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentPage = Math.min(search.page, totalPages) || 1;
  const paginatedProducts = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleProductClick = (productId: string) => {
    markViewed(productId);
    navigate({ to: "/products/$id", params: { id: productId } });
  };

  const updateSearch = (updates: Partial<typeof search>) => {
    navigate({
      to: "/products/",
      search: { ...search, ...updates, page: 1 },
    });
  };

  const clearFilters = () => {
    navigate({
      to: "/products/",
      search: {
        search: "",
        category: "",
        brand: [],
        priceMin: 0,
        priceMax: 15000,
        rating: 0,
        sort: "relevance",
        layout: "grid",
        page: 1,
      },
    });
  };

  const hasActiveFilters =
    search.search || search.category || search.brand.length > 0 || search.rating > 0;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
          <p className="text-gray-600">
            Showing {filtered.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
            {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} products
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <FilterPanel
              search={search}
              onSearchChange={updateSearch}
              localPriceMin={localPriceMin}
              localPriceMax={localPriceMax}
              onPriceMinChange={setLocalPriceMin}
              onPriceMaxChange={setLocalPriceMax}
              onPriceApply={() => {
                updateSearch({ priceMin: localPriceMin, priceMax: localPriceMax });
              }}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4 flex gap-2">
            <Button
              variant="outline"
              onClick={() => setMobileFilterOpen(true)}
              className="flex-1"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                updateSearch({
                  layout: search.layout === "grid" ? "list" : "grid",
                })
              }
            >
              {search.layout === "grid" ? (
                <List className="w-4 h-4" />
              ) : (
                <Grid3x3 className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="hidden lg:flex justify-between items-center mb-6 pb-4 border-b">
              <div>
                <select
                  value={search.sort}
                  onChange={(e) => updateSearch({ sort: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                  <option value="newest">Newest</option>
                  <option value="best-seller">Best Seller</option>
                  <option value="deals">Deals</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={search.layout === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => updateSearch({ layout: "grid" })}
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={search.layout === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => updateSearch({ layout: "list" })}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Products */}
            {paginatedProducts.length > 0 ? (
              <div
                className={
                  search.layout === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
                    : "space-y-4 mb-8"
                }
              >
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onProductClick={() => handleProductClick(product.id)}
                    layout={search.layout as "grid" | "list"}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No products found"
                description="Try adjusting your filters or search terms"
                action={{
                  label: "Clear Filters",
                  onClick: clearFilters,
                }}
              />
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => updateSearch({ page: currentPage - 1 })}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    onClick={() => updateSearch({ page })}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => updateSearch({ page: currentPage + 1 })}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <Drawer open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Filters</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-8 max-h-96 overflow-y-auto">
            <FilterPanel
              search={search}
              onSearchChange={updateSearch}
              localPriceMin={localPriceMin}
              localPriceMax={localPriceMax}
              onPriceMinChange={setLocalPriceMin}
              onPriceMaxChange={setLocalPriceMax}
              onPriceApply={() => {
                updateSearch({ priceMin: localPriceMin, priceMax: localPriceMax });
                setMobileFilterOpen(false);
              }}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
        </DrawerContent>
      </Drawer>

      <ShoppingAssistant />
      <Footer />
    </div>
  );
}

function FilterPanel({
  search,
  onSearchChange,
  localPriceMin,
  localPriceMax,
  onPriceMinChange,
  onPriceMaxChange,
  onPriceApply,
  onClearFilters,
  hasActiveFilters,
}: any) {
  return (
    <div className="space-y-6">
      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          className="w-full"
          onClick={onClearFilters}
        >
          <X className="w-4 h-4 mr-2" />
          Clear All Filters
        </Button>
      )}

      {/* Search */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">Search</label>
        <Input
          placeholder="Search products..."
          value={search.search}
          onChange={(e) => onSearchChange({ search: e.target.value })}
          className="w-full"
        />
      </div>

      <Separator />

      {/* Category */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">Category</label>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={search.category === cat.slug}
                onCheckedChange={(checked) =>
                  onSearchChange({ category: checked ? cat.slug : "" })
                }
              />
              <span className="text-sm text-gray-700">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Brand */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">Brand</label>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {brands.map((brand) => (
            <label key={brand.id} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={search.brand.includes(brand.name)}
                onCheckedChange={(checked) => {
                  const updated = checked
                    ? [...search.brand, brand.name]
                    : search.brand.filter((b: string) => b !== brand.name);
                  onSearchChange({ brand: updated.join(",") });
                }}
              />
              <span className="text-sm text-gray-700">{brand.name}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">Price Range</label>
        <div className="space-y-4">
          <Slider
            value={[localPriceMin, localPriceMax]}
            onValueChange={([min, max]) => {
              onPriceMinChange(min);
              onPriceMaxChange(max);
            }}
            min={0}
            max={15000}
            step={100}
            className="w-full"
          />
          <div className="flex gap-2 text-sm">
            <input
              type="number"
              value={localPriceMin}
              onChange={(e) => onPriceMinChange(Number(e.target.value))}
              className="w-full px-2 py-1 border border-gray-300 rounded"
              placeholder="Min"
            />
            <input
              type="number"
              value={localPriceMax}
              onChange={(e) => onPriceMaxChange(Number(e.target.value))}
              className="w-full px-2 py-1 border border-gray-300 rounded"
              placeholder="Max"
            />
          </div>
          <Button onClick={onPriceApply} className="w-full" size="sm">
            Apply Price
          </Button>
        </div>
      </div>

      <Separator />

      {/* Rating */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">Rating</label>
        <div className="space-y-2">
          {[4.5, 4, 3.5, 3].map((rating) => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={search.rating === rating}
                onCheckedChange={(checked) =>
                  onSearchChange({ rating: checked ? rating : 0 })
                }
              />
              <span className="text-sm text-gray-700">
                {rating} ★ and above
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
