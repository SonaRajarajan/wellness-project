import numpy as np
from typing import Dict, Any, List

class GamificationEngagementEngine:
    """
    Gamification Engine: Adaptive Game Flow & Dynamic Difficulty Adjustment.
    Formula (PDF Report Page 13):
    D(T, t) = 1 + alpha * (AvgWS(T, t-1) - GlobalAvgWS) / sigma_WS
    """
    def __init__(self, alpha: float = 0.15):
        self.alpha = alpha

    def compute_adaptive_difficulty(self, emp_ws: float, global_avg_ws: float = 7.5, sigma_ws: float = 1.2) -> Dict[str, Any]:
        diff_multiplier = 1.0 + self.alpha * ((emp_ws - global_avg_ws) / sigma_ws)
        diff_multiplier = max(0.7, min(1.5, diff_multiplier))
        
        if diff_multiplier > 1.15:
            flow_state = "High Skill / Challenging Flow"
            quest_tier = "Epic Elite Quests"
        elif diff_multiplier < 0.85:
            flow_state = "Recovery / Assisted Flow"
            quest_tier = "Beginner Micro-Habits"
        else:
            flow_state = "Optimal Flow State Zone"
            quest_tier = "Standard Daily Quests"

        return {
            "difficulty_multiplier": round(float(diff_multiplier), 2),
            "flow_state_zone": flow_state,
            "recommended_quest_tier": quest_tier
        }
