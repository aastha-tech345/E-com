from datetime import datetime
from decimal import Decimal
from uuid import uuid4

from sqlalchemy import Boolean, DateTime, ForeignKey, Numeric, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class VariantPrice(Base):
    __tablename__ = "variant_prices"
    __table_args__ = (
        UniqueConstraint("variant_id", "price_list_name", name="uq_variant_prices_variant_price_list"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    variant_id: Mapped[str] = mapped_column(ForeignKey("product_variants.id", ondelete="CASCADE"), index=True)
    price_list_name: Mapped[str] = mapped_column(String(80), default="default")
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    currency: Mapped[str] = mapped_column(String(3), default="INR")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    variant: Mapped["ProductVariant"] = relationship(back_populates="prices")


from app.modules.catalog.domain.models import ProductVariant  # noqa: E402
