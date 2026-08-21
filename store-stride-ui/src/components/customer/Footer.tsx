import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const columns = [
  {
    title: "About",
    links: ["Our Story", "Careers", "Press", "Corporate Information"],
  },
  {
    title: "Customer Service",
    links: ["Help Centre", "Track Order", "Returns & Refunds", "Shipping Info"],
  },
  {
    title: "Policies",
    links: ["Terms of Use", "Privacy Policy", "Security", "Grievance Redressal"],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t bg-card">
      <div className="container-page grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded bg-accent text-sm font-black text-accent-foreground">
              S
            </span>
            <span className="text-lg font-extrabold tracking-tight">ShopNest</span>
          </Link>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            A curated marketplace for electronics, fashion, beauty and home essentials —
            with dependable delivery across India.
          </p>
          <form
            className="mt-5 flex max-w-sm gap-2"
            onSubmit={(e) => e.preventDefault()}
            aria-label="Newsletter signup"
          >
            <label htmlFor="newsletter" className="sr-only">
              Email address
            </label>
            <Input id="newsletter" type="email" placeholder="Enter your email" />
            <Button type="submit">Subscribe</Button>
          </form>
          <div className="mt-5 flex gap-2">
            {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="grid h-9 w-9 place-items-center rounded-full border text-muted-foreground transition-colors hover:text-foreground"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="text-sm font-semibold">{col.title}</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {col.links.map((l) => (
                <li key={l}>
                  <a href="#" className="hover:text-foreground">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h3 className="text-sm font-semibold">Get the app</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            Shop faster with exclusive app-only deals.
          </p>
          <div className="mt-3 flex flex-col gap-2">
            <Button variant="outline" size="sm">
              App Store
            </Button>
            <Button variant="outline" size="sm">
              Google Play
            </Button>
          </div>
        </div>
      </div>
      <div className="border-t">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-4 text-xs text-muted-foreground sm:flex-row">
          <p>© 2026 ShopNest Commerce Pvt Ltd. All rights reserved.</p>
          <p>Demo storefront — frontend only, powered by mock data.</p>
        </div>
      </div>
    </footer>
  );
}
