from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.modules.ai_assistant.application.service import answer_prompt, get_conversation_for_user, submit_feedback
from app.modules.ai_assistant.domain.models import AIAssistantFeedback, AIConversationContext, AIToolInvocation
from app.modules.cart.application.service import add_item_to_cart
from app.modules.catalog.application.schemas import (
    BrandCreateRequest,
    CategoryCreateRequest,
    ProductCreateRequest,
    ProductVariantPayload,
)
from app.modules.catalog.application.service import create_brand, create_category, create_product
from app.modules.checkout.application.service import place_order_from_cart
from app.modules.identity.application.schemas import UserRegisterRequest
from app.modules.identity.application.service import ensure_default_admin, register_user
from app.modules.shipping.application.service import update_shipment_status


def test_ai_assistant_support_memory_and_feedback(db_session: Session) -> None:
    ensure_default_admin(db_session, settings.admin_email, settings.admin_password)
    customer = register_user(
        db_session,
        UserRegisterRequest(email="assistant-upgrade@example.com", full_name="Assistant User", password="Password123!"),
    )
    category = create_category(db_session, CategoryCreateRequest(name="Mobiles", slug="mobiles"))
    brand = create_brand(db_session, BrandCreateRequest(name="Nova", slug="nova"))
    product = create_product(
        db_session,
        ProductCreateRequest(
            category_id=category.id,
            brand_id=brand.id,
            name="Nova Phone",
            slug="nova-phone",
            short_description="Camera phone",
            description="Support flow test product",
            is_published=True,
            variants=[
                ProductVariantPayload(
                    name="128GB",
                    sku="NOVA-128",
                    price=Decimal("12999.00"),
                    currency="INR",
                    quantity_available=5,
                    is_default=True,
                )
            ],
            media=[],
        ),
    )

    add_item_to_cart(db_session, user_id=customer.user.id, variant_id=product.variants[0].id, quantity=1)
    order = place_order_from_cart(
        db_session,
        user_id=customer.user.id,
        shipping_name="Assistant User",
        address_line1="123 Market Street",
        city="Jaipur",
        state="Rajasthan",
        postal_code="302001",
        payment_method="card",
        payment_reference="AI-UPGRADE-PAY-001",
        idempotency_key="ai-upgrade-order-001",
    )
    update_shipment_status(
        db_session,
        order_id=order.id,
        status="shipped",
        tracking_number="TRACK-001",
        note="Order left warehouse",
    )
    db_session.commit()

    conversation, answer, products, intent, used_tools, metadata = answer_prompt(
        db_session,
        prompt="track my latest order",
        user_id=customer.user.id,
        conversation_id=None,
    )
    assert conversation.id
    assert intent == "shipping_support"
    assert "orders.lookup" in used_tools
    assert "shipping.status" in used_tools
    assert "latest order" in answer.lower() or "shipment status" in answer.lower()
    assert isinstance(metadata.get("shipment"), dict)
    assert products == []

    _, return_answer, _, return_intent, return_tools, return_metadata = answer_prompt(
        db_session,
        prompt="what is your return refund policy",
        user_id=customer.user.id,
        conversation_id=conversation.id,
    )
    assert return_intent == "return_support"
    assert "knowledge.return_policy" in return_tools
    assert "refund" in return_answer.lower() or "return" in return_answer.lower()
    assert isinstance(return_metadata.get("knowledge"), list)

    stored_conversation, messages, context = get_conversation_for_user(
        db_session,
        conversation_id=conversation.id,
        user_id=customer.user.id,
    )
    assert stored_conversation.id == conversation.id
    assert len(messages) == 4
    assert context is not None
    assert context.message_count >= 4

    feedback = submit_feedback(
        db_session,
        conversation_id=conversation.id,
        user_id=customer.user.id,
        message_id=messages[-1].id,
        rating="helpful",
        feedback_text="Good order summary",
    )
    assert feedback.rating == "helpful"

    context_row = db_session.scalar(
        select(AIConversationContext).where(AIConversationContext.conversation_id == conversation.id)
    )
    feedback_row = db_session.scalar(select(AIAssistantFeedback).where(AIAssistantFeedback.id == feedback.id))
    invocations = list(
        db_session.scalars(
            select(AIToolInvocation).where(AIToolInvocation.conversation_id == conversation.id)
        ).all()
    )

    assert context_row
    assert feedback_row
    assert len(invocations) >= 4


def test_ai_assistant_multi_intent_policy_and_auth_routing(db_session: Session) -> None:
    conversation, answer, products, intent, used_tools, metadata = answer_prompt(
        db_session,
        prompt="What is the return policy and can you track my latest order?",
        user_id=None,
        conversation_id=None,
    )

    assert conversation.id
    assert products == []
    assert intent in {"policy_help", "shipping_support"}
    assert "knowledge.return_policy" in used_tools
    assert metadata.get("requires_authentication") is True
    assert "return" in answer.lower()
    assert "sign in" in answer.lower()
