from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str
    ANTHROPIC_API_KEY: str = ""
    ENV: str = "development"
    SECRET_KEY: str = "dev-secret-change-me-please-32-bytes-min"
    JWT_ALGORITHM: str = "HS256"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
