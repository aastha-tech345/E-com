from enum import Enum


class SystemRole(str, Enum):
    CUSTOMER = "customer"
    SELLER_OWNER = "seller_owner"
    ADMIN_CATALOG = "admin_catalog"
    ADMIN_SUPPORT = "admin_support"
    SUPER_ADMIN = "super_admin"
