import datetime
import json
import math
from typing import List, Tuple

import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(
    title="Tourist Safety API",
    description="API for Safety Score and Anomaly Detection."
)

print("✅ Tourist Safety AI Engine started (lightweight mode - no TensorFlow).")

class TouristData(BaseModel):
    current_area: str
    deviation_km: float
    inactivity_minutes: int
    current_hour: int | None = None

class LocationSequence(BaseModel):
    locations: List[Tuple[float, float]]

@app.get("/")
def read_root():
    return {"status": "Tourist Safety API is running!", "mode": "lightweight"}

@app.post("/calculate-score/")
def get_safety_score(data: TouristData):
    """
    Calculates a safety score based on contextual risk factors.
    Starts with a base score of 10 and deducts points for risks.
    """
    base_score = 10.0
    risk_factors = []

    hour = data.current_hour if data.current_hour is not None else datetime.datetime.now().hour
    if hour < 6 or hour > 22:
        base_score -= 2.0
        risk_factors.append("Late-night activity")

    if data.inactivity_minutes > 30:
        inactivity_penalty = (data.inactivity_minutes / 30) * (1.5 if (hour < 6 or hour > 22) else 1.0)
        base_score -= inactivity_penalty
        risk_factors.append(f"High inactivity ({data.inactivity_minutes} mins)")

    if data.deviation_km > 1.0:
        deviation_penalty = data.deviation_km * 0.5
        base_score -= deviation_penalty
        risk_factors.append(f"Route deviation ({data.deviation_km} km)")

    area_risk_scores = {
        "park_street": 0,
        "victoria_memorial": 0,
        "howrah_station_area": -1,
        "unlit_alley": -3
    }
    area_penalty = area_risk_scores.get(data.current_area.lower().replace(" ", "_"), -0.5)
    if area_penalty < 0:
        base_score -= abs(area_penalty)
        risk_factors.append(f"Entered a potentially unsafe area: {data.current_area}")

    final_score = max(0, round(base_score, 2))
    return {
        "safety_score": final_score,
        "risk_factors": risk_factors
    }

def haversine(lat1, lon1, lat2, lon2):
    """Calculate distance in km between two GPS points."""
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

@app.post("/detect-anomaly/")
def detect_anomaly(sequence: LocationSequence):
    """
    Lightweight rule-based anomaly detection using GPS movement patterns.
    Detects: sudden teleportation, complete stillness, erratic movement.
    """
    if len(sequence.locations) != 20:
        raise HTTPException(status_code=400, detail="Input must contain exactly 20 location points.")

    try:
        locs = sequence.locations
        distances = []
        for i in range(1, len(locs)):
            d = haversine(locs[i-1][0], locs[i-1][1], locs[i][0], locs[i][1])
            distances.append(d)

        avg_dist = np.mean(distances)
        max_dist = np.max(distances)
        std_dist = np.std(distances)

        is_anomaly = False
        reconstruction_loss = float(avg_dist)

        # Rule 1: Sudden teleportation (one jump > 2km between consecutive points)
        if max_dist > 2.0:
            is_anomaly = True
            reconstruction_loss = float(max_dist)

        # Rule 2: Complete stillness (tourist hasn't moved at all)
        elif avg_dist < 0.001:
            is_anomaly = True
            reconstruction_loss = 0.001

        # Rule 3: Very erratic movement (high std deviation relative to average)
        elif std_dist > avg_dist * 2 and avg_dist > 0.01:
            is_anomaly = True
            reconstruction_loss = float(std_dist)

        threshold = 2.0

        return {
            "is_anomaly": bool(is_anomaly),
            "reconstruction_loss": round(reconstruction_loss, 6),
            "threshold": threshold
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred during prediction: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5001)