# How to Run TourChain

## One-Click Setup (Recommended)
We have created an automated script to install dependencies and run all services for you.

1.  **Right-click** `start_all.ps1` and select **Run with PowerShell**.
    *   *Note: If checks fail, ensure you are running as Administrator or have script execution enabled.*
    *   To enable scripts if blocked: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

2.  Wait for the windows to open. You should see **5 separate terminal windows** popup:
    *   Backend Server
    *   Police Backend Server
    *   AI Engine
    *   Admin Frontend
    *   Tourist Frontend

3.  Access the App (Replace `localhost` with `192.168.1.14` for mobile access):
    *   **Tourist App (PC)**: [http://localhost:8001](http://localhost:8001) | **Mobile**: [http://192.168.1.14:8001](http://192.168.1.14:8001)
    *   **Admin Dashboard (PC)**: [http://localhost:8002](http://localhost:8002) | **Mobile**: [http://192.168.1.14:8002](http://192.168.1.14:8002)

## Default Credentials
### Tourist App (User)
*   **Phone**: `9999999999`
*   **Password**: `password123`
*   *If this user doesn't exist, you can Register a new account easily.*

### Admin / Police Dashboard
*   **Officer ID**: `admin`
*   **Password**: `admin`
*   **Role**: Select **Admin** (or Officer)

## Manual Setup
If you prefer running manual commands:
.\start_all.ps1
### 1. Backend
```bash
cd backend
npm install
npm run dev
# Runs on Port 5000
```

### 2. Police Backend
```bash
cd police_backend
npm install
npm run dev
# Runs on Port 5002
```

### 3. AI Engine
```bash
cd backend/ai_engines
pip install -r requirements.txt
python main.py
# Runs on Port 5001
```

### 4. Frontends
Tourist:
```bash
cd frontend/tourist/www
python -m http.server 8001
```

Admin:
```bash
cd frontend/admin
python -m http.server 8002
```
