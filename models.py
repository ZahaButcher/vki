# models.py
from sqlalchemy import Column, Integer, String, Date, ForeignKey
from database import Base
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
import json


class Person(Base):
    __tablename__ = "users"
    
    id = Column(Integer, autoincrement=True, primary_key=True)  # Основной уникальный ID
    email = Column(String(50), unique=True, nullable=False)         # Уникальный, но не PK
    first_name = Column(String(50))
    last_name = Column(String(50))
    role = Column(String(10))
    username = Column(String(50), unique=True)
    password = Column(String(120))  


class Announcements(Base):
    __tablename__ = "announcements"
    
    id = Column(Integer, autoincrement=True, primary_key=True)  # Основной уникальный ID
    title = Column(String(50), nullable=False)         # Уникальный, но не PK
    content = Column()
    publication_data = Column(Date)
    last_updated_date = Column(Date)
    author_id = Column(Integer, ForeignKey('users.id'))
    author = relationship("Person", lazy="joined")
    expiry_date = Column(String(120))  
    attachment = Column(String)
    