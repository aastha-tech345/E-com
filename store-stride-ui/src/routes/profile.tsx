import { useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { User, Mail, Phone, MapPin, LogOut, Edit2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/customer/Header";
import { Footer } from "@/components/customer/Footer";
import { useShop } from "@/store/shop";
import { EmptyState } from "@/components/common/EmptyState";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, addresses } = useShop();

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
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your account and settings</p>
          </div>
          <Button
            variant="destructive"
            onClick={() => {
              logout();
              navigate({ to: "/" });
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <ProfileSection user={user} />
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="space-y-6">
            <AddressesSection addresses={addresses} />
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <PreferencesSection />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}

function ProfileSection({ user }: any) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
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
              setFormData({ name: user.name, email: user.email });
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <Button onClick={() => setEditing(false)}>
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
                <p className="font-semibold text-gray-900">{user.name}</p>
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

function AddressesSection({ addresses }: any) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900">Saved Addresses</h2>
        <Button>Add New Address</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((addr: any) => (
          <div key={addr.id} className="border rounded-lg p-4 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-gray-900">{addr.name}</h3>
              <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {addr.type}
              </span>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {addr.phone}
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  {addr.line1}, {addr.city}, {addr.state} {addr.pincode}
                </span>
              </p>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" className="flex-1">
                Edit
              </Button>
              <Button variant="outline" size="sm" className="flex-1 text-red-600">
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
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
          <p className="text-sm text-gray-600">
            Receive order updates and special offers
          </p>
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
          <p className="text-sm text-gray-600">
            Get notified when wishlisted items go on sale
          </p>
        </div>
      </label>
    </div>
  );
}
