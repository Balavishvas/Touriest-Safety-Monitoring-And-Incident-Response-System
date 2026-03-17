Write-Host "Starting TourChain services..." -ForegroundColor Cyan

# Check for Node.js and Python
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { Write-Error "Node.js not found! Please install it."; exit 1 }
if (-not (Get-Command python -ErrorAction SilentlyContinue)) { Write-Error "Python not found! Please install it."; exit 1 }

# Check Local MongoDB
Write-Host "Checking MongoDB..." -ForegroundColor Yellow
try {
    $mongo = Get-Service MongoDB -ErrorAction SilentlyContinue
    if ($null -ne $mongo) {
         if ($mongo.Status -ne 'Running') {
            Write-Host "Starting MongoDB Service..."
            Start-Service MongoDB
        } else {
            Write-Host "MongoDB is running." -ForegroundColor Green
        }
    } else {
        Write-Warning "MongoDB Service not found. Please ensure 'mongod' is running manually."
    }
} catch {
    Write-Warning "Could not check MongoDB service. Ensure it is running."
}

# Install Backend Dependencies
Write-Host "Installing Backend Dependencies..." -ForegroundColor Yellow
try {
    Push-Location backend
    npm install
    Pop-Location
} catch { Write-Error "Failed to install backend dependencies"; exit 1 }

# Install Police Backend Dependencies
Write-Host "Installing Police Backend Dependencies..." -ForegroundColor Yellow
try {
    Push-Location police_backend
    npm install
    Pop-Location
} catch { Write-Error "Failed to install police backend dependencies"; exit 1 }

# Install AI Engine Dependencies
Write-Host "Installing AI Engine Dependencies..." -ForegroundColor Yellow
try {
    Push-Location backend/ai_engines
    pip install -r requirements.txt
    Pop-Location
} catch { Write-Error "Failed to install AI engine dependencies"; exit 1 }

# Start Blockchain Node (Hardhat)
Write-Host "Starting Local Blockchain Node..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npx hardhat node"
Write-Host "Waiting for Blockchain node to initialize (10 seconds)..." -ForegroundColor Gray
Start-Sleep -Seconds 10

# Deploy Contract
Write-Host "Deploying Smart Contracts..." -ForegroundColor Yellow
try {
    Push-Location backend
    npx hardhat run scripts/deploy.js --network localhost
    Pop-Location
} catch { Write-Warning "Contract deployment failed. Backend might fail to activate trips." }

# Start Services
Write-Host "Launching Services in new windows..." -ForegroundColor Cyan

# 1. Backend (Port 5000)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

# 2. Police Backend (Port 5002) - Note Port Change
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd police_backend; npm run dev"

# 3. AI Engine (Port 5001)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend/ai_engines; python main.py"

# 4. Admin Frontend (Port 8002)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend/admin; python -m http.server 8002"

# 5. Tourist Frontend (Port 8001)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend/tourist/www; python -m http.server 8001"

Write-Host "All services started!" -ForegroundColor Green
Write-Host "Admin Portal: http://192.168.1.14:8002"
Write-Host "Tourist App: http://192.168.1.14:8001"
