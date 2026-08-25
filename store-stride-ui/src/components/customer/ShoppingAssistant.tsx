import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Maximize2,
  Package,
  Minimize2,
  PackageSearch,
  RefreshCcw,
  RotateCcw,
  Search,
  Send,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Truck,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Price } from "@/components/common/Price";
import { Rating } from "@/components/common/Rating";
import { SiteLogo } from "@/components/common/SiteLogo";
import { chatbotService, productService } from "@/services";
import { useShop } from "@/store/shop";
import { cn } from "@/lib/utils";
import type { AssistantOrderCard, AssistantReturnAction, ChatMessage, Product } from "@/types";

const STARTERS = [
  {
    label: "Find products",
    prompt: "I need a wireless headphone under ₹3000",
    icon: Search,
  },
  {
    label: "Track order",
    prompt: "Track my latest order",
    icon: Truck,
  },
  {
    label: "Damaged item",
    prompt: "My product arrived damaged. Help me with refund or replacement.",
    icon: RefreshCcw,
  },
  {
    label: "Return policy",
    prompt: "What is the return and refund policy?",
    icon: ShieldCheck,
  },
];

const DEFAULT_SUGGESTIONS = [
  "Track my latest order",
  "What is the return policy?",
  "My product arrived damaged",
  "Show phones under ₹50000",
];

const INTENT_SUGGESTIONS: Record<string, string[]> = {
  cart_help: ["Proceed to checkout", "Apply a coupon", "What is in my cart?"],
  checkout_help: ["Is checkout secure?", "What payment options are available?", "Track my latest order"],
  order_support: ["Track my latest order", "Show my recent orders", "I received a damaged item"],
  policy_help: ["What is return policy?", "How do refunds work?", "My product arrived damaged"],
  product_compare: ["Compare these products", "Which one is better?", "Show similar products"],
  product_recommendation: ["Show best deals", "Suggest a gift", "Show trending products"],
  product_search: ["Show similar products", "Filter by price", "Show only in-stock items"],
  return_support: ["Choose a similar product", "Request a refund", "Check return policy"],
  shipping_support: ["Track my latest order", "Where is my package?", "Show delivery status"],
};

