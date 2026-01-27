from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional, List

app = FastAPI(title="Triplytic MCP Server")

HOTELS = [
    {
        "id": 1,
        "name": "Hotel Emerald",
        "location": "bangalore",
        "price_per_night": 2800,
        "rating": 4.2,
        "rooms_available": 5
    },
    {
        "id": 2,
        "name": "Luxury Stay Bangalore",
        "location": "bangalore",
        "price_per_night": 5200,
        "rating": 4.8,
        "rooms_available": 3
    }
]

FLIGHTS = [
    {
        "id": 1,
        "from_city": "bangalore",
        "to_city": "delhi",
        "price": 4200,
        "airline": "Indigo"
    },
    {
        "id": 2,
        "from_city": "bangalore",
        "to_city": "delhi",
        "price": 6500,
        "airline": "Vistara"
    }
]


class BookingPreferences(BaseModel):
    booking_type: str
    location: Optional[str] = None
    rooms: Optional[int] = None
    budget: float
    priority: str
    from_city: Optional[str] = None
    to_city: Optional[str] = None
    passengers: Optional[int] = None


@app.post("/recommend")
def recommend(pref: BookingPreferences):

    if pref.booking_type == "HOTEL":
        return {
            "name": f"{pref.location} Comfort Hotel",
            "price": pref.budget if pref.priority == "PRICE" else pref.budget + 1000,
            "reason": "Best hotel based on your preferences",
            "type": "HOTEL"
        }

    if pref.booking_type == "FLIGHT":
        return {
            "name": f"{pref.from_city} → {pref.to_city}",
            "price": pref.budget if pref.priority == "PRICE" else pref.budget + 2000,
            "reason": "Best flight for your route and budget",
            "type": "FLIGHT"
        }

    return {"error": "Unsupported booking type"}
