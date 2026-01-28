from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
import random

app = FastAPI(title="Triplytic MCP Server")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# REALISTIC BASE PRICING (India-focused)
# --------------------------------------------------

CITY_HOTEL_BASE_PRICE = {
    "mumbai": 2500,
    "delhi": 2300,
    "bangalore": 2000,
    "hyderabad": 1800,
    "chennai": 1700,
    "pune": 1600,
    "ahmedabad": 1500,
}

MIN_FLIGHT_PRICE = 1800  # realistic India domestic floor


# --------------------------------------------------
# MOCK DATA GENERATORS (REALISTIC)
# --------------------------------------------------

class FreeAPIs:

    @staticmethod
    def get_mock_hotels(location: str):
        hotel_chains = ["Taj", "Marriott",
                        "Hilton", "Hyatt", "Radisson", "OYO"]
        areas = ["City Center", "Airport Area", "Business District"]

        base_price = CITY_HOTEL_BASE_PRICE.get(location.lower(), 1600)

        hotels = []
        for i in range(6):
            price = round(base_price * random.uniform(0.9, 1.7), 2)
            hotels.append({
                "id": f"H{i+1}",
                "name": f"{random.choice(hotel_chains)} {location} {random.choice(areas)}",
                "location": location,
                "price_per_night": price,
                "rating": round(random.uniform(3.6, 4.8), 1),
                "address": f"{random.randint(10, 99)} MG Road",
                "amenities": random.sample(
                    ["WiFi", "Pool", "Gym", "Spa", "Restaurant"], 3
                ),
                "photo": f"https://source.unsplash.com/400x300/?hotel,{location},{i}"
            })

        return hotels

    @staticmethod
    def get_mock_flights(from_city: str, to_city: str):
        airlines = [
            {"code": "6E", "name": "IndiGo"},
            {"code": "AI", "name": "Air India"},
            {"code": "UK", "name": "Vistara"},
        ]

        flights = []
        now = datetime.now()

        for i in range(6):
            airline = random.choice(airlines)
            price = max(
                round(random.uniform(2000, 6500), 2),
                MIN_FLIGHT_PRICE
            )

            dep = now + timedelta(days=random.randint(1, 30))
            duration = random.randint(90, 240)

            flights.append({
                "id": f"F{i+1}",
                "airline": airline["name"],
                "flight_number": f"{airline['code']}{random.randint(100,999)}",
                "from_city": from_city,
                "to_city": to_city,
                "departure": dep.strftime("%Y-%m-%d %H:%M"),
                "arrival": (dep + timedelta(minutes=duration)).strftime("%Y-%m-%d %H:%M"),
                "duration": f"{duration//60}h {duration%60}m",
                "price": price,
                "stops": random.choice([0, 0, 1]),
                "aircraft": "Airbus A320"
            })

        return flights


# --------------------------------------------------
# REQUEST MODEL
# --------------------------------------------------

class BookingPreferences(BaseModel):
    booking_type: str
    location: Optional[str] = None
    rooms: Optional[int] = 1
    from_city: Optional[str] = None
    to_city: Optional[str] = None
    budget: float
    priority: str = "PRICE"


# --------------------------------------------------
# RECOMMENDATION ENDPOINT
# --------------------------------------------------

@app.post("/recommend")
def recommend(pref: BookingPreferences):

    priority = pref.priority.upper()

    # ---------------- HOTEL ----------------
    if pref.booking_type == "HOTEL":
        hotels = FreeAPIs.get_mock_hotels(pref.location)

        hotels = [h for h in hotels if h["price_per_night"] <= pref.budget]

        if not hotels:
            return {
                "success": False,
                "error": {
                    "reason": "No hotels available in this budget range"
                },
            }

        if priority == "COMFORT":
            hotels.sort(key=lambda x: (-x["rating"], x["price_per_night"]))
            reason = "Highest rated within your budget"
        else:
            hotels.sort(key=lambda x: x["price_per_night"])
            reason = "Lowest price within your budget"

        best = hotels[0]

        return {
            "success": True,
            "type": "HOTEL",
            "recommendation": {
                **best,
                "total_price": best["price_per_night"] * (pref.rooms or 1),
                "reason": reason
            },
            "alternatives": hotels[1:4]
        }

    # ---------------- FLIGHT ----------------
    flights = FreeAPIs.get_mock_flights(pref.from_city, pref.to_city)

    flights = [f for f in flights if f["price"] <= pref.budget]

    if not flights:
        return {
            "success": False,
            "error": "No flights available in this budget range"
        }

    if priority == "COMFORT":
        flights.sort(key=lambda x: (x["stops"], x["price"]))
        reason = "Least stops within your budget"
    else:
        flights.sort(key=lambda x: x["price"])
        reason = "Lowest fare within your budget"

    best = flights[0]

    return {
        "success": True,
        "type": "FLIGHT",
        "recommendation": {
            **best,
            "reason": reason
        },
        "alternatives": flights[1:4]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9000)
