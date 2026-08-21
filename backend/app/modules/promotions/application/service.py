from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.promotions.domain.models import Coupon


def create_coupon(db: Session, *, code: str, description: str, discount_type: str, amount: Decimal) -> Coupon:
    coupon = Coupon(
        code=code.upper(),
        description=description,
        discount_type=discount_type,
        amount=amount,
        is_active=True,
    )
    db.add(coupon)
    db.commit()
    db.refresh(coupon)
    return coupon


def list_coupons(db: Session) -> list[Coupon]:
    return list(db.scalars(select(Coupon).order_by(Coupon.created_at.desc())).all())


def apply_coupon(db: Session, *, code: str, subtotal: Decimal) -> tuple[Coupon | None, Decimal]:
    coupon = db.scalar(select(Coupon).where(Coupon.code == code.upper(), Coupon.is_active.is_(True)))
    if coupon is None:
        raise ValueError("Coupon not found or inactive.")
    if coupon.discount_type == "percent":
        discount = (subtotal * coupon.amount / Decimal("100")).quantize(Decimal("0.01"))
    else:
        discount = coupon.amount
    discount = min(discount, subtotal)
    return coupon, discount
