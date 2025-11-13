from pydantic import BaseSettings

class AppConfig(BaseSettings):
    ENV: str = "development"
    DEBUG: bool = True
    VERSION: str = "1.0.0"

    class Config:
        env_file = ".env"


settings = AppConfig()