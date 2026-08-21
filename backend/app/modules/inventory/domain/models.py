from datetime import datetime
from uuid import uuid4

from sqlalchemy import DateTime, ForeignKey, Integer, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class InventoryItem(Base):
    __tablename__ = "inventory_items"
    __table_args__ = (UniqueConstraint("variant_id", "warehouse_code", name="uq_inventory_variant_warehouse"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    variant_id: Mapped[str] = mapped_column(ForeignKey("product_variants.id", ondelete="CASCADE"), index=True)
    warehouse_code: Mapped[str] = mapped_column(String(40), default="primary")
    on_hand: Mapped[int] = mapped_column(Integer, default=0)
    reserved: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    variant: Mapped["ProductVariant"] = relationship(back_populates="inventory_items")
    movements: Mapped[list["InventoryMovement"]] = relationship(
        back_populates="inventory_item",
        cascade="all, delete-orphan",
    )

    @property
    def available(self) -> int:
        return self.on_hand - self.reserved


class InventoryMovement(Base):
    __tablename__ = "inventory_movements"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    inventory_item_id: Mapped[str] = mapped_column(ForeignKey("inventory_items.id", ondelete="CASCADE"), index=True)
    delta: Mapped[int] = mapped_column(Integer)
    reason: Mapped[str] = mapped_column(String(80))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    inventory_item: Mapped[InventoryItem] = relationship(back_populates="movements")


from app.modules.catalog.domain.models import ProductVariant  # noqa: E402
