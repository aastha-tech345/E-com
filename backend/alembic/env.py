from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config, pool

from app.core.config import settings
from app.modules.ai_assistant.domain import models as ai_models  # noqa: F401
from app.modules.analytics.domain import models as analytics_models  # noqa: F401
from app.modules.background_jobs.domain import models as background_job_models  # noqa: F401
from app.core.database import Base
from app.modules.cart.domain import models as cart_models  # noqa: F401
from app.modules.catalog.domain import models as catalog_models  # noqa: F401
from app.modules.checkout.domain import models as checkout_models  # noqa: F401
from app.modules.identity.domain import models as identity_models  # noqa: F401
from app.modules.inventory.domain import models as inventory_models  # noqa: F401
from app.modules.notifications.domain import models as notifications_models  # noqa: F401
from app.modules.orders.domain import models as orders_models  # noqa: F401
from app.modules.payments.domain import models as payments_models  # noqa: F401
from app.modules.pricing.domain import models as pricing_models  # noqa: F401
from app.modules.promotions.domain import models as promotions_models  # noqa: F401
from app.modules.recommendations.domain import models as recommendations_models  # noqa: F401
from app.modules.reviews.domain import models as reviews_models  # noqa: F401
from app.modules.returns.domain import models as returns_models  # noqa: F401
from app.modules.search.domain import models as search_models  # noqa: F401
from app.modules.settlements.domain import models as settlements_models  # noqa: F401
from app.modules.shipping.domain import models as shipping_models  # noqa: F401
from app.modules.wishlist.domain import models as wishlist_models  # noqa: F401

config = context.config
config.set_main_option("sqlalchemy.url", settings.database_url)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    context.configure(url=settings.database_url, target_metadata=target_metadata, literal_binds=True)
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
