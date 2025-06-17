from fastapi import FastAPI

app = FastAPI() #creating an instance of fastapi

@app.get("/")
def home():
    return {"message": "this is Nana's fast api stuff"}

