from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class CategoryCreateRequest(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    slug: str = Field(min_length=2, max_length=140)
    parent_id: str | None = None


class BrandCreateRequest(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    slug: str = Field(min_length=2, max_length=140)


class ProductMediaPayload(BaseModel):
    media_url: str
    alt_text: str = ""
    sort_order: int = 0


class ProductVariantPayload(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    sku: str = Field(min_length=2, max_length=120)
    price: Decimal = Field(gt=0)
    currency: str = Field(min_length=3, max_length=3, default="INR")
    quantity_available: int = Field(ge=0, default=0)
    is_default: bool = False


class ProductCreateRequest(BaseModel):
    seller_id: str | None = None
    category_id: str
    brand_id: str | None = None
    name: str = Field(min_length=2, max_length=180)
    slug: str = Field(min_length=2, max_length=200)
    short_description: str = Field(default="", max_length=255)
    description: str = ""
    is_published: bool = False
    variants: list[ProductVariantPayload] = Field(min_length=1)
    media: list[ProductMediaPayload] = Field(default_factory=list)


class ProductUpdateRequest(BaseModel):
    category_id: str | None = None
    brand_id: str | None = None
    name: str | None = Field(default=None, min_length=2, max_length=180)
    slug: str | None = Field(default=None, min_length=2, max_length=200)
    short_description: str | None = Field(default=None, max_length=255)
    description: str | None = None
    is_published: bool | None = None


class CategoryUpdateRequest(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=120)
    slug: str | None = Field(default=None, min_length=2, max_length=140)
    parent_id: str | None = None


class BrandUpdateRequest(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=120)
    slug: str | None = Field(default=None, min_length=2, max_length=140)


class CategoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    slug: str
    parent_id: str | None


class BrandResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    slug: str


class ProductVariantResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    sku: str
    price: Decimal
    currency: str
    quantity_available: int
    inventory_on_hand: int
    inventory_reserved: int
    is_default: bool


class ProductMediaResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    media_url: str
    alt_text: str
    sort_order: int


class ProductResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    category_id: str
    brand_id: str | None
    name: str
    slug: str
    short_description: str
    description: str
    is_published: bool
    variants: list[ProductVariantResponse]
    media: list[ProductMediaResponse]


class CatalogSeedResponse(BaseModel):
    categories_created: int
    brands_created: int
    products_created: int
    products_skipped: int
