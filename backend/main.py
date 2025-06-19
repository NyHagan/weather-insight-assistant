from fastapi import FastAPI
import pyodbc

app = FastAPI()

# Hardcoded for local testing—safe to remove once env vars are wired in Azure
SQL_SERVER = "weather-insights-server.database.windows.net"
SQL_DATABASE = "weather-insights-db"
SQL_USERNAME = "nyweather_user"
SQL_PASSWORD = "N3wSafeP4ssword2025"
SQL_DRIVER = "{ODBC Driver 18 for SQL Server}"

def get_connection():
    return pyodbc.connect(
        f"DRIVER={SQL_DRIVER};"
        f"SERVER={SQL_SERVER};"
        f"DATABASE={SQL_DATABASE};"
        f"UID={SQL_USERNAME};"
        f"PWD={SQL_PASSWORD};",
        encrypt="yes",
        trust_server_certificate="no",
        timeout=30
    )

@app.get("/")
def home():
    return {
        "status": "online",
        "message": "API working fine on Azure 🚀"
    }

@app.get("/weather")
def get_weather():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT TOP 20 * FROM weather_curated")
        columns = [col[0] for col in cursor.description]
        rows = [dict(zip(columns, row)) for row in cursor.fetchall()]
        cursor.close()
        conn.close()
        return {"data": rows}
    except Exception as e:
        return {"error": str(e)}

@app.get("/whoami")
def whoami():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT SUSER_SNAME(), USER_NAME()")
        suser, user = cursor.fetchone()
        cursor.close()
        conn.close()
        return {"login": suser, "db_user": user}
    except Exception as e:
        return {"error": str(e)}
