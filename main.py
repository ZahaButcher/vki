from models import *
from database import *
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, desc
from fastapi import Depends, FastAPI, Body, HTTPException, Request, Cookie, Form, UploadFile, File
from pathlib import Path
import shutil
import uuid
from fastapi.responses import JSONResponse, FileResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import hashlib
from datetime import date, timedelta
from fastapi import Response
from pydantic import BaseModel, ConfigDict, Field
from urllib.parse import quote
from typing import List

class LoginRequest(BaseModel):
    email: str
    password: str

    @classmethod
    def as_form(
        cls,
        email: str = Form(...),
        password: str = Form(...)
    ):
        return cls(email=email, password=password)
class AnnouncementResponse(BaseModel):
    id: int
    title: str
    content: str
    publication_data: date
    author_name: str = "Неизвестный автор"
    
    @classmethod
    def from_orm_with_author(cls, obj):
        """конструктор с обработкой автора"""
        author_name = (
            f"{obj.author.first_name} {obj.author.last_name}"
            if obj.author else "Неизвестный автор"
        )
        return cls(
            id=obj.id,
            title=obj.title,
            content=obj.content,
            publication_data=obj.publication_data,
            author_name=author_name
        )
    
    model_config = ConfigDict(from_attributes=True)
# создаем таблицы
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.mount("/static", StaticFiles(directory="public_html", html=True))

@app.get("/")
def main():
    print("\nserver work\n")
    return FileResponse("public_html/index.html")
    
@app.get("/gg")
def main():
    print("\gg\n")
    return {"message":"work"}


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Для разработки можно "*", в продакшене укажите конкретные домены
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# определяем зависимость
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
  
# app.mount("/", StaticFiles(directory="public_html", html=True)) #

# @app.get("/")
# def read_root():
#     return FileResponse("public_html/index.html")

def hash_password(password: str):
    # Создаем хеш-объект SHA-256
    sha_signature = hashlib.sha256(password.encode()).hexdigest()
    return sha_signature




# @app.get("/users/{id}")
# def users(id):
#     return {
#         "user_id":id
#     }

@app.get("/users/{name}-{id}")
def users(name, id:int):
    return {
        "name":name,
        "user_id":id
    }


@app.post("/register")
async def register_user(
    request: Request,
    db: Session = Depends(get_db)
):
    # Получаем данные формы
    form_data = await request.form()
    
    # Извлекаем значения
    first_name = form_data.get("firstName")
    last_name = form_data.get("lastName")
    username = form_data.get("username")
    password = form_data.get("password")
    email = form_data.get("email")
    role = form_data.get("role")
    
    # Проверка уникальности username
    # existing_user = db.query(Person).filter(Person.email == email).first()
    # if existing_user:
    #     raise HTTPException(
    #         status_code=400,
    #         detail={"username": "Этот псевдоним уже занят"}
    #     )


    # Создание нового пользователя
    new_user = Person(
        
        first_name=first_name,
        last_name=last_name,
        username=username,
        email=email,
        role=role,
        password=hash_password(password)
    )
    
    db.add(new_user)
    db.commit()
    JSONResponse({"message": "Пользователь успешно зарегистрирован"})
    
    # return {RedirectResponse(url="static/index.html", status_code=302)}#не работает



@app.get("/api/users")
def get_people(db: Session = Depends(get_db)):
    return db.query(Person).all()

class PersonResponse(BaseModel):
    id: int
    name: str
    age: int
    # другие поля вашей модели Person

@app.get("/api/users", response_model=List[PersonResponse])
def get_people(db: Session = Depends(get_db)):
    users = db.query(Person).all()
    return [{"id": user.id, "name": user.name, "age": user.age} for user in users]


