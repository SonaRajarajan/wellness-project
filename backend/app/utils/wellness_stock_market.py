import numpy as np
from typing import Dict, Any

class WellnessStockMarketEngine:
    """
    Wellness Stock Market Price Calculation Engine.
    Formula (PDF Report Page 14):
    P(d, t) = P_base * (1 + beta * delta_AvgWS(d, t)) * (1 + gamma * ParticipationRate(d, t))
    """
    def __init__(self, p_base: float = 100.0, beta: float = 0.08, gamma: float = 0.04):
        self.p_base = p_base
        self.beta = beta
        self.gamma = gamma

    def calculate_stock_price(self, delta_ws: float, participation_rate: float) -> float:
        price = self.p_base * (1.0 + self.beta * delta_ws) * (1.0 + self.gamma * participation_rate)
        return round(float(price), 2)
