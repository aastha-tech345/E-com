from collections.abc import Awaitable, Callable
from pathlib import Path
from uuid import uuid4

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from starlette.responses import Response

from app.core.cache import cache_backend
from app.core.config import settings
from app.core.database import SessionLocal
from app.core.health import cache_ready, database_ready
from app.modules.admin.presentation.routes import router as admin_router
from app.modules.ai_assistant.presentation.routes import router as ai_router
from app.modules.analytics.presentation.routes import router as analytics_router
from app.modules.background_jobs.presentation.routes import router as background_jobs_router
from app.modules.cart.presentation.routes import router as cart_router
from app.modules.catalog.presentation.routes import router as catalog_router
from app.modules.checkout.presentation.routes import router as checkout_router
from app.modules.identity.presentation.routes import router as identity_router
from app.modules.inventory.presentation.routes import router as inventory_router
from app.modules.notifications.presentation.routes import router as notifications_router
from app.modules.orders.presentation.routes import router as orders_router
from app.modules.payments.presentation.routes import router as payments_router
from app.modules.pricing.presentation.routes import router as pricing_router
from app.modules.promotions.presentation.routes import router as promotions_router
from app.modules.recommendations.presentation.routes import router as recommendations_router
from app.modules.returns.presentation.routes import admin_router as admin_returns_router
from app.modules.returns.presentation.routes import router as returns_router
from app.modules.reviews.presentation.routes import router as reviews_router
from app.modules.search.presentation.routes import router as search_router
from app.modules.seller.presentation.routes import router as seller_router
from app.modules.settlements.presentation.routes import router as settlements_router
from app.modules.shipping.presentation.routes import customer_router as customer_shipping_router
from app.modules.shipping.presentation.routes import router as shipping_router
from app.modules.wishlist.presentation.routes import router as wishlist_router

app = FastAPI(
    title="Marketplace API",
    version="0.1.0",
    openapi_url=f"{settings.api_prefix}/openapi.json",
)

UPLOADS_DIR = Path(__file__).resolve().parents[1] / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def security_headers(
    request: Request,
    call_next: Callable[[Request], Awaitable[Response]],
) -> Response:
    response = await call_next(request)
    response.headers["X-Request-Id"] = request.headers.get("X-Request-Id", str(uuid4()))
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "same-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    response.headers["Cross-Origin-Opener-Policy"] = "same-origin"
    response.headers["Cross-Origin-Resource-Policy"] = "same-site"
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; img-src 'self' https: data:; style-src 'self' 'unsafe-inline'; "
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' http: https:"
    )
    if settings.app_env != "development":
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response


@app.get("/health", tags=["health"])
def healthcheck() -> dict[str, str]:
    return {"status": "ok", "cache_backend": cache_backend.backend_name}


@app.get("/health/live", tags=["health"])
def liveness() -> dict[str, str]:
    return {"status": "alive"}


@app.get("/health/ready", tags=["health"])
def readiness() -> JSONResponse:
    db = SessionLocal()
    try:
        db_ok = database_ready(db)
    finally:
        db.close()
    cache_ok = cache_ready()
    if db_ok and cache_ok:
        return JSONResponse(
            status_code=200,
            content={"status": "ready", "database": "ok", "cache": cache_backend.backend_name},
        )
    return JSONResponse(
        status_code=503,
        content={
            "status": "degraded",
            "database": "ok" if db_ok else "down",
            "cache": cache_backend.backend_name if cache_ok else "down",
        },
    )


app.include_router(identity_router, prefix=settings.api_prefix)
app.include_router(catalog_router, prefix=settings.api_prefix)
app.include_router(admin_router, prefix=settings.api_prefix)
app.include_router(inventory_router, prefix=settings.api_prefix)
app.include_router(pricing_router, prefix=settings.api_prefix)
app.include_router(cart_router, prefix=settings.api_prefix)
app.include_router(checkout_router, prefix=settings.api_prefix)
app.include_router(orders_router, prefix=settings.api_prefix)
app.include_router(shipping_router, prefix=settings.api_prefix)
app.include_router(customer_shipping_router, prefix=settings.api_prefix)
app.include_router(returns_router, prefix=settings.api_prefix)
app.include_router(admin_returns_router, prefix=settings.api_prefix)
app.include_router(notifications_router, prefix=settings.api_prefix)
app.include_router(payments_router, prefix=settings.api_prefix)
app.include_router(reviews_router, prefix=settings.api_prefix)
app.include_router(seller_router, prefix=settings.api_prefix)
app.include_router(settlements_router, prefix=settings.api_prefix)
app.include_router(background_jobs_router, prefix=settings.api_prefix)
app.include_router(search_router, prefix=settings.api_prefix)
app.include_router(wishlist_router, prefix=settings.api_prefix)
app.include_router(promotions_router, prefix=settings.api_prefix)
app.include_router(analytics_router, prefix=settings.api_prefix)
app.include_router(recommendations_router, prefix=settings.api_prefix)
app.include_router(ai_router, prefix=settings.api_prefix)
