from enum import Enum


class SystemRole(str, Enum):
    CUSTOMER = "customer"
    SELLER_OWNER = "seller_owner"
    ADMIN_CATALOG = "admin_catalog"
    SUPER_ADMIN = "super_admin"
