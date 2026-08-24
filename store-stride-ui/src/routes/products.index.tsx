import { useNavigate, useSearch } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Filter, Grid3x3, List, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/common/ProductCard";
import { Header } from "@/components/customer/Header";
import { Footer } from "@/components/customer/Footer";
import { ShoppingAssistant } from "@/components/customer/ShoppingAssistant";
import { useShop } from "@/store/shop";
import { catalogService, productService } from "@/services";
import { EmptyState } from "@/components/common/EmptyState";

export const Route = createFileRoute("/products/")({
  validateSearch: (search: Record<string, unknown>) => ({
    search: (search.search as string) || "",
    category: Array.isArray(search.category)
      ? search.category
      : typeof search.category === "string"
        ? search.category.split(",").filter(Boolean)
        : [],
    brand: Array.isArray(search.brand)
      ? search.brand
      : typeof search.brand === "string"
        ? search.brand.split(",").filter(Boolean)
        : [],
    priceMin: (search.priceMin as number) || 0,
    priceMax: (search.priceMax as number) || 15000,
    rating: Array.isArray(search.rating)
      ? search.rating.map((value) => Number(value)).filter((value) => !Number.isNaN(value))
      : typeof search.rating === "string"
        ? search.rating
            .split(",")
            .map((value) => Number(value))
            .filter((value) => !Number.isNaN(value))
        : typeof search.rating === "number"
          ? [search.rating]
          : [],
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

  const itemsPerPage = 12;
  const { data: productPage, isPending, isError } = useQuery({
    queryKey: ["products", search],
    queryFn: () => productService.list({
      search: search.search || undefined,
      category: search.category,
      brands: search.brand,
      minPrice: search.priceMin,
      maxPrice: search.priceMax,
      minRating: search.rating.length ? Math.min(...search.rating) : undefined,
      sort: search.sort,
      page: search.page,
      perPage: itemsPerPage,
    }),
  });
  const { data: categoryOptions = [] } = useQuery({ queryKey: ["categories"], queryFn: () => catalogService.categories() });
  const { data: brandOptions = [] } = useQuery({ queryKey: ["brands"], queryFn: () => catalogService.brands() });
  const paginatedProducts = productPage?.items || [];
  const totalProducts = productPage?.total || 0;
  const totalPages = productPage?.pages || 0;
  const currentPage = productPage?.page || search.page;

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
        category: [],
        brand: [],
        priceMin: 0,
        priceMax: 15000,
        rating: [],
        sort: "relevance",
        layout: "grid",
        page: 1,
      },
    });
  };

  const hasActiveFilters =
    search.search || search.category.length > 0 || search.brand.length > 0 || search.rating.length > 0;

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-8 md:py-10">
        {/* Page Header */}
        <div className="mb-8 border-b border-stone-200 pb-7">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-amber-700">
            Curated collection
          </p>
          <h1 className="mb-2 text-3xl font-bold text-slate-900 md:text-4xl">Products</h1>
          <p className="max-w-2xl text-sm text-slate-600 md:text-base">
            Discover premium everyday essentials with refined filters for category, brand, and rating.
          </p>
          <p className="mt-4 text-sm font-medium text-slate-500">
            Showing {totalProducts > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
            {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts} products
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
              categories={categoryOptions}
              brands={brandOptions}
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
            <div className="mb-6 flex flex-col gap-4 border-y border-stone-200 py-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <select
                  value={search.sort}
                  onChange={(e) => updateSearch({ sort: e.target.value })}
                  className="rounded-full border border-stone-300 bg-stone-50 px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-slate-500"
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
              <div className="flex gap-2 self-end lg:self-auto">
                <Button
                  variant={search.layout === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => updateSearch({ layout: "grid" })}
                  className={search.layout === "grid" ? "rounded-full bg-slate-900 hover:bg-slate-800" : "rounded-full"}
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={search.layout === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => updateSearch({ layout: "list" })}
                  className={search.layout === "list" ? "rounded-full bg-slate-900 hover:bg-slate-800" : "rounded-full"}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Products */}
            {isPending ? (
              <div className="py-16 text-center text-sm text-slate-500">Loading products from the server...</div>
            ) : isError ? (
              <EmptyState title="Products are unavailable" description="Please make sure the backend is running and try again." />
            ) : paginatedProducts.length > 0 ? (
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
              categories={categoryOptions}
              brands={brandOptions}
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
  categories,
  brands,
}: any) {
  const toggleMultiSelect = (values: string[], value: string, checked: boolean) =>
    checked ? [...values, value] : values.filter((item) => item !== value);

  const toggleRating = (values: number[], value: number, checked: boolean) =>
    checked ? [...values, value] : values.filter((item) => item !== value);

  return (
    <div className="space-y-6 border-r border-stone-200 pr-6">
      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          className="w-full rounded-full border-stone-300"
          onClick={onClearFilters}
        >
          <X className="w-4 h-4 mr-2" />
          Clear All Filters
        </Button>
      )}

      {/* Category */}
      <div>
        <label className="mb-3 block text-sm font-semibold text-slate-900">Category</label>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 rounded-2xl px-2 py-1.5 transition hover:bg-stone-50 cursor-pointer">
              <Checkbox
                checked={search.category.includes(cat.slug)}
                onCheckedChange={(checked) =>
                  onSearchChange({
                    category: toggleMultiSelect(search.category, cat.slug, Boolean(checked)).join(","),
                  })
                }
              />
              <span className="text-sm text-slate-700">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Brand */}
      <div>
        <label className="mb-3 block text-sm font-semibold text-slate-900">Brand</label>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {brands.map((brand) => (
            <label key={brand.id} className="flex items-center gap-2 rounded-2xl px-2 py-1.5 transition hover:bg-stone-50 cursor-pointer">
              <Checkbox
                checked={search.brand.includes(brand.name)}
                onCheckedChange={(checked) => {
                  const updated = toggleMultiSelect(search.brand, brand.name, Boolean(checked));
                  onSearchChange({ brand: updated.join(",") });
                }}
              />
              <span className="text-sm text-slate-700">{brand.name}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price */}
      <div>
        <label className="mb-3 block text-sm font-semibold text-slate-900">Price Range</label>
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
              className="w-full rounded-xl border border-stone-300 px-3 py-2"
              placeholder="Min"
            />
            <input
              type="number"
              value={localPriceMax}
              onChange={(e) => onPriceMaxChange(Number(e.target.value))}
              className="w-full rounded-xl border border-stone-300 px-3 py-2"
              placeholder="Max"
            />
          </div>
          <Button onClick={onPriceApply} className="w-full rounded-full bg-slate-900 hover:bg-slate-800" size="sm">
            Apply Price
          </Button>
        </div>
      </div>

      <Separator />

      {/* Rating */}
      <div>
        <label className="mb-3 block text-sm font-semibold text-slate-900">Rating</label>
        <div className="space-y-2">
          {[4.5, 4, 3.5, 3].map((rating) => (
            <label key={rating} className="flex items-center gap-2 rounded-2xl px-2 py-1.5 transition hover:bg-stone-50 cursor-pointer">
              <Checkbox
                checked={search.rating.includes(rating)}
                onCheckedChange={(checked) =>
                  onSearchChange({
                    rating: toggleRating(search.rating, rating, Boolean(checked)).join(","),
                  })
                }
              />
              <span className="text-sm text-slate-700">
                {rating} ★ and above
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
