import { Link } from "@tanstack/react-router";
import { LogIn, ShoppingCart } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface LoginRequiredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginRequiredDialog({ open, onOpenChange }: LoginRequiredDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md rounded-2xl border-zinc-200 bg-white p-0 shadow-2xl shadow-black/20">
        <div className="rounded-t-2xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-700 p-5 text-white">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
            <ShoppingCart size={22} />
          </div>
          <AlertDialogHeader className="space-y-2 text-left">
            <AlertDialogTitle className="text-xl font-bold text-white">
              Login required
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-6 text-zinc-200">
              Please sign in to add this product to your cart. After login, you can continue shopping from the same page.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter className="gap-2 p-5 sm:space-x-0">
          <AlertDialogCancel className="mt-0 rounded-full border-zinc-300">
            Not now
          </AlertDialogCancel>
          <AlertDialogAction asChild className="rounded-full bg-blue-600 text-white hover:bg-blue-700">
            <Link to="/login">
              <LogIn size={16} />
              Sign in
            </Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
