import { useState } from "react";
import api from "../api/api";
import "../styles/BookingForm.css";
import { useNavigate } from "react-router-dom";

export default function BookingForm({ onRecommendation }) {
    const userId = localStorage.getItem("user_id");
    const [bookingType, setBookingType] = useState("HOTEL");
    const navigate = useNavigate();
    const [hotelForm, setHotelForm] = useState({
        location: "",
        check_in: "",
        check_out: "",
        rooms: 1,
        guests: 1,
        budget: 3000,
        priority: "PRICE",
        mobile: "",
    });

    const [flightForm, setFlightForm] = useState({
        from_city: "",
        to_city: "",
        travel_date: "",
        passengers: 1,
        budget: 4000,
        priority: "PRICE",
        mobile: "",
    });

    const CITIES = [
        "Mumbai",
        "Delhi",
        "Bangalore",
        "Hyderabad",
        "Chennai",
        "Pune",
        "Ahmedabad",
    ];

    const handleChange = (e, formType) => {
        const value =
            e.target.type === "number"
                ? Number(e.target.value)
                : e.target.value;

        if (formType === "hotel") {
            setHotelForm({ ...hotelForm, [e.target.name]: value });
        } else {
            setFlightForm({ ...flightForm, [e.target.name]: value });
        }
    };

    const isHotelFormValid = () => {
        return (
            hotelForm.location.trim() &&
            hotelForm.check_in &&
            hotelForm.check_out &&
            hotelForm.rooms > 0 &&
            hotelForm.guests > 0 &&
            hotelForm.budget > 0 &&
            hotelForm.mobile.trim()
        );
    };

    const isFlightFormValid = () => {
        return (
            flightForm.from_city.trim() &&
            flightForm.to_city.trim() &&
            flightForm.travel_date &&
            flightForm.passengers > 0 &&
            flightForm.budget > 0 &&
            flightForm.mobile.trim()
        );
    };

    const isFormValid = bookingType === "HOTEL" ? isHotelFormValid() : isFlightFormValid();

    const handleSubmit = async () => {
        const preferences =
            bookingType === "HOTEL" ? hotelForm : flightForm;

        const mobile = bookingType === "HOTEL" ? hotelForm.mobile : flightForm.mobile;

        try {
            const res = await api.post("/bookings/create/", {
                user_id: userId,
                booking_type: bookingType,
                preferences,
                mobile
            });

            onRecommendation({
                ...res.data,
                type: bookingType,
                rooms: preferences.rooms || 1,
                check_in: preferences.check_in,
                check_out: preferences.check_out,
                passengers: preferences.passengers || 1,
                travel_date: preferences.travel_date || "",
                rating: preferences.rating || null,
                mobile: mobile || "",
            });
        } catch (err) {
            alert(JSON.stringify(err.response?.data.error || "Error occurred"));
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user_id");
        navigate('/');
    }

    return (
        <div className="booking-form">
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>{bookingType} Booking</h3>
                <button className="logout-btn" onClick={() => { handleLogout() }}>Logout</button>
            </div>
            <select
                className="booking-type-select"
                value={bookingType}
                onChange={(e) => setBookingType(e.target.value)}
            >
                <option value="HOTEL">Hotel</option>
                <option value="FLIGHT">Flight</option>
            </select>

            <div className="form-grid">
                {bookingType === "HOTEL" ? (
                    <>
                        <div>
                            <label className="form-label">Location</label>
                            <select
                                className="form-input select-input"
                                name="location"
                                value={hotelForm.location}
                                onChange={(e) => handleChange(e, "hotel")}
                            >
                                <option value="">Select City</option>
                                {CITIES.map((city) => (
                                    <option key={city} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="form-label">Check-in Date</label>
                            <input
                                className="form-input"
                                type="date"
                                name="check_in"
                                value={hotelForm.check_in}
                                onChange={(e) => handleChange(e, "hotel")}
                            />
                        </div>
                        <div>
                            <label className="form-label">Check-out Date</label>
                            <input
                                className="form-input"
                                type="date"
                                name="check_out"
                                value={hotelForm.check_out}
                                onChange={(e) => handleChange(e, "hotel")}
                            />
                        </div>
                        <div>
                            <label className="form-label">Rooms</label>
                            <input
                                className="form-input"
                                type="number"
                                placeholder="Rooms"
                                name="rooms"
                                min="1"
                                value={hotelForm.rooms}
                                onChange={(e) => handleChange(e, "hotel")}
                            />
                        </div>
                        <div>
                            <label className="form-label">Guests</label>
                            <input
                                className="form-input"
                                type="number"
                                placeholder="Guests"
                                name="guests"
                                min="1"
                                value={hotelForm.guests}
                                onChange={(e) => handleChange(e, "hotel")}
                            />
                        </div>
                        <div>
                            <label className="form-label">Mobile</label>
                            <input
                                className="form-input"
                                type="tel"
                                placeholder="Mobile"
                                name="mobile"
                                value={hotelForm.mobile}
                                onChange={(e) => handleChange(e, "hotel")}
                            />
                        </div>
                        <div>
                            <label className="form-label">Budget (₹)</label>
                            <input
                                className="form-input"
                                type="number"
                                placeholder="Budget (₹)"
                                name="budget"
                                min="1000"
                                value={hotelForm.budget}
                                onChange={(e) => handleChange(e, "hotel")}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div>
                            <label className="form-label">From city</label>
                            <select
                                className="form-input select-input"
                                name="from_city"
                                value={flightForm.from_city}
                                onChange={(e) => handleChange(e, "flight")}
                            >
                                <option value="">Select From City</option>
                                {CITIES.map((city) => (
                                    <option key={city} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="form-label">To city</label>
                            <select
                                className="form-input select-input"
                                name="to_city"
                                value={flightForm.to_city}
                                onChange={(e) => handleChange(e, "flight")}
                            >
                                <option value="">Select To City</option>
                                {CITIES.map((city) => (
                                    <option key={city} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="form-label">Travel Date</label>
                            <input
                                className="form-input"
                                type="date"
                                name="travel_date"
                                value={flightForm.travel_date}
                                onChange={(e) => handleChange(e, "flight")}
                            />
                        </div>
                        <div>
                            <label className="form-label">Passengers</label>
                            <input
                                className="form-input"
                                type="number"
                                placeholder="Passengers"
                                name="passengers"
                                min="1"
                                value={flightForm.passengers}
                                onChange={(e) => handleChange(e, "flight")}
                            />
                        </div>
                        <div>
                            <label className="form-label">Mobile</label>
                            <input
                                className="form-input"
                                type="tel"
                                placeholder="Mobile"
                                name="mobile"
                                value={flightForm.mobile}
                                onChange={(e) => handleChange(e, "flight")}
                            />
                        </div>
                        <div>
                            <label className="form-label">Budget (₹)</label>
                            <input
                                className="form-input"
                                type="number"
                                placeholder="Budget (₹)"
                                name="budget"
                                min="1000"
                                value={flightForm.budget}
                                onChange={(e) => handleChange(e, "flight")}
                            />
                        </div>
                    </>
                )}
            </div>
            <button className={isFormValid ? "submit-btn" : "submit-btn disabled"} onClick={handleSubmit} disabled={!isFormValid}>
                Get Recommendation
            </button>
        </div>
    );
}
