from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.pricing.domain.models import VariantPrice


def create_default_price(
    db: Session,
    *,
    variant_id: str,
    amount: Decimal,
    currency: str,
) -> VariantPrice:
    price = VariantPrice(
        variant_id=variant_id,
        price_list_name="default",
        amount=amount,
        currency=currency,
        is_active=True,
    )
    db.add(price)
    return price


def get_active_price(db: Session, *, variant_id: str) -> VariantPrice | None:
    return db.scalar(
        select(VariantPrice).where(
            VariantPrice.variant_id == variant_id,
            VariantPrice.price_list_name == "default",
            VariantPrice.is_active.is_(True),
        )
    )


def set_active_price(db: Session, *, variant_id: str, amount: Decimal, currency: str) -> VariantPrice:
    price = get_active_price(db, variant_id=variant_id)
    if price is None:
        price = VariantPrice(
            variant_id=variant_id,
            price_list_name="default",
            amount=amount,
            currency=currency,
            is_active=True,
        )
        db.add(price)
        return price

    price.amount = amount
    price.currency = currency
    return price
