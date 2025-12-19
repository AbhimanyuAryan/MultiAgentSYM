from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False
    )

    # API Keys
    agentica_api_key: str

    # Database
    mongodb_uri: str = "mongodb://127.0.0.1:27017/fashion-cube"
    redis_url: str = "redis://localhost:6379"

    # Node.js Integration
    nodejs_api_url: str = "http://localhost:3000"

    # Agent Configuration
    default_agent_model: str = "anthropic:claude-sonnet-4.5"
    sub_agent_model: str = "openai:gpt-4.1"
    agent_max_tokens: int = 4000

    # Caching
    cache_ttl_seconds: int = 300  # 5 minutes

    # Optional
    fastapi_port: int = 8000
    log_level: str = "INFO"

# Global settings instance
settings = Settings()
