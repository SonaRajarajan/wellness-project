import sqlite3
import os
from pathlib import Path
from app.config import settings

DB_PATH = Path(__file__).resolve().parent.parent / "data" / "wellness.db"

def get_db_connection():
    """Returns a row-factory enabled SQLite connection."""
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initializes SQLite database schema if not present."""
    schema_file = Path("./data/schema.sql")
    if not schema_file.exists():
        print("Schema file missing at ./data/schema.sql")
        return
        
    conn = get_db_connection()
    with open(schema_file, "r") as f:
        schema_sql = f.read()
    conn.executescript(schema_sql)
    conn.commit()
    conn.close()
    print("Database schema initialized successfully!")
