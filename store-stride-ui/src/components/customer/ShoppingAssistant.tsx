import { Link } from "@tanstack/react-router";
import { Bot, Maximize2, Minimize2, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Price } from "@/components/common/Price";
import { Rating } from "@/components/common/Rating";
import { chatbotService, productService } from "@/services";
import { useShop } from "@/store/shop";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";

const STARTERS = [
  "I need a wireless headphone under ₹3000",
  "Best rated running shoes",
  "Track my latest order",
  "My product arrived damaged",
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
          <header className="flex items-center gap-2 border-b bg-primary px-4 py-3 text-primary-foreground">
            <Bot size={18} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">AI Shopping Assistant</p>
              <p className="text-[11px] opacity-80">Backend AI · LangGraph flow</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/15"
              aria-label={full ? "Exit fullscreen" : "Fullscreen"}
              onClick={() => setFull((f) => !f)}
            >
              {full ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/15"
              aria-label="Close assistant"
              onClick={() => setOpen(false)}
            >
              <X size={16} />
            </Button>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            <div className="max-w-[85%] rounded-lg rounded-tl-none bg-muted px-3 py-2 text-sm">
              Hi! I can search products, compare options, check orders, track shipping, and help
              with damaged-item refund or replacement requests.
            </div>
            {chat.length === 0 && (
              <div className="flex flex-wrap gap-1.5">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => void send(s)}
                    className="rounded-full border px-3 py-1.5 text-xs hover:bg-muted"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {chat.map((m) => (
              <ChatBubble key={m.id} message={m} onAdd={addToCart} />
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
            className="flex items-center gap-2 border-t p-3"
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
          >
            <Button type="button" variant="ghost" size="sm" onClick={resetChat} className="text-xs">
              Clear
            </Button>
            <label htmlFor="assistant-input" className="sr-only">
              Message the assistant
            </label>
            <Input
              id="assistant-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              autoComplete="off"
            />
            <Button type="submit" size="icon" aria-label="Send message" disabled={!input.trim()}>
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
}: {
  message: ChatMessage;
  onAdd: (id: string) => void;
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
      <div className="max-w-[85%] rounded-lg rounded-tl-none bg-muted px-3 py-2 text-sm">
        {message.text}
      </div>
      {(message.intent || message.orchestrator || message.source) && (
        <div className="flex max-w-[85%] flex-wrap gap-1.5 text-[11px] text-muted-foreground">
          <span className="rounded-full border px-2 py-0.5">
            {message.source === "fallback" ? "Local fallback" : "Backend AI"}
          </span>
          {message.orchestrator && (
            <span className="rounded-full border px-2 py-0.5">
              {message.orchestrator === "langgraph" ? "LangGraph" : message.orchestrator}
            </span>
          )}
          {message.intent && <span className="rounded-full border px-2 py-0.5">{formatIntent(message.intent)}</span>}
          {message.usedTools && message.usedTools.length > 0 && (
            <span className="rounded-full border px-2 py-0.5">
              {message.usedTools.length} tools used
            </span>
          )}
        </div>
      )}
      {backendItems.map((p) => {
        const canAddToLocalCart = Boolean(productService.byId(p.id));
        return (
          <div key={p.id} className="flex gap-3 rounded-lg border p-2">
            {p.image && <img src={p.image} alt="" className="h-16 w-16 rounded object-cover" />}
            <div className="min-w-0 flex-1 space-y-1">
              <p className="truncate text-sm font-medium">{p.name}</p>
              <Price price={p.price} size="sm" />
              <p className="line-clamp-2 text-[11px] text-muted-foreground">{p.description}</p>
              <p className="text-[11px] text-muted-foreground">
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
                  onClick={() => onAdd(p.id)}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        );
      })}
      {mockItems.map((p) => (
        <div key={p.id} className="flex gap-3 rounded-lg border p-2">
          <img src={p.images[0]} alt="" className="h-16 w-16 rounded object-cover" />
          <div className="min-w-0 flex-1 space-y-1">
            <p className="truncate text-sm font-medium">{p.name}</p>
            <Rating value={p.rating} count={p.reviewCount} />
            <Price price={p.price} mrp={p.mrp} size="sm" />
            <p className="text-[11px] text-muted-foreground">
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
                onClick={() => onAdd(p.id)}
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
            <span key={s} className="rounded-full border px-3 py-1 text-xs text-muted-foreground">
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function formatIntent(intent: string) {
  return intent
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
