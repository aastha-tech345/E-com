import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteLogo } from "@/components/common/SiteLogo";

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
    <footer className="mt-16 border-t border-[#2b3138] bg-[#151a20] text-slate-200">
      <div className="container-page grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Link to="/" className="flex items-center gap-2">
            <SiteLogo size="sm" />
            <span className="text-lg font-extrabold tracking-tight text-white">ShopNest</span>
          </Link>
          <p className="mt-3 max-w-sm text-sm text-slate-400">
            A curated marketplace for electronics, fashion, beauty and home essentials — with
            dependable delivery across India.
          </p>
          <form
            className="mt-5 flex max-w-sm gap-2"
            onSubmit={(e) => e.preventDefault()}
            aria-label="Newsletter signup"
          >
            <label htmlFor="newsletter" className="sr-only">
              Email address
            </label>
            <Input id="newsletter" type="email" placeholder="Enter your email" className="rounded-full border-slate-700 bg-slate-900 text-white placeholder:text-slate-500" />
            <Button type="submit" className="rounded-full bg-[#a7622d] px-5 hover:bg-[#8d5228]">Subscribe</Button>
          </form>
          <div className="mt-5 flex gap-2">
            {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="grid h-9 w-9 place-items-center rounded-full border border-slate-700 bg-slate-900 text-slate-400 shadow-sm transition-colors hover:border-[#a7622d] hover:text-[#d9ae7d]"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="text-sm font-semibold text-white">{col.title}</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              {col.links.map((l) => (
                <li key={l}>
                  <a href="#" className="hover:text-[#d9ae7d]">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-slate-800">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-4 text-xs text-slate-500 sm:flex-row">
          <p>© 2026 ShopNest Commerce Pvt Ltd. All rights reserved.</p>
          <p>Demo storefront — frontend only, powered by mock data.</p>
        </div>
      </div>
    </footer>
  );
}
