import { useShop } from "@/store/shop";
import { authService } from "@/services";

/**
 * Hook to get authentication information and check user roles
 * Usage: const { user, isAdmin, isSeller, logout } = useAuth()
 */
export function useAuth() {
  const { user, admin } = useShop();

  const getCurrentUser = () => user || admin || null;
  
  const isAuthenticated = (): boolean => {
    return !!user || !!admin;
  };

  const isAdmin = (): boolean => {
    return authService.isAdmin();
  };

  const isSeller = (): boolean => {
    return authService.isSeller();
  };

  const hasAdminAccess = (): boolean => {
    return isAdmin() || isSeller();
  };

  const isCustomer = (): boolean => {
    const roles = authService.getUserRoles();
    return roles.includes("customer") && !isAdmin() && !isSeller();
  };

  const hasRole = (role: string): boolean => {
    const roles = authService.getUserRoles();
    return roles.includes(role);
  };

  const hasAnyRole = (roles: string[]): boolean => {
    const userRoles = authService.getUserRoles();
    return roles.some(role => userRoles.includes(role));
  };

  const getUserId = (): string | null => {
    const user = authService.getUser();
    return user?.id || null;
  };

  const getUserEmail = (): string | null => {
    const user = authService.getUser();
    return user?.email || null;
  };

  const getUserRoles = (): string[] => {
    return authService.getUserRoles();
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
