# 🌍 TourChain
### Smart Tourist Safety & Incident Response System

---

## 📝 Overview
TourChain is a **Smart Tourist Safety Monitoring & Incident Response System** built for enhancing the security of tourists using **AI, Blockchain, IoT, and Geo-Fencing technologies**.
It enables authorities to monitor, respond, and protect visitors in real time, while ensuring **privacy, transparency, and secure digital identity management**.

By integrating **digital tourist IDs, AI-based anomaly detection, geo-fencing alerts, and panic response systems**, TourChain aims to **revolutionize travel safety** in high-risk and remote areas.

---

## 🔥 Features
1. 🆔 **Digital Tourist ID**: Blockchain-based, tamper-proof digital IDs with KYC and trip details.
2. 📍 **Geo-Fencing Alerts**: Real-time notifications when tourists enter unsafe or restricted zones.
3. 🆘 **Panic Button & SOS**: Instant live location sharing with police, family, and emergency contacts.
4. 🤖 **AI-Powered Safety Monitoring**: Detects unusual travel patterns, sudden drop-offs, or prolonged inactivity.
5. 📊 **Police & Tourism Dashboard**: Heatmaps, tourist clusters, ID verification, and automated e-FIR generation.
6. ⌚ **IoT Integration**: Optional smart bands for continuous location/health signals in high-risk zones.
7. 🌐 **Multilingual Support**: App available in 5+ Indian languages + English, with voice/text emergency access.
8. 🔒 **Data Privacy & Security**: End-to-end encryption with blockchain-backed secure records.

---

## 🛠 Technologies Used

### Frontend
- 🌐 HTML, Tailwind CSS, Vanilla JavaScript, Leaflet Maps, Google Maps API

### Backend
- ⚙ Node.js, Express.js
- 🗄 MongoDB, Mongoose
- 🔑 JSON Web Tokens (JWT)
- 📡 WebSockets (Socket.io)
- ⛓ Blockchain: Solidity, Hardhat, Ethers.js, Polygon Amoy Testnet

### AI/ML Engine
- 🚀 FastAPI (Python)
- 📊 Scikit-learn, Numpy, Pandas
- 🤖 TensorFlow, LSTM Autoencoder for anomaly detection

---

## 🚀 Installation & Running

For the fastest startup, use the provided script from your terminal:

```powershell
# Run the startup script (Windows)
.\start_all.ps1
```

Or run everything manually:

```bash
# 1. Start Main Backend
cd backend
npm install
npm run dev

# 2. Start Police/Admin Backend
cd police_backend
npm install
npm run dev

# 3. Start AI Engine
cd backend/ai_engines
pip install -r requirements.txt
python main.py

# 4. Start Tourist App
cd frontend/tourist/www
python -m http.server 8001

# 5. Start Admin Dashboard
cd frontend/admin
python -m http.server 8002
```

---

## 🎯 Usage
1. 🆔 **Tourist Registration** – Generate a blockchain-secured Digital Tourist ID.
2. 🗺 **Trip Creation** – Enter itinerary and checkpoints.
3. 📍 **Geo-Fencing Alerts** – Get notified when entering unsafe zones.
4. 🆘 **Emergency SOS** – Panic button triggers alerts to police and family.
5. 📊 **Authority Dashboard** – Monitor clusters, view live tracking, and respond to incidents in real time.

---

## 🔐 Security Measures
1. ⛓ Blockchain-based ID immutability & tamper-proof records.
2. 🔑 Token-based authentication for APIs.
3. 🔒 Police and Admin verified access controls.
4. 🛡 AI anomaly detection for proactive safety monitoring.

---

## 📂 Project Structure & Roadmap

Below is the directory roadmap of the project's architecture, showing where all structural components, models, and scripts are stored:

```text
TourChain/
│
├── backend/                       # Main backend handling tourists and AI proxies
│   ├── ai_engines/                # Python-based ML engine
│   │   ├── anomaly_detector.py    # Autoencoder detection logic
│   │   ├── main.py                # FastAPI server (Port 5001)
│   │   ├── scaler.gz              # Pre-trained ML scaler
│   │   ├── threshold.json         # Anomaly threshold data
│   │   └── tourist_anomaly_model.h5 # Main TensorFlow model
│   │
│   ├── config/                    # MongoDB connection variables
│   ├── contracts/                 # Blockchain smart contracts (Solidity)
│   ├── controllers/               # API endpoint logic (Auth, Tourist, Profile, etc.)
│   ├── models/                    # MongoDB schemas (User, Profile, Journey, Panic)
│   ├── routes/                    # Express Router definitions
│   ├── scripts/                   # Hardhat deployment scripts
│   ├── services/                  # Business logic (QR codes, Blockchain interaction)
│   └── index.js                   # Application entry point (Port 5000)
│
├── frontend/                      # Web-based User Interfaces
│   ├── admin/                     # Police & Supervisor Dashboard
│   │   ├── config.js              # Server URLs mapping
│   │   └── index.html             # Single-page dashboard (Starts on Port 8002)
│   │
│   └── tourist/                   # Tourist Application
│       └── www/
│           ├── config.js          # API configs
│           └── index.html         # Main App Interface (Starts on Port 8001)
│
├── police_backend/                # Dedicated backend for Police & Admins
│   ├── config/                    # Database Setup
│   ├── controllers/               # Dashboard and E-FIR handling logic
│   ├── middlewares/               # Admin Authentication guards
│   ├── models/                    # Police-specific extensions (Officers, Reports)
│   ├── routes/                    # Secure Admin/Police API routes
│   ├── services/                  # Socket.io real-time alerts service
│   └── index.js                   # Server entry point (Port 5002)
│
├── start_all.ps1                  # Master powershell script to launch all 5 servers
├── ANDROID_BUILD.md               # Instructions for compiling Mobile APKs
├── RUN_INSTRUCTIONS.md            # App login logic and run data
├── PROJECT_STATUS.md              # Live status details of running services
└── README.md                      # This documentation file
```

---
