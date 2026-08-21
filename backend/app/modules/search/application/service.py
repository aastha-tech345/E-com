from collections.abc import Sequence

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.cache import cache_backend
from app.modules.background_jobs.application.service import enqueue_job
from app.modules.catalog.application.service import hydrate_product_read_model, list_products
from app.modules.catalog.domain.models import Product
from app.modules.search.domain.models import SearchQuery


def search_products(
    db: Session,
    *,
    query: str,
    user_id: str | None = None,
) -> tuple[list[Product], SearchQuery]:
    log = SearchQuery(user_id=user_id, query=query)
    db.add(log)
    db.commit()
    db.refresh(log)
    enqueue_job(db, job_type="search.refresh_popular")
    enqueue_job(db, job_type="analytics.refresh_summary")
    db.commit()
    products = [
        hydrate_product_read_model(db, product)
        for product in list_products(db, query=query, published_only=True)
    ]
    return products, log


def get_popular_search_terms(db: Session, *, limit: int = 10) -> list[str]:
    rows: Sequence[str] = db.scalars(
        select(SearchQuery.query)
        .group_by(SearchQuery.query)
        .order_by(func.count(SearchQuery.id).desc(), SearchQuery.query.asc())
        .limit(limit)
    ).all()
    return list(rows)


def get_popular_search_terms_cached(db: Session, *, limit: int = 10) -> tuple[list[str], bool]:
    cached_terms = cache_backend.get("search:popular")
    if cached_terms is not None:
        return list(cached_terms)[:limit], True
    terms = get_popular_search_terms(db, limit=limit)
    cache_backend.set("search:popular", terms)
    return terms, False


def get_search_suggestions(db: Session, *, query: str, limit: int = 5) -> list[str]:
    term = f"{query.lower()}%"
    rows: Sequence[str] = db.scalars(
        select(SearchQuery.query)
        .where(func.lower(SearchQuery.query).like(term))
        .group_by(SearchQuery.query)
        .order_by(func.count(SearchQuery.id).desc(), SearchQuery.query.asc())
        .limit(limit)
    ).all()
    return list(rows)
