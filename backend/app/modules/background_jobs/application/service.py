from __future__ import annotations

import json
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.cache import cache_backend
from app.modules.background_jobs.domain.models import BackgroundJob


def enqueue_job(
    db: Session,
    *,
    job_type: str,
    payload: dict[str, str | int | float | bool | None] | None = None,
    max_attempts: int = 3,
) -> BackgroundJob:
    job = BackgroundJob(
        job_type=job_type,
        payload_json=json.dumps(payload or {}),
        status="queued",
        attempts=0,
        max_attempts=max_attempts,
    )
    db.add(job)
    return job


def list_jobs(db: Session, *, status: str | None = None) -> list[BackgroundJob]:
    statement = select(BackgroundJob).order_by(BackgroundJob.created_at.desc())
    if status is not None:
        statement = statement.where(BackgroundJob.status == status)
    return list(db.scalars(statement).all())


def process_pending_jobs(db: Session, *, limit: int = 20) -> tuple[int, int, int]:
    jobs = list(
        db.scalars(
            select(BackgroundJob)
            .where(
                BackgroundJob.status.in_(("queued", "failed")),
                BackgroundJob.available_at <= datetime.now(timezone.utc),
            )
            .order_by(BackgroundJob.created_at.asc())
            .limit(limit)
        ).all()
    )
    completed = 0
    failed = 0

    for job in jobs:
        job.status = "running"
        job.attempts += 1
        db.flush()
        try:
            _run_job(db, job)
            job.status = "completed"
            job.last_error = ""
            completed += 1
        except ValueError as exc:
            job.last_error = str(exc)
            job.status = "failed" if job.attempts < job.max_attempts else "dead"
            failed += 1
        db.add(job)

    db.commit()
    return len(jobs), completed, failed


def _run_job(db: Session, job: BackgroundJob) -> None:
    if job.job_type == "analytics.refresh_summary":
        from app.modules.analytics.application.service import analytics_summary

        summary = analytics_summary(db)
        cache_backend.set("analytics:summary", summary.model_dump())
        return

    if job.job_type == "search.refresh_popular":
        from app.modules.search.application.service import get_popular_search_terms

        cache_backend.set("search:popular", get_popular_search_terms(db, limit=10))
        return

    raise ValueError(f"Unknown job type: {job.job_type}")