@app.post("/login")
async def login_user(
    response: Response,
    email: str = Form(...),
    password: str = Form(...),
    
    db: Session = Depends(get_db)
):
    
    
    # Ищем пользователя в базе
    user = db.query(Person).filter(Person.email == email).first()
    print(user)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Неверный email или пароль"
        )
    
    # Хешируем введенный пароль
    hashed_input = hashlib.sha256(password.encode()).hexdigest()
    
    if hashed_input != user.password:
        raise HTTPException(
            status_code=401,
            detail="Неверный email или пароль"
        )
    
    response.set_cookie(
        key="user_id",
        value=str(user.id),
        max_age=6400,
        path="/",
        httponly=False,
        samesite="Lax"
    )
    response.set_cookie(
        key="role",
        value=str(user.role),
        max_age=6400,
        path="/",
        httponly=False,
        samesite="Lax"
    )
    
    # Возвращаем данные пользователя
    return {
        "id": user.id,
        "email": user.email,
        "role": user.role
    }

@app.get("/profile")
async def get_profile(
    user_id: str = Cookie(None),
    first_name: str = Cookie(None),
    last_name: str = Cookie(None),
    role: str = Cookie(None)
):
    if not user_id:
        raise HTTPException(status_code=401, detail="Не авторизован")
    
    return {
        "user_id": user_id,
        "first_name": first_name,
        "last_name": last_name,
        "role": role
    }

@app.post("/logout")
async def logout(response: Response):
    # Удаляем куки
    response.delete_cookie("user_id")
    response.delete_cookie("first_name")
    response.delete_cookie("last_name")
    response.delete_cookie("role")
    return {"message": "Успешный выход"}

@app.get("/api/users")
def get_people(db: Session = Depends(get_db)):
    return db.query(Person).all()
  
@app.get("/api/users/{id}")
def get_person(id, db: Session = Depends(get_db)):
    # получаем пользователя по id
    person = db.query(Person).filter(Person.id == id).first()
    # если не найден, отправляем статусный код и сообщение об ошибке
    if person==None:  
        return JSONResponse(status_code=404, content={ "message": "Пользователь не найден"})
    #если пользователь найден, отправляем его
    return person
  
@app.put("/api/usersOld")
def edit_person(data  = Body(), db: Session = Depends(get_db)):
   
    # получаем пользователя по id
    person = db.query(Person).filter(Person.id == data["id"]).first()
    # если не найден, отправляем статусный код и сообщение об ошибке
    if person == None: 
        return JSONResponse(status_code=404, content={ "message": "Пользователь не найден"})
    # если пользователь найден, изменяем его данные и отправляем обратно клиенту
    person.age = data["age"]
    person.name = data["name"]
    db.commit() # сохраняем изменения 
    db.refresh(person)
    return person

@app.put("/api/users")
def edit_person(data  = Body(), db: Session = Depends(get_db)):
   
    # получаем пользователя по id
    person = db.query(Person).filter(Person.id == data["id"]).first()
    # если не найден, отправляем статусный код и сообщение об ошибке
    if person == None: 
        return JSONResponse(status_code=404, content={ "message": "Пользователь не найден"})
    # если пользователь найден, изменяем его данные и отправляем обратно клиенту
    person.first_name = data["first_name"]
    person.last_name = data["last_name"]
    person.email = data["email"]
    person.password = data["password"]
    person.role = data["role"]
    person.username = data["username"]
    db.commit() # сохраняем изменения 
    db.refresh(person)
    return person


@app.post("/notesOld")
async def create_note(
    request: Request,
    title: str = Form(...),
    content: str = Form(...),
    author_id: str = Cookie(default=None, alias="user_id"),
    date: date = date.today(),
    db: Session = Depends(get_db)
):
    if not author_id:
        raise HTTPException(status_code=401, detail="Требуется авторизация")
    
    # Сохраняем заметку в БД
    note = Announcements(title=title, content=content, author_id=author_id, publication_data=date)

    db.add(note)
    db.commit()
    # return {"mess":"work"}

    # return RedirectResponse("/", status_code=303)


