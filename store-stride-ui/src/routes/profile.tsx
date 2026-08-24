import { useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { User, Mail, MapPin, LogOut, Edit2, Save, X, WalletCards, ShoppingBag, Heart, ChevronRight, CreditCard, Banknote, Bell, Megaphone, MessageSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/customer/Header";
import { Footer } from "@/components/customer/Footer";
import { useShop } from "@/store/shop";
import { EmptyState } from "@/components/common/EmptyState";
import { type CustomerAddressRecord, profileService } from "@/services";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type ProfileUser = { full_name: string; email: string };

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, tokens, setUser } = useShop();
  const [addresses, setAddresses] = useState<CustomerAddressRecord[]>([]);

  const loadAddresses = async () => {
    try { setAddresses(await profileService.addresses()); } catch (error) { toast.error(error instanceof Error ? error.message : "Unable to load addresses."); }
  };

  useEffect(() => { if (user) void loadAddresses(); }, [user?.id]);

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center py-12">
          <EmptyState
            title="Please sign in"
            description="You need to be logged in to view your profile"
            action={{
              label: "Sign In",
              onClick: () => navigate({ to: "/login" }),
            }}
          />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
          <span>Home</span><ChevronRight className="h-4 w-4" /><span>My Account</span><ChevronRight className="h-4 w-4" /><span>My Profile</span>
        </div>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">My Profile</h1>
            <p className="mt-1 text-slate-500">Manage your account, addresses and preferences</p>
          </div>
          <Button
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => {
              logout();
              navigate({ to: "/" });
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="profile" className="w-full md:flex md:items-start md:gap-6">
          <aside className="mb-6 w-full rounded-xl border border-slate-200 bg-white p-2 shadow-sm md:sticky md:top-4 md:mb-0 md:w-56 md:shrink-0">
            <div className="px-3 py-3 text-center md:text-left">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-amber-50 text-lg font-bold text-orange-600 md:mx-0">{user.full_name.slice(0, 2).toUpperCase()}</div>
              <p className="font-semibold text-slate-900">{user.full_name}</p>
              <p className="truncate text-sm text-slate-500">{user.email}</p>
            </div>
            <TabsList className="grid h-auto w-full grid-cols-2 gap-1 bg-transparent p-0 md:block">
              <TabsTrigger className="w-full justify-start" value="profile">Profile Overview</TabsTrigger>
              <TabsTrigger data-addresses-tab className="w-full justify-start" value="addresses">Addresses</TabsTrigger>
              <TabsTrigger className="w-full justify-start" value="preferences">Preferences</TabsTrigger>
              <TabsTrigger className="w-full justify-start" value="payments">Payment Modes</TabsTrigger>
            </TabsList>
          </aside>
          <div className="min-w-0 flex-1">

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="space-y-6">
              <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-lg font-bold text-slate-900">Profile Overview</h2>
                <div className="mb-6 grid divide-y rounded-lg border border-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                  <StatItem icon={<ShoppingBag />} label="Orders" value="View" onClick={() => navigate({ to: "/orders" })} />
                  <StatItem icon={<Heart />} label="Wishlist" value="View" onClick={() => navigate({ to: "/wishlist" })} />
                  <StatItem icon={<MapPin />} label="Saved Addresses" value={String(addresses.length)} />
                </div>
                <ProfileSection user={user} onSave={async (payload) => {
              const updated = await profileService.update(payload);
              setUser(updated, tokens ?? undefined);
              toast.success("Profile updated.");
                }} />
              </section>
              <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between"><div><h2 className="font-bold text-slate-900">Saved Addresses</h2><p className="mt-1 text-sm text-slate-500">Keep delivery details ready for a faster checkout.</p></div><Button variant="outline" onClick={() => document.querySelector<HTMLButtonElement>('[data-addresses-tab]')?.click()}>Manage addresses</Button></div>
              </section>
            </div>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="space-y-6">
            <AddressesSection addresses={addresses} onChanged={() => void loadAddresses()} />
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <PreferencesSection />
          </TabsContent>
          <TabsContent value="payments" className="mt-0"><PaymentModesSection /></TabsContent>
          </div>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}

function StatItem({ icon, label, value, onClick }: { icon: ReactNode; label: string; value: string; onClick?: () => void }) {
  return <button type="button" onClick={onClick} className="flex min-w-0 items-center gap-3 p-4 text-left transition hover:bg-slate-50 disabled:cursor-default"><span className="rounded-full bg-orange-50 p-2 text-orange-600">{icon}</span><span><span className="block text-sm text-slate-500">{label}</span><span className="block font-semibold text-slate-900">{value}</span></span></button>;
}

function PaymentModesSection() {
  const [modes, setModes] = useState([{ id: "upi", label: "UPI / Card payment", description: "Secure online payment through Stripe", enabled: true, icon: <CreditCard className="h-5 w-5" /> }, { id: "cod", label: "Cash on Delivery", description: "Pay when your order is delivered", enabled: true, icon: <Banknote className="h-5 w-5" /> }]);
  return <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-6"><h2 className="text-lg font-bold text-slate-900">Payment Modes</h2><p className="mt-1 text-sm text-slate-500">Select your preferred payment method during checkout.</p></div><div className="grid gap-4 md:grid-cols-2">{modes.map((mode) => <article key={mode.id} className="rounded-xl border border-slate-200 p-5"><div className="flex items-start justify-between gap-4"><div className="flex gap-3"><div className="rounded-full bg-orange-50 p-3 text-orange-600">{mode.icon}</div><div><p className="font-semibold text-slate-900">{mode.label}</p><p className="mt-1 text-sm text-slate-500">{mode.description}</p></div></div><button type="button" role="switch" aria-label={`Toggle ${mode.label}`} aria-checked={mode.enabled} onClick={() => setModes((current) => current.map((item) => item.id === mode.id ? { ...item, enabled: !item.enabled } : item))} className={`h-6 w-11 shrink-0 rounded-full p-1 transition ${mode.enabled ? "bg-orange-500" : "bg-slate-300"}`}><span className={`block h-4 w-4 rounded-full bg-white transition ${mode.enabled ? "translate-x-5" : "translate-x-0"}`} /></button></div><p className="mt-5 text-xs text-slate-400">{mode.enabled ? "Available at checkout" : "Hidden from your checkout options"}</p></article>)}</div></section>;
}

function ProfileSection({ user, onSave }: { user: ProfileUser; onSave: (payload: { full_name: string; email: string }) => Promise<void> }) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.full_name,
    email: user.email,
  });

  return (
    <div className="border rounded-lg p-6 max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setEditing(!editing);
            if (editing) {
              setFormData({ name: user.full_name, email: user.email });
            }
          }}
        >
          {editing ? (
            <>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>

      <div className="space-y-4">
        {editing ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <Button onClick={async () => {
              try { await onSave({ full_name: formData.name, email: formData.email }); setEditing(false); }
              catch (error) { toast.error(error instanceof Error ? error.message : "Unable to update profile."); }
            }}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold text-gray-900">{user.full_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-900">{user.email}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function AddressesSection({ addresses, onChanged }: { addresses: CustomerAddressRecord[]; onChanged: () => void }) {
  const emptyForm = { recipient_name: "", line1: "", city: "", state: "", postal_code: "" };
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CustomerAddressRecord | null>(null);
  const [form, setForm] = useState(emptyForm);
  const save = async () => {
    try {
      await profileService.saveAddress(form, editing?.id);
      toast.success(editing ? "Address updated." : "Address added.");
      setOpen(false); setEditing(null); setForm(emptyForm); onChanged();
    } catch (error) { toast.error(error instanceof Error ? error.message : "Unable to save address."); }
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900">Saved Addresses</h2>
        <Button onClick={() => { setEditing(null); setForm(emptyForm); setOpen(true); }}>Add New Address</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div key={addr.id} className="border rounded-lg p-4 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-gray-900">{addr.recipient_name}</h3>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  {addr.line1}, {addr.city}, {addr.state} {addr.postal_code}
                </span>
              </p>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => { setEditing(addr); setForm({ recipient_name: addr.recipient_name, line1: addr.line1, city: addr.city, state: addr.state, postal_code: addr.postal_code }); setOpen(true); }}>
                Edit
              </Button>
              <Button variant="outline" size="sm" className="flex-1 text-red-600" onClick={async () => { if (!window.confirm("Delete this address?")) return; try { await profileService.deleteAddress(addr.id); toast.success("Address deleted."); onChanged(); } catch (error) { toast.error(error instanceof Error ? error.message : "Unable to delete address."); } }}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}><DialogContent><DialogHeader><DialogTitle>{editing ? "Edit Address" : "Add Address"}</DialogTitle></DialogHeader><div className="grid gap-3"><Input placeholder="Recipient name" value={form.recipient_name} onChange={(e) => setForm({ ...form, recipient_name: e.target.value })} /><Input placeholder="Address line" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} /><div className="grid grid-cols-2 gap-3"><Input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /><Input placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} /></div><Input placeholder="Postal code" value={form.postal_code} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} /></div><DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => void save()}>Save Address</Button></DialogFooter></DialogContent></Dialog>
    </div>
  );
}

function PreferencesSection() {
  return (
    <div className="border rounded-lg p-6 max-w-2xl space-y-4">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Preferences</h2>

      <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
        <input type="checkbox" defaultChecked className="rounded" />
        <div>
          <p className="font-medium text-gray-900">Email Notifications</p>
          <p className="text-sm text-gray-600">Receive order updates and special offers</p>
        </div>
      </label>

      <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
        <input type="checkbox" defaultChecked className="rounded" />
        <div>
          <p className="font-medium text-gray-900">SMS Updates</p>
          <p className="text-sm text-gray-600">Get delivery and order status via SMS</p>
        </div>
      </label>

      <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
        <input type="checkbox" className="rounded" />
        <div>
          <p className="font-medium text-gray-900">Marketing Emails</p>
          <p className="text-sm text-gray-600">Receive promotions and new collections</p>
        </div>
      </label>

      <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
        <input type="checkbox" defaultChecked className="rounded" />
        <div>
          <p className="font-medium text-gray-900">Wishlist Reminders</p>
          <p className="text-sm text-gray-600">Get notified when wishlisted items go on sale</p>
        </div>
      </label>
    </div>
  );
}
