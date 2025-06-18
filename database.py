# database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./Key.db"

# Создаем движок для подключения к БД
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
    
)

# Базовый класс для моделей
class Base(DeclarativeBase):
    pass

# Фабрика сессий для работы с БД
SessionLocal = sessionmaker(autoflush=False, bind=engine)

# Функция для получения сессии БД (будет использоваться в зависимостях)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()