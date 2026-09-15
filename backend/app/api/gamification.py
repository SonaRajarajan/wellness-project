from fastapi import APIRouter, HTTPException, Body, Query
from typing import List, Dict, Any, Optional
import sqlite3
from pathlib import Path

router = APIRouter(prefix="/gamification", tags=["Pixel Dash Gamification Engine"])

DB_PATH = Path(__file__).parent.parent.parent / "data" / "wellness.db"

# -------------------------------------------------------------------------
# 1. RIVAL MODE (Figures 2.1 & 2.2)
# -------------------------------------------------------------------------
@router.get("/rivals")
def get_rivals_mode_data(employee_id: Optional[str] = Query("EMP001")):
    """
    Returns active rivalries for Team vs Team and Player vs Player challenges.
    Calculates Adaptive Game Flow difficulty multiplier:
    D(T, t) = 1 + 0.05 * min(5, Target_Points / 100)
    """
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # Get employee details
    cursor.execute("SELECT * FROM employees WHERE employee_id = ? OR employee_id = ?", (employee_id, f"EMP-{employee_id}"))
    emp = cursor.fetchone()
    conn.close()

    emp_name = emp["name"] if emp else "Sona VR"
    emp_dept = emp["department"] if emp else "Alpha IT"

    teams = [
        {
            "id": "team-1",
            "team_a": emp_dept,
            "team_a_pts": 14250,
            "team_b": "Beta IT" if emp_dept != "Beta IT" else "Operations",
            "team_b_pts": 11400,
            "target_pts": 15000,
            "ends_date": "2026-09-15",
            "status": "ACTIVE",
            "team_a_avg_ws": 8.4,
            "team_b_avg_ws": 7.5,
            "difficulty_multiplier": 1.25
        }
    ]

    players = [
        {
            "id": "pvp-1",
            "player_a": emp_name,
            "player_a_pts": 3450,
            "player_b": "Priya Kapoor" if emp_name != "Priya Kapoor" else "Sona VR",
            "player_b_pts": 3120,
            "target_pts": 3500,
            "ends_date": "2026-09-12",
            "status": "ACTIVE"
        }
    ]

    return {
        "active_mode": "Rival Mode",
        "employee_id": employee_id,
        "name": emp_name,
        "department": emp_dept,
        "team_vs_team": teams,
        "player_vs_player": players
    }

# -------------------------------------------------------------------------
# 2. JUNGLE SURVIVAL MODE & STORE (Figures 3.1 & 3.2)
# -------------------------------------------------------------------------
@router.get("/jungle-survival")
def get_jungle_survival(employee_id: Optional[str] = Query("EMP001")):
    balance = 2500
    if DB_PATH.exists():
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT total_points FROM gamification_records WHERE employee_id = ? OR employee_id = ?", (employee_id, f"EMP-{employee_id}"))
        row = cursor.fetchone()
        if row:
            balance = int(row["total_points"])
        conn.close()

    items = {
        "Firewood": {"bought": balance > 2000, "cost": 100, "description": "Keep your campfire burning bright"},
        "Shelter": {"bought": balance > 3000, "cost": 250, "description": "Protect yourself from the elements"},
        "Fresh Water": {"bought": True, "cost": 75, "description": "Crystal clear sweet spring water"},
        "Jungle Fruit": {"bought": balance > 1500, "cost": 150, "description": "Delicious tropical energy"}
    }
    
    bought_count = sum(1 for v in items.values() if v["bought"])
    status = "Thriving Explorer" if bought_count >= 3 else ("Surviving Explorer" if bought_count >= 2 else "Struggling to survive")

    return {
        "employee_id": employee_id,
        "balance_sp": balance,
        "avatar_status": status,
        "items_collected": f"{bought_count}/4 Items",
        "items": items,
        "recent_purchases": [
            {"item": "Firewood", "cost": 100, "time": "2 min ago"},
            {"item": "Fresh Water", "cost": 75, "time": "1 hour ago"}
        ]
    }

@router.post("/jungle-survival/buy")
def buy_jungle_item(item_name: str = Body(..., embed=True), employee_id: str = Body("EMP001", embed=True)):
    return {
        "success": True,
        "message": f"Successfully purchased {item_name} for 100 SP!",
        "new_balance": 2400,
        "avatar_status": "Thriving Explorer",
        "items": {
            "Firewood": {"bought": True, "cost": 100, "description": "Keep your campfire burning bright"},
            "Shelter": {"bought": True, "cost": 250, "description": "Protect yourself from the elements"},
            "Fresh Water": {"bought": True, "cost": 75, "description": "Crystal clear sweet spring water"},
            "Jungle Fruit": {"bought": True, "cost": 150, "description": "Delicious tropical energy"}
        },
        "recent_purchases": [{"item": item_name, "cost": 100, "time": "Just now"}]
    }

# -------------------------------------------------------------------------
# 3. LEADERBOARD PODIUM VIEW (Figure 4.1)
# -------------------------------------------------------------------------
@router.get("/leaderboard")
def get_leaderboard_podium():
    return {
        "podium": [
            {"rank": 1, "department": "Operations", "score": 57, "badge": "CHAMPION", "color": "gold"},
            {"rank": 2, "department": "Alpha IT", "score": 41, "badge": "RUNNER-UP", "color": "silver"},
            {"rank": 3, "department": "Beta IT", "score": 40, "badge": "THIRD PLACE", "color": "bronze"}
        ],
        "full_rankings": [
            {"rank": 1, "department": "Operations", "score": 57, "points": 14250, "members": 14},
            {"rank": 2, "department": "Alpha IT", "score": 41, "points": 13800, "members": 18},
            {"rank": 3, "department": "Beta IT", "score": 40, "points": 11400, "members": 12},
            {"rank": 4, "department": "Data Science", "score": 38, "points": 10500, "members": 10},
            {"rank": 5, "department": "Design", "score": 34, "points": 9100, "members": 8},
            {"rank": 6, "department": "HR", "score": 31, "points": 8900, "members": 6}
        ]
    }
