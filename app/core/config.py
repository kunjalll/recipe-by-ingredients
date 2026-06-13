from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/recipes"
    google_api_key: str | None = None
    gemini_model: str = "gemini-2.5-flash"


settings = Settings()


def get_google_api_key() -> str | None:
    key = settings.google_api_key
    if key is None:
        return None
    key = key.strip()
    return key or None