@app.post("/notes")
async def create_note(
    title: str = Form(...),
    content: str = Form(...),
    photos: List[UploadFile] = File(default=[]),  # Принимаем список файлов
    author_id: str = Cookie(default=None, alias="user_id"),
    db: Session = Depends(get_db)
):
    if not author_id:
        raise HTTPException(status_code=401, detail="Требуется авторизация")

    saved_files = []
    
    if photos and any(photo.filename for photo in photos):
        for photo in photos:
            original_filename = photo.filename  # Получаем оригинальное имя
        
            # Заменяем опасные символы в имени файла
            safe_filename = (
                original_filename
                .replace(" ", "_")  # Заменяем пробелы
                .replace("/", "-")  # Заменяем слэши
            )
        
            filepath = Path("public_html/uploads") / safe_filename
        
            # Проверяем, не существует ли файл
            counter = 1
            while filepath.exists():
                # Если файл существует, добавляем номер к имени
                stem = Path(safe_filename).stem
                ext = Path(safe_filename).suffix
                safe_filename = f"{stem}_{counter}{ext}"
                filepath = Path("uploads") / safe_filename
                counter += 1
        
            # Сохраняем файл
            with open(filepath, "wb") as buffer:
                shutil.copyfileobj(photo.file, buffer)
        
            saved_files.append(safe_filename)  # Сохраняем обработанное имя

    # Сохраняем в БД как JSON
    note = Announcements(
        title=title,
        content=content,
        author_id=author_id,
        publication_data=date.today(),
        last_updated_date=date.today(),
        attachment=json.dumps(saved_files)  # Сохраняем массив имен
    )
    
    db.add(note)
    db.commit()
    # return RedirectResponse("/", status_code=303)


    
   
    
@app.get("/anounceOld", response_model=List[AnnouncementResponse])
async def get_announcements(db: Session = Depends(get_db)):
    announcements = db.query(Announcements)\
                     .options(joinedload(Announcements.author))\
                     .all()
    print("\n****\n",[AnnouncementResponse.from_orm_with_author(a) for a in announcements])
    return [AnnouncementResponse.from_orm_with_author(a) for a in announcements]

@app.get("/anounceOld2", response_model=List[AnnouncementResponse])
async def get_announcements(db: Session = Depends(get_db)):
    announcements = db.query(Announcements)\
                     .options(joinedload(Announcements.author))\
                     .order_by(desc(Announcements.publication_data))\
                     .all()
     # Сортировка по убыванию даты
    return [AnnouncementResponse.from_orm_with_author(a) for a in announcements]

@app.get("/anounce", response_model=List[AnnouncementResponse])
async def get_announcements(db: Session = Depends(get_db)):
    announcements = db.query(Announcements)\
                     .options(joinedload(Announcements.author))\
                     .order_by(desc(Announcements.id))\
                     .all()
    # Сортируем по ID в обратном порядке
    # print([AnnouncementResponse.from_orm_with_author(a) for a in announcements])
    return [AnnouncementResponse.from_orm_with_author(a) for a in announcements]


@app.post("/searchOld") #, response_model=List[AnnouncementResponse]
async def get_search(search: str = Form(...), db: Session = Depends(get_db)):
    print("mes", search)
    return {"mes":search}

@app.get("/search") #, response_model=List[AnnouncementResponse]
async def get_search(search: str = None, db: Session = Depends(get_db)):
    query = db.query(Announcements)\
              .options(joinedload(Announcements.author))\
              .order_by(desc(Announcements.id))
    print("search", search)
    if search:  # Если есть поисковый запрос
        search_pattern = f"%{search}%"  # Шаблон для поиска подстроки
        query = query.filter(
            or_(
                Announcements.title.ilike(search_pattern),  # Поиск в title (без учета регистра)
                Announcements.content.ilike(search_pattern)  # Поиск в content (без учета регистра)
            )
        )
    
    announcements = query.all()
    return [AnnouncementResponse.from_orm_with_author(a) for a in announcements]


print("Existing tables:", Base.metadata.tables.keys())
Base.metadata.create_all(bind=engine, checkfirst=True)