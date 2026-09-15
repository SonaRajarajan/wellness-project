# 🎮 PIXEL DASH — Workforce Wellness Application

A complete working **Frontend + Backend Project** for the **Pixel Dash Gamified Employee Wellness Hub** developed for VIT Chennai (MGT3009 Behavioural Analytics).

---

## 📁 Final Project Directory Layout

```text
wellness-project/
│
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI Application Server
│   │   ├── config.py               # Application Settings
│   │   ├── db.py                   # Database Connection
│   │   ├── api/
│   │   │   ├── auth.py             # Login & Registration Endpoint (Figure 7.1)
│   │   │   ├── gamification.py     # Rivals & Jungle Survival Store (Figures 2.1, 3.1, 4.1)
│   │   │   ├── nutrition.py        # Food Recommendations Endpoint (Figure 5.1)
│   │   │   ├── health_suggestions.py# Health Suggestions & Badges (Figure 6.1)
│   │   │   └── players.py          # Player Management Endpoint (Figure 7.2)
│   │   ├── cv/
│   │   ├── ml/
│   │   └── rag/
│   ├── data/                       # SQLite Database & CSV Samples
│   ├── models_saved/               # Saved ML Model Binary Weights (.joblib)
│   ├── requirements.txt
│   ├── setup_and_run.sh
│   └── train_and_export_models.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx          # Pixel Retro Navigation Bar (No Stock Market)
│   │   ├── pages/
│   │   │   ├── Login.jsx           # Player Login Portal (Figure 7.1)
│   │   │   ├── RivalsMode.jsx      # Rivals Mode Dashboard (Figures 2.1 & 2.2)
│   │   │   ├── JungleSurvival.jsx  # Jungle Survival Store & Avatar (Figures 3.1 & 3.2)
│   │   │   ├── Leaderboard.jsx     # Leaderboard Podium View (Figure 4.1)
│   │   │   ├── FoodRecommendations.jsx # AI Food Recs Interface (Figure 5.1)
│   │   │   ├── HealthSuggestions.jsx  # Health Tasks & Badges (Figure 6.1)
│   │   │   └── Players.jsx         # Player Management Interface (Figure 7.2)
│   │   ├── App.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## ⚡ How to Run Backend & Frontend Locally

### 1. Start the Backend Server (Port 8000)
In your terminal, navigate to the `backend` directory and run:

```bash
cd "/Users/sona/Downloads/wellness-project/backend"
pip install --break-system-packages -r requirements.txt
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Interactive Backend API Docs will be live at:
👉 **[http://localhost:8000/docs](http://localhost:8000/docs)**

---

### 2. Start the Frontend React App (Port 5173)
Open a new terminal window, navigate to the `frontend` directory and run:

```bash
cd "/Users/sona/Downloads/wellness-project/frontend"
npm install
npm run dev
```

React Frontend Application will be live at:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## 🎯 Implemented Features (Matching Screenshots Exactly)

1. **Player Login & Authentication** (`/login` - Figure 7.1)
2. **Rivals Mode Dashboard** (`/rivals` - Figures 2.1 & 2.2)
3. **Jungle Survival Store & Explorer Progress** (`/jungle` - Figures 3.1 & 3.2)
4. **Leaderboard Podium View** (`/leaderboard` - Figure 4.1)
5. **AI Powered Food Recommendations** (`/food` - Figure 5.1)
6. **Health Suggestions & Wellness Badges** (`/health` - Figure 6.1)
7. **Player Management Interface** (`/players` - Figure 7.2)

> ⛔ **Excluded**: As instructed, the **Wellness Stock Market feature has been completely removed** from all UI navigation, components, and backend endpoints.
