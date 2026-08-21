from datetime import datetime

from pydantic import BaseModel, ConfigDict


class BackgroundJobResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    job_type: str
    payload_json: str
    status: str
    attempts: int
    max_attempts: int
    last_error: str
    available_at: datetime
    created_at: datetime
    updated_at: datetime


class JobRunSummaryResponse(BaseModel):
    processed: int
    completed: int
    failed: int
