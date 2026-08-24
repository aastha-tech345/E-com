import { Link } from "@tanstack/react-router";
import { Eye, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/common/Price";
import { Rating } from "@/components/common/Rating";
import { useShop } from "@/store/shop";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductCard({
  product,
  layout = "grid",
  onQuickView,
  className,
}: {
  product: Product;
  layout?: "grid" | "list";
  onQuickView?: (product: Product) => void;
  className?: string;
}) {
  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  const wished = isWishlisted(product.id);
  const out = product.stock <= 0;

  return (
    <article
      className={cn(
        "group relative flex overflow-hidden rounded-2xl border border-stone-200 bg-card shadow-[0_10px_25px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:border-stone-300 hover:shadow-[0_18px_35px_rgba(15,23,42,0.09)]",
        layout === "grid" ? "flex-col" : "flex-col sm:flex-row",
        className,
      )}
    >
      <Link
        to="/products/$id"
        params={{ id: product.id }}
        className={cn(
          "relative block shrink-0 overflow-hidden bg-stone-100",
          layout === "grid" ? "aspect-[4/5] w-full" : "aspect-square w-full sm:w-52",
        )}
      >
        {product.images?.[0] && (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
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
          className="h-8 w-8 rounded-full shadow-sm"
          onClick={() => toggleWishlist(product.id)}
        >
          <Heart size={15} className={wished ? "fill-destructive text-destructive" : ""} />
        </Button>
        {onQuickView && (
          <Button
            size="icon"
            variant="secondary"
            aria-label="Quick view"
            className="h-8 w-8 rounded-full opacity-0 shadow-sm transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
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
          className="mt-auto w-full"
          size="sm"
          variant={out ? "secondary" : "default"}
          disabled={out}
          onClick={() => addToCart(product.id)}
        >
          <ShoppingCart size={15} />
          {out ? "Notify me" : "Add to Cart"}
        </Button>
      </div>
    </article>
  );
}
