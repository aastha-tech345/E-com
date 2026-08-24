"""
Permission definitions for the Store Stride platform.

Permissions are organized by feature domain and define what actions
users with specific roles can perform.
"""

from enum import Enum


class Permission(str, Enum):
    # =======================
    # CATALOG PERMISSIONS
    # =======================
    CATALOG_CREATE_PRODUCT = "catalog:create_product"
    CATALOG_VIEW_PRODUCT = "catalog:view_product"
    CATALOG_EDIT_PRODUCT = "catalog:edit_product"
    CATALOG_DELETE_PRODUCT = "catalog:delete_product"
    CATALOG_MANAGE_CATEGORIES = "catalog:manage_categories"
    CATALOG_MANAGE_BRANDS = "catalog:manage_brands"
    CATALOG_MANAGE_ATTRIBUTES = "catalog:manage_attributes"

    # =======================
    # INVENTORY PERMISSIONS
    # =======================
    INVENTORY_VIEW = "inventory:view"
    INVENTORY_ADJUST = "inventory:adjust"
    INVENTORY_MANAGE = "inventory:manage"

    # =======================
    # ORDER PERMISSIONS
    # =======================
    ORDER_VIEW_OWN = "order:view_own"  # View own orders
    ORDER_VIEW_ALL = "order:view_all"  # View all orders
    ORDER_UPDATE_STATUS = "order:update_status"
    ORDER_CANCEL = "order:cancel"
    ORDER_CREATE_SHIPMENT = "order:create_shipment"

    # =======================
    # RETURN / REFUND PERMISSIONS
    # =======================
    RETURN_CREATE = "return:create"
    RETURN_PROCESS = "return:process"
    REFUND_PROCESS = "refund:process"
    REFUND_APPROVE = "refund:approve"

    # =======================
    # CUSTOMER PERMISSIONS
    # =======================
    CUSTOMER_VIEW_OWN = "customer:view_own"  # View own profile
    CUSTOMER_VIEW_ALL = "customer:view_all"  # View all customers
    CUSTOMER_MANAGE = "customer:manage"

    # =======================
    # PAYMENT PERMISSIONS
    # =======================
    PAYMENT_VIEW = "payment:view"
    PAYMENT_VERIFY = "payment:verify"
    PAYMENT_REFUND = "payment:refund"

    # =======================
    # COUPON / PROMOTION PERMISSIONS
    # =======================
    COUPON_CREATE = "coupon:create"
    COUPON_VIEW = "coupon:view"
    COUPON_EDIT = "coupon:edit"
    COUPON_DELETE = "coupon:delete"

    # =======================
    # ANALYTICS & REPORTING
    # =======================
    ANALYTICS_VIEW = "analytics:view"
    REPORTS_VIEW = "reports:view"
    REPORTS_EXPORT = "reports:export"

    # =======================
    # USER & ROLE MANAGEMENT
    # =======================
    USER_MANAGE = "user:manage"
    ROLE_MANAGE = "role:manage"
    PERMISSION_MANAGE = "permission:manage"

    # =======================
    # ADMIN PERMISSIONS
    # =======================
    ADMIN_ACCESS = "admin:access"
    SETTINGS_VIEW = "settings:view"
    SETTINGS_EDIT = "settings:edit"

    # =======================
    # AI ASSISTANT PERMISSIONS
    # =======================
    AI_CHAT = "ai:chat"
    AI_KNOWLEDGE_BASE = "ai:knowledge_base"


# Permission sets by role
PERMISSION_SETS = {
    "customer": [
        Permission.CATALOG_VIEW_PRODUCT,
        Permission.ORDER_VIEW_OWN,
        Permission.CUSTOMER_VIEW_OWN,
        Permission.RETURN_CREATE,
        Permission.AI_CHAT,
    ],
    "seller_owner": [
        Permission.CATALOG_CREATE_PRODUCT,
        Permission.CATALOG_VIEW_PRODUCT,
        Permission.CATALOG_EDIT_PRODUCT,
        Permission.CATALOG_DELETE_PRODUCT,
        Permission.INVENTORY_VIEW,
        Permission.INVENTORY_ADJUST,
        Permission.ORDER_VIEW_ALL,
        Permission.ORDER_UPDATE_STATUS,
        Permission.ORDER_CREATE_SHIPMENT,
        Permission.CUSTOMER_VIEW_ALL,
        Permission.ANALYTICS_VIEW,
        Permission.REPORTS_VIEW,
        Permission.AI_CHAT,
    ],
    "admin_catalog": [
        Permission.CATALOG_CREATE_PRODUCT,
        Permission.CATALOG_VIEW_PRODUCT,
        Permission.CATALOG_EDIT_PRODUCT,
        Permission.CATALOG_DELETE_PRODUCT,
        Permission.CATALOG_MANAGE_CATEGORIES,
        Permission.CATALOG_MANAGE_BRANDS,
        Permission.CATALOG_MANAGE_ATTRIBUTES,
        Permission.INVENTORY_VIEW,
        Permission.INVENTORY_MANAGE,
    ],
    "admin_orders": [
        Permission.ORDER_VIEW_ALL,
        Permission.ORDER_UPDATE_STATUS,
        Permission.ORDER_CANCEL,
        Permission.ORDER_CREATE_SHIPMENT,
        Permission.RETURN_PROCESS,
        Permission.REFUND_PROCESS,
        Permission.AI_CHAT,
    ],
    "admin_payments": [
        Permission.PAYMENT_VIEW,
        Permission.PAYMENT_VERIFY,
        Permission.PAYMENT_REFUND,
        Permission.REFUND_APPROVE,
    ],
    "admin_customers": [
        Permission.CUSTOMER_VIEW_ALL,
        Permission.CUSTOMER_MANAGE,
        Permission.USER_MANAGE,
    ],
    "admin_marketing": [
        Permission.COUPON_CREATE,
        Permission.COUPON_VIEW,
        Permission.COUPON_EDIT,
        Permission.COUPON_DELETE,
        Permission.ANALYTICS_VIEW,
        Permission.REPORTS_VIEW,
        Permission.REPORTS_EXPORT,
    ],
    "admin_support": [
        Permission.ORDER_VIEW_ALL,
        Permission.CUSTOMER_VIEW_ALL,
        Permission.RETURN_PROCESS,
        Permission.REFUND_PROCESS,
        Permission.AI_CHAT,
    ],
    "super_admin": [
        # Super admin has all permissions
        perm for perm in Permission
    ],
}
