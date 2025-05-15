from fastapi import FastAPI
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from fastapi.encoders import jsonable_encoder

app = FastAPI()
app.mount("/", StaticFiles(directory="public_html", html=True))

# @app.get("/")
# def read_root():
#     return FileResponse("index.html")



@app.get("/about")
def about():
    return {"message": "О сайте"}

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