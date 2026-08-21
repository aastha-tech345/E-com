from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.inventory.domain.models import InventoryItem, InventoryMovement


def ensure_inventory_item(
    db: Session,
    *,
    variant_id: str,
    on_hand: int = 0,
    warehouse_code: str = "primary",
) -> InventoryItem:
    item = db.scalar(
        select(InventoryItem).where(
            InventoryItem.variant_id == variant_id,
            InventoryItem.warehouse_code == warehouse_code,
        )
    )
    if item is not None:
        return item

    item = InventoryItem(variant_id=variant_id, warehouse_code=warehouse_code, on_hand=on_hand, reserved=0)
    db.add(item)
    return item


def set_inventory_level(
    db: Session,
    *,
    variant_id: str,
    on_hand: int,
    reason: str,
    warehouse_code: str = "primary",
) -> InventoryItem:
    item = ensure_inventory_item(db, variant_id=variant_id, warehouse_code=warehouse_code)
    delta = on_hand - item.on_hand
    item.on_hand = on_hand
    db.add(InventoryMovement(inventory_item=item, delta=delta, reason=reason))
    return item


def get_inventory_item(db: Session, *, variant_id: str, warehouse_code: str = "primary") -> InventoryItem | None:
    return db.scalar(
        select(InventoryItem).where(
            InventoryItem.variant_id == variant_id,
            InventoryItem.warehouse_code == warehouse_code,
        )
    )


def reserve_inventory(db: Session, *, variant_id: str, quantity: int, warehouse_code: str = "primary") -> InventoryItem:
    item = ensure_inventory_item(db, variant_id=variant_id, warehouse_code=warehouse_code)
    if item.available < quantity:
        raise ValueError("Insufficient inventory for requested quantity.")
    item.reserved += quantity
    db.add(InventoryMovement(inventory_item=item, delta=0, reason=f"reserve:{quantity}"))
    return item


def release_inventory(db: Session, *, variant_id: str, quantity: int, warehouse_code: str = "primary") -> InventoryItem:
    item = ensure_inventory_item(db, variant_id=variant_id, warehouse_code=warehouse_code)
    if item.reserved < quantity:
        raise ValueError("Reserved inventory is lower than release quantity.")
    item.reserved -= quantity
    db.add(InventoryMovement(inventory_item=item, delta=0, reason=f"release:{quantity}"))
    return item


def commit_inventory(db: Session, *, variant_id: str, quantity: int, warehouse_code: str = "primary") -> InventoryItem:
    item = ensure_inventory_item(db, variant_id=variant_id, warehouse_code=warehouse_code)
    if item.reserved < quantity or item.on_hand < quantity:
        raise ValueError("Inventory cannot be committed for this quantity.")
    item.reserved -= quantity
    item.on_hand -= quantity
    db.add(InventoryMovement(inventory_item=item, delta=-quantity, reason=f"commit:{quantity}"))
    return item


def restock_inventory(db: Session, *, variant_id: str, quantity: int, warehouse_code: str = "primary") -> InventoryItem:
    item = ensure_inventory_item(db, variant_id=variant_id, warehouse_code=warehouse_code)
    item.on_hand += quantity
    db.add(InventoryMovement(inventory_item=item, delta=quantity, reason=f"restock:{quantity}"))
    return item
