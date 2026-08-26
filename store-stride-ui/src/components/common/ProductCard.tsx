import { Link } from "@tanstack/react-router";
import { CheckCircle2, Eye, Heart, PackageSearch, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/common/Price";
import { Rating } from "@/components/common/Rating";
import { productService } from "@/services";
import { useShop } from "@/store/shop";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductCard({
  product,
  layout = "grid",
  onProductClick,
  onQuickView,
  className,
}: {
  product: Product;
  layout?: "grid" | "list";
  onProductClick?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  className?: string;
}) {
  const { addToCart, cart, toggleWishlist, isWishlisted } = useShop();
  const wished = isWishlisted(product.id);
  const out = product.stock <= 0;
  const added = cart.some((line) => line.productId === product.id);
  const [imageFailed, setImageFailed] = useState(false);
  const image = product.images?.[0];

  return (
    <article
      className={cn(
        "group relative flex overflow-hidden rounded-xl border border-[#ddc8aa] bg-[#f7ead8] shadow-sm shadow-[#7c4a24]/10 transition duration-300 hover:-translate-y-1 hover:border-[#c79f72] hover:shadow-xl hover:shadow-[#7c4a24]/15",
        layout === "grid" ? "flex-col" : "flex-col sm:flex-row",
        className,
      )}
    >
      <Link
        to="/products/$id"
        params={{ id: product.id }}
        onClick={() => onProductClick?.(product)}
        className={cn(
          "relative block shrink-0 overflow-hidden bg-gradient-to-br from-[#e9d6bd] to-[#f7ead8]",
          layout === "grid" ? "aspect-[4/5] w-full" : "aspect-square w-full sm:w-52",
        )}
      >
        {image && !imageFailed ? (
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#b78a5d]">
            <PackageSearch size={30} />
          </div>
        )}
        {out && (
          <span className="absolute inset-x-0 bottom-0 bg-foreground/80 py-1 text-center text-xs font-medium text-background">
            Out of stock
          </span>
        )}
      </Link>

      <div className="absolute right-2 top-2 flex flex-col gap-1.5">
        <Button
          size="icon"
          variant="secondary"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wished}
          className="h-8 w-8 rounded-full border border-[#ddc8aa] bg-white/90 shadow-sm hover:bg-[#f3e1ca]"
          onClick={() => toggleWishlist(product.id)}
        >
          <Heart size={15} className={wished ? "fill-destructive text-destructive" : ""} />
        </Button>
        {onQuickView && (
          <Button
            size="icon"
            variant="secondary"
            aria-label="Quick view"
            className="h-8 w-8 rounded-full border border-[#ddc8aa] bg-white/90 opacity-0 shadow-sm transition-opacity hover:bg-[#f3e1ca] focus-visible:opacity-100 group-hover:opacity-100"
            onClick={() => onQuickView(product)}
          >
            <Eye size={15} />
          </Button>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {product.brand}
        </p>
        <Link
          to="/products/$id"
          params={{ id: product.id }}
          className="line-clamp-2 text-sm font-medium leading-snug hover:underline"
        >
          {product.name}
        </Link>
        <Rating value={product.rating} count={product.reviewCount} />
        <Price price={product.price} mrp={product.mrp} />
        {layout === "list" && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{product.shortDescription}</p>
        )}
        <Button
          className={cn(
            "mt-auto w-full rounded-full shadow-sm shadow-[#7c4a24]/15",
            added
              ? "bg-emerald-600 text-white hover:bg-emerald-600"
              : "bg-[#a7622d] hover:bg-[#8d5228]",
          )}
          size="sm"
          variant={out ? "secondary" : "default"}
          disabled={out || added}
          onClick={() => {
            productService.remember(product);
            addToCart(product.id, 1, { product });
          }}
        >
          {added ? <CheckCircle2 size={15} /> : <ShoppingCart size={15} />}
          {out ? "Notify me" : added ? "Added" : "Add to Cart"}
        </Button>
      </div>
    </article>
  );
}
