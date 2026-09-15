from fastapi import APIRouter, Query
from typing import List, Dict, Any, Optional
import sqlite3
from pathlib import Path

router = APIRouter(prefix="/players", tags=["Player Management"])

DB_PATH = Path(__file__).parent.parent.parent / "data" / "wellness.db"

def fetch_employees_from_db() -> List[Dict[str, Any]]:
    if not DB_PATH.exists():
        return []
    
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT e.employee_id, e.name, e.department, e.role, e.age, e.activity_level,
               COALESCE(g.total_points, 1200) as points
        FROM employees e
        LEFT JOIN gamification_records g ON e.employee_id = g.employee_id
        ORDER BY e.employee_id ASC;
    """)
    rows = cursor.fetchall()
    conn.close()

    players = []
    for r in rows:
        players.append({
            "id": r["employee_id"],
            "employee_id": r["employee_id"],
            "name": r["name"],
            "email": f"{r['name'].lower().replace(' ', '.')}@pixel.com",
            "department": r["department"],
            "role": r["role"],
            "age": r["age"],
            "activity_level": r["activity_level"],
            "points": r["points"],
            "tier_badge": f"{r['department']} - {r['points']} XP",
            "avatar": f"avatar_{(hash(r['employee_id']) % 8) + 1}"
        })
    return players

@router.get("")
def get_all_players(search: Optional[str] = Query(None), department: Optional[str] = Query(None)):
    """
    Returns list of all employees / players directly from SQLite wellness.db
    """
    players = fetch_employees_from_db()

    if search:
        s = search.lower()
        players = [p for p in players if s in p["name"].lower() or s in p["email"].lower() or s in p["id"].lower()]

    if department and department != "All Departments":
        players = [p for p in players if p["department"] == department]

    departments = sorted(list(set(p["department"] for p in players))) if players else ["Alpha IT", "Beta IT", "Operations"]

    return {
        "title": "Employees & Players Management",
        "subtitle": "Manage all registered employees across departments",
        "total_players": len(players),
        "departments": ["All Departments"] + departments,
        "players": players
    }
