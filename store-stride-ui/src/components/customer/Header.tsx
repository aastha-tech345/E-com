import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronDown,
  Heart,
  LogOut,
  Menu,
  Package,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { catalogService, productService } from "@/services";
import { useShop } from "@/store/shop";
import { formatPrice } from "@/lib/format";

function SearchBox({ onNavigate }: { onNavigate?: () => void }) {
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { recentSearches, addRecentSearch } = useShop();
  const boxRef = useRef<HTMLDivElement>(null);
  const suggestions = productService.suggestions(term);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const submit = (value: string) => {
    const q = value.trim();
    if (!q) return;
    addRecentSearch(q);
    setOpen(false);
    onNavigate?.();
    setTerm(q);
    void navigate({ to: "/products", search: { search: q, page: 1 } });
  };

  return (
    <div ref={boxRef} className="relative w-full">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          submit(term);
        }}
      >
        <label htmlFor="site-search" className="sr-only">
          Search products
        </label>
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          id="site-search"
          value={term}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setTerm(e.target.value);
            setOpen(true);
          }}
          placeholder="Search for products, brands, categories or product ID"
          className="h-10 pl-9 pr-20"
          autoComplete="off"
        />
        <Button type="submit" size="sm" className="absolute right-1 top-1 h-8">
          Search
        </Button>
      </form>

      {open && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border bg-popover shadow-lg">
          {!term && (
            <div className="p-3">
              {recentSearches.length > 0 && (
                <>
                  <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                    Recent searches
                  </p>
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {recentSearches.map((r) => (
                      <button
                        key={r}
                        onClick={() => submit(r)}
                        className="rounded-full border px-3 py-1 text-xs hover:bg-muted"
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </>
              )}
              <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                Popular searches
              </p>
              <div className="flex flex-wrap gap-1.5">
                {productService.popularSearches.map((r) => (
                  <button
                    key={r}
                    onClick={() => submit(r)}
                    className="rounded-full border px-3 py-1 text-xs hover:bg-muted"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          {term && (
            <div className="max-h-96 overflow-y-auto">
              {suggestions.categories.length > 0 && (
                <div className="border-b p-2">
                  {suggestions.categories.map((c) => (
                    <Link
                      key={c.id}
                      to="/category/$slug"
                      params={{ slug: c.slug }}
                      onClick={() => setOpen(false)}
                      className="block rounded px-2 py-1.5 text-sm hover:bg-muted"
                    >
                      in <span className="font-medium">{c.name}</span>
                    </Link>
                  ))}
                </div>
              )}
              {suggestions.brands.length > 0 && (
                <div className="border-b p-2">
                  {suggestions.brands.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => submit(b.name)}
                      className="block w-full rounded px-2 py-1.5 text-left text-sm hover:bg-muted"
                    >
                      Brand: <span className="font-medium">{b.name}</span>
                    </button>
                  ))}
                </div>
              )}
              <div className="p-2">
                {suggestions.products.length === 0 ? (
                  <p className="px-2 py-3 text-sm text-muted-foreground">
                    No suggestions. Press enter to search anyway.
                  </p>
                ) : (
                  suggestions.products.map((p) => (
                    <Link
                      key={p.id}
                      to="/products/$id"
                      params={{ id: p.id }}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded px-2 py-2 hover:bg-muted"
                    >
                      <img src={p.images[0]} alt="" className="h-10 w-10 rounded object-cover" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm">{p.name}</span>
                        <span className="block text-xs text-muted-foreground">
                          {p.id} · {formatPrice(p.price)}
                        </span>
                      </span>
                    </Link>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const { cartCount, wishlist, user, logout } = useShop();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => catalogService.categories(),
  });

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="bg-primary py-1.5 text-center text-xs text-primary-foreground">
        Free delivery on prepaid orders above ₹999 · Easy 7-day returns
      </div>
      <div className="container-page flex h-16 items-center gap-3">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <SheetHeader className="border-b p-4">
              <SheetTitle>Browse</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col p-2">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  onClick={() => setMobileOpen(false)}
                  className="rounded px-3 py-2.5 text-sm hover:bg-muted"
                >
                  {c.name}
                </Link>
              ))}
              <div className="my-2 border-t" />
              <Link to="/orders" onClick={() => setMobileOpen(false)} className="rounded px-3 py-2.5 text-sm hover:bg-muted">
                My Orders
              </Link>
              <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="rounded px-3 py-2.5 text-sm hover:bg-muted">
                Wishlist
              </Link>
              <Link to="/profile" onClick={() => setMobileOpen(false)} className="rounded px-3 py-2.5 text-sm hover:bg-muted">
                My Profile
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded bg-accent text-sm font-black text-accent-foreground">
            S
          </span>
          <span className="text-lg font-extrabold tracking-tight">ShopNest</span>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="hidden shrink-0 lg:inline-flex">
              Categories <ChevronDown size={15} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            {categories.map((c) => (
              <DropdownMenuItem key={c.id} asChild>
                <Link to="/category/$slug" params={{ slug: c.slug }}>
                  {c.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="hidden flex-1 md:block">
          <SearchBox />
        </div>

        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="icon" asChild aria-label="Wishlist" className="relative">
            <Link to="/wishlist">
              <Heart size={19} />
              {wishlist.length > 0 && (
                <Badge className="absolute -right-0.5 -top-0.5 h-4 min-w-4 justify-center px-1 text-[10px]">
                  {wishlist.length}
                </Badge>
              )}
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild aria-label="Cart" className="relative">
            <Link to="/cart">
              <ShoppingCart size={19} />
              {cartCount > 0 && (
                <Badge className="absolute -right-0.5 -top-0.5 h-4 min-w-4 justify-center px-1 text-[10px]">
                  {cartCount}
                </Badge>
              )}
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Account">
                <User size={19} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{user ? `Hi, ${user.name}` : "Welcome"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {user ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <User size={15} /> My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders">
                      <Package size={15} /> My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut size={15} /> Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/login">Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/register">Create account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/orders">Track orders</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="container-page pb-3 md:hidden">
        <SearchBox />
      </div>

      <nav className="hidden border-t lg:block">
        <div className="container-page flex items-center gap-6 overflow-x-auto py-2 text-sm no-scrollbar">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground font-medium" }}
            >
              {c.name}
            </Link>
          ))}
          <Link to="/products" search={{ page: 1, sort: "discount" }} className="whitespace-nowrap font-medium text-accent">
            Today's Deals
          </Link>
        </div>
      </nav>
      <span className="hidden">
        <X size={0} />
      </span>
    </header>
  );
}
