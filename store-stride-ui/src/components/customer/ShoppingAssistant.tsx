import { Link } from "@tanstack/react-router";
import {
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
  Sparkles,
  Truck,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Price } from "@/components/common/Price";
import { Rating } from "@/components/common/Rating";
import { chatbotService, productService } from "@/services";
import { useShop } from "@/store/shop";
import { cn } from "@/lib/utils";
import type { AssistantOrderCard, AssistantReturnAction, ChatMessage, Product } from "@/types";

const STARTERS = [
  {
    label: "Find Products",
    prompt: "I need a wireless headphone under ₹3000",
    icon: Search,
  },
  {
    label: "Track Order",
    prompt: "Track my latest order",
    icon: Truck,
  },
  {
    label: "Damaged Item",
    prompt: "My product arrived damaged. Help me with refund or replacement.",
    icon: RefreshCcw,
  },
  {
    label: "Policy Help",
    prompt: "What is the return and refund policy?",
    icon: ShieldCheck,
  },
];

export function ShoppingAssistant() {
  const { chat, pushChat, resetChat, addToCart, hydrated } = useShop();
  const [open, setOpen] = useState(false);
  const [full, setFull] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

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
          className="fixed bottom-5 right-5 z-50 h-12 gap-2 rounded-full px-5 shadow-lg"
          aria-label="Open AI shopping assistant"
        >
          <Sparkles size={17} /> Ask AI
        </Button>
      )}

      {open && (
        <section
          role="dialog"
          aria-label="AI Shopping Assistant"
          className={cn(
            "fixed z-50 flex flex-col overflow-hidden rounded-xl border bg-card shadow-2xl",
            full
              ? "inset-2 sm:inset-6"
              : "bottom-3 right-3 left-3 h-[70vh] sm:left-auto sm:h-[560px] sm:w-[400px]",
          )}
        >
          <header className="border-b bg-slate-950 px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600">
                <Bot size={19} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">ShopNest Assistant</p>
                <p className="mt-0.5 text-[11px] text-slate-300">Product search, orders, delivery, refunds and policy help</p>
              </div>
              <span className="hidden items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[11px] text-emerald-100 sm:flex">
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

          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4">
            <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Sparkles size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">How can I help?</p>
                  <p className="mt-1 text-sm leading-5 text-slate-600">
                    I can search products, compare options, check your orders, track delivery, and guide damaged-item refund or replacement flows.
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
                      className="flex min-h-20 flex-col items-start justify-between rounded-lg border border-slate-200 bg-white p-3 text-left text-xs shadow-sm transition hover:border-blue-300 hover:bg-blue-50"
                    >
                      <Icon size={17} className="text-blue-600" />
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
              <div className="flex w-16 justify-center gap-1 rounded-lg bg-muted px-3 py-3">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
                    style={{ animationDelay: `${i * 120}ms` }}
                  />
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            className="flex items-center gap-2 border-t bg-white p-3"
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
          >
            <Button type="button" variant="ghost" size="icon" onClick={resetChat} aria-label="Reset chat">
              <RotateCcw size={15} />
            </Button>
            <label htmlFor="assistant-input" className="sr-only">
              Message the assistant
            </label>
            <Input
              id="assistant-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about product, order ID, refund..."
              autoComplete="off"
              className="h-10"
            />
            <Button type="submit" size="icon" aria-label="Send message" disabled={!input.trim() || typing}>
              <Send size={16} />
            </Button>
          </form>
        </section>
      )}
    </>
  );
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
      <div className="ml-auto max-w-[85%] rounded-lg rounded-tr-none bg-primary px-3 py-2 text-sm text-primary-foreground">
        {message.text}
      </div>
    );
  }
  return (
    <div className="space-y-2">
      <div className="max-w-[90%] rounded-lg rounded-tl-none border border-slate-200 bg-white px-3 py-2 text-sm leading-5 text-slate-700 shadow-sm">
        {message.text}
      </div>
      {message.intent && <SupportContext intent={message.intent} />}
      {message.orderCards?.map((order) => (
        <OrderStatusCard key={order.id} order={order} />
      ))}
      {message.returnActions && message.returnActions.length > 0 ? (
        <ReturnActions actions={message.returnActions} onSend={onSend} />
      ) : null}
      {backendItems.map((p) => {
        const canAddToLocalCart = Boolean(productService.byId(p.id));
        return (
          <div key={p.id} className="flex gap-3 rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
            {p.image ? (
              <img src={p.image} alt="" className="h-20 w-20 rounded-md bg-slate-100 object-cover" />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-400">
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
                <Button size="sm" variant="outline" className="h-7 text-xs" asChild>
                  <Link to="/products/$id" params={{ id: p.id }}>
                    View Product
                  </Link>
                </Button>
                <Button
                  size="sm"
                  className="h-7 text-xs"
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
        <div key={p.id} className="flex gap-3 rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
          <img src={p.images[0]} alt="" className="h-20 w-20 rounded-md object-cover" />
          <div className="min-w-0 flex-1 space-y-1">
            <p className="truncate text-sm font-semibold text-slate-900">{p.name}</p>
            <Rating value={p.rating} count={p.reviewCount} />
            <Price price={p.price} mrp={p.mrp} size="sm" />
            <p className="text-[11px] text-slate-500">
              {p.stock > 0 ? "In stock" : "Currently unavailable"}
            </p>
            <div className="flex gap-1.5 pt-1">
              <Button size="sm" variant="outline" className="h-7 text-xs" asChild>
                <Link to="/products/$id" params={{ id: p.id }}>
                  View Product
                </Link>
              </Button>
              <Button
                size="sm"
                className="h-7 text-xs"
                disabled={p.stock <= 0}
                onClick={() => onAdd(p.id, 1, { product: p })}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      ))}
      {message.suggestions && (
        <div className="flex flex-wrap gap-1.5">
          {message.suggestions.map((s) => (
            <button
              key={s}
              onClick={() => onSend(s)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 hover:border-blue-300 hover:bg-blue-50"
            >
              {s}
            </button>
          ))}
        </div>
      )}
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
    <div className="max-w-[94%] rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-2">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">Order {order.order_number}</p>
          <p className="mt-1 text-sm font-semibold text-slate-950">{formatStatus(order.status)}</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-700">
          <Truck size={12} />
          {formatStatus(shipmentStatus)}
        </span>
      </div>
      <div className="mt-3 flex gap-3">
        {image && !imageFailed ? (
          <img
            src={image}
            alt=""
            className="h-16 w-16 shrink-0 rounded-md bg-slate-100 object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-400">
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
          className="rounded-lg border border-slate-200 bg-white p-3 text-left shadow-sm transition enabled:hover:border-blue-300 enabled:hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <p className="text-sm font-semibold text-slate-900">{action.label}</p>
          <p className="mt-1 text-xs leading-4 text-slate-500">{action.description}</p>
        </button>
      ))}
    </div>
  );
}

function SupportContext({ intent }: { intent: string }) {
  return (
    <div className="inline-flex max-w-[90%] items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] text-blue-700">
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
