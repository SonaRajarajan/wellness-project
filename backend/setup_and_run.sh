#!/usr/bin/env bash
# Setup & Run Script for AI Wellness Platform Backend on macOS

echo "========================================================"
echo "🏥 Starting Setup for AI Wellness Platform Backend"
echo "========================================================"

# Step 0: Free port 8000 if occupied
echo "Checking port 8000..."
lsof -ti:8000 | xargs kill -9 2>/dev/null || true

# Step 1: Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python Virtual Environment (venv)..."
    python3 -m venv venv 2>/dev/null || true
fi

# Step 2: Activate virtual environment if present, else fallback
if [ -d "venv" ]; then
    echo "Activating virtual environment..."
    source venv/bin/activate
    PIP_CMD="pip"
else
    PIP_CMD="pip3 install --break-system-packages"
fi

# Step 3: Install dependencies
echo "Installing required Python packages..."
$PIP_CMD install -r requirements.txt 2>/dev/null || pip3 install --break-system-packages -r requirements.txt
$PIP_CMD install pydantic-settings 2>/dev/null || pip3 install --break-system-packages pydantic-settings

# Step 4: Seed Database & Train Models
echo "Seeding database and exporting AI models..."
python3 data/seed_synthetic_data.py
python3 train_and_export_models.py

# Step 5: Start FastAPI Server
echo "========================================================"
echo "🚀 Starting FastAPI Backend Server on http://localhost:8000"
echo "========================================================"
echo "Interactive API Documentation: http://localhost:8000/docs"
echo "Press Ctrl+C to stop the server."
echo "========================================================"

python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
