from decimal import Decimal
from typing import TypedDict

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.modules.orders.domain.models import OrderItem
from app.modules.settlements.domain.models import SellerSettlement, SellerSettlementItem


class SellerSettlementSummary(TypedDict):
    pending_total: Decimal
    paid_total: Decimal
    settlement_count: int


def create_settlement_for_order_items(db: Session, *, order_items: list[OrderItem]) -> list[SellerSettlement]:
    grouped_items: dict[str, list[OrderItem]] = {}
    for item in order_items:
        seller_key = item.seller_id or "platform"
        grouped_items.setdefault(seller_key, []).append(item)

    settlements: list[SellerSettlement] = []
    for seller_key, seller_items in grouped_items.items():
        settlement = SellerSettlement(
            seller_user_id=None if seller_key == "platform" else seller_key,
            seller_ref=seller_key,
            status="pending",
            total_amount=Decimal("0.00"),
        )
        db.add(settlement)
        db.flush()

        total = Decimal("0.00")
        for item in seller_items:
            total += item.seller_payout_amount
            db.add(
                SellerSettlementItem(
                    settlement_id=settlement.id,
                    order_item_id=item.id,
                    amount=item.seller_payout_amount,
                )
            )
        settlement.total_amount = total.quantize(Decimal("0.01"))
        settlements.append(settlement)
    return settlements


def list_settlements_for_seller(db: Session, *, seller_user_id: str) -> list[SellerSettlement]:
    return list(
        db.scalars(
            select(SellerSettlement)
            .where(SellerSettlement.seller_user_id == seller_user_id)
            .order_by(SellerSettlement.created_at.desc())
        ).all()
    )


def list_all_settlements(db: Session) -> list[SellerSettlement]:
    return list(db.scalars(select(SellerSettlement).order_by(SellerSettlement.created_at.desc())).all())


def mark_settlement_paid(db: Session, *, settlement_id: str, payout_reference: str) -> SellerSettlement:
    settlement = db.get(SellerSettlement, settlement_id)
    if settlement is None:
        raise ValueError("Settlement not found.")
    settlement.status = "paid"
    settlement.payout_reference = payout_reference
    settlement.paid_at = func.now()
    db.add(settlement)
    db.commit()
    db.refresh(settlement)
    return settlement


def get_seller_settlement_summary(db: Session, *, seller_user_id: str) -> SellerSettlementSummary:
    pending_total = db.scalar(
        select(func.coalesce(func.sum(SellerSettlement.total_amount), 0)).where(
            SellerSettlement.seller_user_id == seller_user_id,
            SellerSettlement.status == "pending",
        )
    ) or Decimal("0.00")
    paid_total = db.scalar(
        select(func.coalesce(func.sum(SellerSettlement.total_amount), 0)).where(
            SellerSettlement.seller_user_id == seller_user_id,
            SellerSettlement.status == "paid",
        )
    ) or Decimal("0.00")
    settlement_count = db.scalar(
        select(func.count()).select_from(SellerSettlement).where(SellerSettlement.seller_user_id == seller_user_id)
    ) or 0
    return {
        "pending_total": Decimal(str(pending_total)),
        "paid_total": Decimal(str(paid_total)),
        "settlement_count": settlement_count,
    }