export function ShoppingAssistant() {
  const { chat, pushChat, resetChat, addToCart, hydrated } = useShop();
  const [open, setOpen] = useState(false);
  const [full, setFull] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const autoSuggestions = getAutoSuggestions(chat, input);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [chat.length, typing, open]);

  const send = async (text: string) => {
    const value = text.trim();
    if (!value || typing) return;
    setInput("");
    pushChat({ id: crypto.randomUUID(), role: "user", text: value });
    setTyping(true);
    const reply = await chatbotService.reply(value);
    setTyping(false);
    pushChat(reply);
  };

  if (!hydrated) return null;

  return (
    <>
      {!open && (
        <Button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 h-12 gap-2 rounded-full bg-gradient-to-r from-black to-zinc-700 px-5 text-white shadow-xl shadow-black/25 hover:from-zinc-950 hover:to-zinc-600"
          aria-label="Open AI shopping assistant"
        >
          <ShoppingCart size={17} /> Ask AI
        </Button>
      )}

      {open && (
        <section
          role="dialog"
          aria-label="AI Shopping Assistant"
          className={cn(
            "fixed z-50 flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-black/20 ring-1 ring-white/70",
            full
              ? "inset-2 sm:inset-6"
              : "bottom-3 right-3 left-3 h-[76vh] sm:left-auto sm:h-[650px] sm:w-[450px]",
          )}
        >
          <header className="border-b border-zinc-800 bg-[radial-gradient(circle_at_92%_22%,rgba(255,255,255,0.12),transparent_34%),linear-gradient(135deg,#050505,#18181b_58%,#3f3f46)] px-5 py-4 text-white shadow-sm">
            <div className="flex items-center gap-3">
              <SiteLogo size="lg" className="rounded-xl border border-white/15 shadow-md shadow-black/20 ring-0" />
              <div className="min-w-0 flex-1">
                <p className="text-base font-semibold tracking-wide">ShopNest Assistant</p>
                <p className="mt-0.5 truncate text-xs text-slate-300">Products, orders, delivery, refunds and returns</p>
              </div>
              <span className="hidden items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium text-emerald-100 sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                Online
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/10"
                aria-label={full ? "Exit fullscreen" : "Fullscreen"}
                onClick={() => setFull((f) => !f)}
              >
                {full ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/10"
                aria-label="Close assistant"
                onClick={() => setOpen(false)}
              >
                <X size={16} />
              </Button>
            </div>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-white via-zinc-50 to-zinc-100 p-4">
            <div className="rounded-xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-100 p-3 shadow-sm shadow-black/10">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-800">
                  <Sparkles size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Hi, how can I help today?</p>
                  <p className="mt-1 text-sm leading-5 text-slate-600">
                    I can help you find products, compare options, track orders, and sort out returns or refunds.
                  </p>
                </div>
              </div>
            </div>
            {chat.length === 0 && (
              <div className="grid grid-cols-2 gap-2">
                {STARTERS.map((starter) => {
                  const Icon = starter.icon;
                  return (
                    <button
                      key={starter.label}
                      onClick={() => void send(starter.prompt)}
                      className="flex min-h-20 flex-col items-start justify-between rounded-xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-100 p-3 text-left text-xs shadow-sm shadow-black/10 transition hover:border-zinc-400 hover:to-zinc-200"
                    >
                      <Icon size={17} className="text-zinc-800" />
                      <span className="font-semibold text-slate-800">{starter.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {chat.map((m) => (
              <ChatBubble key={m.id} message={m} onAdd={addToCart} onSend={(text) => void send(text)} />
            ))}

            {typing && (
              <div className="flex w-16 justify-center gap-1 rounded-xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-100 px-3 py-3 shadow-sm shadow-black/10">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
                    style={{ animationDelay: `${i * 120}ms` }}
                  />
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          {!typing && autoSuggestions.length > 0 ? (
            <div className="border-t border-zinc-200 bg-gradient-to-b from-white to-zinc-100 px-3 pt-3">
              <div className="flex gap-2 overflow-x-auto pb-1.5">
                {autoSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => void send(suggestion)}
                    className="shrink-0 rounded-full border border-blue-200 bg-gradient-to-b from-white to-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 shadow-sm shadow-blue-950/5 transition hover:border-blue-400 hover:to-blue-100"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <form
            className="flex items-center gap-2 bg-gradient-to-b from-zinc-100 to-white p-3"
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
          >
            <Button type="button" variant="ghost" size="icon" className="shrink-0 rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950" onClick={resetChat} aria-label="Reset chat">
              <RotateCcw size={15} />
            </Button>
            <label htmlFor="assistant-input" className="sr-only">
              Message the assistant
            </label>
            <Input
              id="assistant-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about products, orders, returns..."
              autoComplete="off"
              className="h-11 rounded-full border-zinc-200 bg-gradient-to-b from-white to-zinc-100 px-4 shadow-inner focus-visible:ring-zinc-300"
            />
            <Button type="submit" size="icon" className="h-11 w-11 shrink-0 rounded-full bg-zinc-950 text-white shadow-md shadow-black/20 hover:bg-zinc-800" aria-label="Send message" disabled={!input.trim() || typing}>
              <Send size={16} />
            </Button>
          </form>
        </section>
      )}
    </>
  );
}

function getAutoSuggestions(chat: ChatMessage[], input: string) {
  if (input.trim().length > 0) {
    const lowerInput = input.toLowerCase();
    return uniqueSuggestions(
      DEFAULT_SUGGESTIONS.filter((suggestion) => suggestion.toLowerCase().includes(lowerInput)),
    ).slice(0, 3);
  }

  const latestAssistant = [...chat].reverse().find((message) => message.role === "assistant");
  const sourceSuggestions = [
    ...(latestAssistant?.suggestions ?? []),
    ...(latestAssistant?.intent ? INTENT_SUGGESTIONS[latestAssistant.intent] ?? [] : []),
    ...DEFAULT_SUGGESTIONS,
  ];

  return uniqueSuggestions(sourceSuggestions).slice(0, 4);
}

function uniqueSuggestions(suggestions: string[]) {
  const seen = new Set<string>();
  return suggestions.filter((suggestion) => {
    const normalized = normalizeSuggestion(suggestion);
    if (!normalized || seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

function normalizeSuggestion(suggestion: string) {
  return suggestion
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b(the|a|an|my|is|what|how|do|does)\b/g, " ")
    .replace(/\breturn policy\b/g, "returns")
    .replace(/\bdamaged item\b/g, "damage")
    .replace(/\breceived damage\b/g, "damage")
    .replace(/\bproduct arrived damaged\b/g, "damage")
    .replace(/\s+/g, " ")
    .trim();
}

function ChatBubble({
  message,
  onAdd,
  onSend,
}: {
  message: ChatMessage;
  onAdd: (id: string, quantity?: number, opts?: { product?: Product }) => void;
  onSend: (text: string) => void;
}) {
  const mockItems = message.products ? productService.byIds(message.products) : [];
  const backendItems = message.productResults ?? [];
  if (message.role === "user") {
    return (
      <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-md border border-zinc-300 bg-gradient-to-br from-zinc-100 to-zinc-200 px-3.5 py-2.5 text-sm font-medium leading-5 text-zinc-950 shadow-sm shadow-black/10">
        {message.text}
      </div>
    );
  }
  return (
    <div className="space-y-2">
      <div className="max-w-[90%] rounded-2xl rounded-tl-md border border-zinc-200 bg-gradient-to-br from-white to-zinc-100 px-3.5 py-2.5 text-sm leading-5 text-zinc-700 shadow-sm shadow-black/10">
        {message.text}
      </div>
      {message.intent && <SupportContext intent={message.intent} />}
      {message.orderCards?.map((order) => (
        <OrderStatusCard key={order.id} order={order} />
      ))}
      {message.returnActions && message.returnActions.length > 0 ? (
        <ReturnActions actions={message.returnActions} onSend={onSend} />
      ) : null}
      {message.intent === "return_support" && backendItems.length > 0 ? (
        <p className="max-w-[94%] px-1 text-xs font-semibold text-slate-600">
          Similar products available for replacement
        </p>
      ) : null}
      {backendItems.map((p) => {
        const canAddToLocalCart = Boolean(productService.byId(p.id));
        return (
          <div key={p.id} className="flex gap-3 rounded-xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-100 p-2.5 shadow-sm shadow-black/10">
            {p.image ? (
              <img src={p.image} alt="" className="h-20 w-20 shrink-0 rounded-lg bg-slate-100 object-cover" />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                <PackageSearch size={22} />
              </div>
            )}
            <div className="min-w-0 flex-1 space-y-1">
              <p className="truncate text-sm font-semibold text-slate-900">{p.name}</p>
              <Price price={p.price} size="sm" />
              <p className="line-clamp-2 text-[11px] leading-4 text-slate-500">{p.description}</p>
              <p className="text-[11px] text-slate-500">
                {p.stock > 0 ? "In stock" : "Currently unavailable"}
              </p>
              <div className="flex gap-1.5 pt-1">
                <Button size="sm" variant="outline" className="h-8 rounded-full border-blue-200 bg-blue-50 px-3 text-xs text-blue-700 hover:bg-blue-100" asChild>
                  <Link to="/products/$id" params={{ id: p.id }}>
                    View Product
                  </Link>
                </Button>
                <Button
                  size="sm"
                  className="h-8 rounded-full bg-zinc-950 px-3 text-xs hover:bg-zinc-800"
                  disabled={!canAddToLocalCart || p.stock <= 0}
                  onClick={() => {
                    const product = productService.byId(p.id);
                    onAdd(p.id, 1, product ? { product } : undefined);
                  }}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        );
      })}
      {mockItems.map((p) => (
        <div key={p.id} className="flex gap-3 rounded-xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-100 p-2.5 shadow-sm shadow-black/10">
          <img src={p.images[0]} alt="" className="h-20 w-20 shrink-0 rounded-lg object-cover" />
          <div className="min-w-0 flex-1 space-y-1">
            <p className="truncate text-sm font-semibold text-slate-900">{p.name}</p>
            <Rating value={p.rating} count={p.reviewCount} />
            <Price price={p.price} mrp={p.mrp} size="sm" />
            <p className="text-[11px] text-slate-500">
              {p.stock > 0 ? "In stock" : "Currently unavailable"}
            </p>
            <div className="flex gap-1.5 pt-1">
              <Button size="sm" variant="outline" className="h-8 rounded-full border-blue-200 bg-blue-50 px-3 text-xs text-blue-700 hover:bg-blue-100" asChild>
                <Link to="/products/$id" params={{ id: p.id }}>
                  View Product
                </Link>
              </Button>
              <Button
                size="sm"
                className="h-8 rounded-full bg-zinc-950 px-3 text-xs hover:bg-zinc-800"
                disabled={p.stock <= 0}
                onClick={() => onAdd(p.id, 1, { product: p })}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function OrderStatusCard({ order }: { order: AssistantOrderCard }) {
  const [imageFailed, setImageFailed] = useState(false);
  const firstItem = order.items[0];
  const itemCount = order.items.reduce((total, item) => total + item.quantity, 0);
  const shipmentStatus = order.shipment?.status || order.status;
  const fallbackProduct = firstItem ? productService.byId(firstItem.product_id) : undefined;
  const image = firstItem?.image || fallbackProduct?.images?.[0];

  return (
    <div className="max-w-[94%] rounded-xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-100 p-3 shadow-sm shadow-black/10">
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-2">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">Order {order.order_number}</p>
          <p className="mt-1 text-sm font-semibold text-slate-950">{formatStatus(order.status)}</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700">
          <Truck size={12} />
          {formatStatus(shipmentStatus)}
        </span>
      </div>
      <div className="mt-3 flex gap-3">
        {image && !imageFailed ? (
          <img
            src={image}
            alt=""
            className="h-16 w-16 shrink-0 rounded-lg bg-slate-100 object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
            <Package size={20} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">{firstItem?.product_name || "Order item"}</p>
          <p className="mt-0.5 text-xs text-slate-500">
            {itemCount} item{itemCount === 1 ? "" : "s"} • {order.currency} {Number(order.subtotal).toLocaleString("en-IN")}
          </p>
          {order.shipment?.tracking_number ? (
            <p className="mt-1 text-xs text-slate-500">Tracking: {order.shipment.tracking_number}</p>
          ) : null}
        </div>
      </div>
      {order.shipment?.events?.length ? (
        <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-2">
          {order.shipment.events.slice(0, 3).map((event) => (
            <div key={event} className="flex items-center gap-2 text-xs text-slate-600">
              <CheckCircle2 size={13} className="text-emerald-600" />
              {formatStatus(event)}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ReturnActions({ actions, onSend }: { actions: AssistantReturnAction[]; onSend: (text: string) => void }) {
  return (
    <div className="grid max-w-[94%] gap-2">
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          disabled={!action.enabled}
          onClick={() => onSend(action.label)}
          className="group rounded-xl border border-blue-200 bg-gradient-to-br from-white to-blue-50 p-3 text-left shadow-sm shadow-blue-950/10 transition enabled:hover:border-blue-400 enabled:hover:to-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <p className="flex items-center justify-between gap-2 text-sm font-semibold text-slate-900">
            {action.label}
            <ArrowRight size={14} className="text-blue-500 transition group-enabled:group-hover:translate-x-0.5 group-enabled:group-hover:text-blue-700" />
          </p>
          <p className="mt-1 text-xs leading-4 text-slate-500">{action.description}</p>
        </button>
      ))}
    </div>
  );
}

function SupportContext({ intent }: { intent: string }) {
  return (
    <div className="inline-flex max-w-[90%] items-center gap-1.5 rounded-full border border-blue-200 bg-gradient-to-b from-white to-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 shadow-sm shadow-blue-950/5">
      <Sparkles size={12} />
      {formatIntent(intent)}
    </div>
  );
}

function formatStatus(status: string) {
  return status
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatIntent(intent: string) {
  const labels: Record<string, string> = {
    account_help: "Account help",
    cart_help: "Cart help",
    checkout_help: "Checkout help",
    order_support: "Order help",
    policy_help: "Policy help",
    product_compare: "Product comparison",
    product_recommendation: "Product suggestions",
    product_search: "Product search",
    return_support: "Returns and replacements",
    shipping_support: "Order tracking",
  };
  return labels[intent] ?? "Shopping help";
}
