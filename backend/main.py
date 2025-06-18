from fastapi import FastAPI

app = FastAPI() #creating an instance of fastapi

@app.get("/")
def home():
    return {"message": "New change number 2"}
#changes have been made