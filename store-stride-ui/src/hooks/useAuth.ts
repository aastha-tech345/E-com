import { useShop } from "@/store/shop";
import { authService } from "@/services";

/**
 * Hook to get authentication information and check user roles
 * Usage: const { user, isAdmin, isSeller, logout } = useAuth()
 */
export function useAuth() {
  const { user, admin } = useShop();

  const getCurrentUser = () => user || admin || null;

  const getCurrentRoles = (): string[] => {
    const currentUser = getCurrentUser();
    return currentUser?.roles ?? authService.getUserRoles();
  };

  const isAuthenticated = (): boolean => {
    return !!user || !!admin;
  };

  const isAdmin = (): boolean => {
    return getCurrentRoles().some((role) => ["super_admin", "admin_catalog"].includes(role));
  };

  const isSeller = (): boolean => {
    return getCurrentRoles().includes("seller_owner");
  };

  const hasAdminAccess = (): boolean => {
    return isAdmin() || isSeller();
  };

  const isCustomer = (): boolean => {
    const roles = getCurrentRoles();
    return roles.includes("customer") && !isAdmin() && !isSeller();
  };

  const hasRole = (role: string): boolean => {
    const roles = getCurrentRoles();
    return roles.includes(role);
  };

  const hasAnyRole = (roles: string[]): boolean => {
    const userRoles = getCurrentRoles();
    return roles.some((role) => userRoles.includes(role));
  };

  const getUserId = (): string | null => {
    const currentUser = getCurrentUser();
    return currentUser?.id || null;
  };

  const getUserEmail = (): string | null => {
    const currentUser = getCurrentUser();
    return currentUser?.email || null;
  };

  const getUserRoles = (): string[] => {
    return getCurrentRoles();
  };

  const getAccessToken = (): string | null => {
    return authService.getAccessToken();
  };

  return {
    user: getCurrentUser(),
    isAuthenticated,
    isAdmin,
    isSeller,
    hasAdminAccess,
    isCustomer,
    hasRole,
    hasAnyRole,
    getUserId,
    getUserEmail,
    getUserRoles,
    getAccessToken,
  };
}
