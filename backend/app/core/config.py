from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "VoyageAI"
    environment: str = "development"
    database_url: str

    jwt_secret_key: str
    jwt_algorithm: str = "HS256"

    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 30

    openai_api_key: str
    openai_model: str = "gpt-4o-mini"

    geoapify_api_key: str
    unsplash_access_key: str

    duffel_access_token: str
    duffel_api_base_url: str = "https://api.duffel.com"
    duffel_api_version: str = "v2"

    currency_api_base_url: str = "https://api.frankfurter.dev"

    liteapi_api_key: str | None = None
    liteapi_base_url: str = "https://api.liteapi.travel"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()