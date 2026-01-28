import { useState } from "react";
import api from "../api/api";
import "../styles/BookingForm.css";

export default function BookingForm({ onRecommendation }) {
    const userId = localStorage.getItem("user_id");
    const [bookingType, setBookingType] = useState("HOTEL");

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

    return (
        <div className="booking-form">
            <h3>{bookingType} Booking</h3>
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
                        <input
                            className="form-input"
                            name="location"
                            placeholder="Location (e.g., Goa)"
                            value={hotelForm.location}
                            onChange={(e) => handleChange(e, "hotel")}
                        />
                        <input
                            className="form-input"
                            type="date"
                            name="check_in"
                            value={hotelForm.check_in}
                            onChange={(e) => handleChange(e, "hotel")}
                        />
                        <input
                            className="form-input"
                            type="date"
                            name="check_out"
                            value={hotelForm.check_out}
                            onChange={(e) => handleChange(e, "hotel")}
                        />
                        <input
                            className="form-input"
                            type="number"
                            placeholder="Rooms"
                            name="rooms"
                            min="1"
                            value={hotelForm.rooms}
                            onChange={(e) => handleChange(e, "hotel")}
                        />
                        <input
                            className="form-input"
                            type="number"
                            placeholder="Guests"
                            name="guests"
                            min="1"
                            value={hotelForm.guests}
                            onChange={(e) => handleChange(e, "hotel")}
                        />
                        <input
                            className="form-input"
                            type="tel"
                            placeholder="Mobile"
                            name="mobile"
                            value={hotelForm.mobile}
                            onChange={(e) => handleChange(e, "hotel")}
                        />
                        <input
                            className="form-input"
                            type="number"
                            placeholder="Budget (₹)"
                            name="budget"
                            min="1000"
                            value={hotelForm.budget}
                            onChange={(e) => handleChange(e, "hotel")}
                        />
                    </>
                ) : (
                    <>
                        <input
                            className="form-input"
                            name="from_city"
                            placeholder="From City"
                            value={flightForm.from_city}
                            onChange={(e) => handleChange(e, "flight")}
                        />
                        <input
                            className="form-input"
                            name="to_city"
                            placeholder="To City"
                            value={flightForm.to_city}
                            onChange={(e) => handleChange(e, "flight")}
                        />
                        <input
                            className="form-input"
                            type="date"
                            name="travel_date"
                            value={flightForm.travel_date}
                            onChange={(e) => handleChange(e, "flight")}
                        />
                        <input
                            className="form-input"
                            type="number"
                            placeholder="Passengers"
                            name="passengers"
                            min="1"
                            value={flightForm.passengers}
                            onChange={(e) => handleChange(e, "flight")}
                        />
                        <input
                            className="form-input"
                            type="tel"
                            placeholder="Mobile"
                            name="mobile"
                            value={flightForm.mobile}
                            onChange={(e) => handleChange(e, "flight")}
                        />
                        <input
                            className="form-input"
                            type="number"
                            placeholder="Budget (₹)"
                            name="budget"
                            min="1000"
                            value={flightForm.budget}
                            onChange={(e) => handleChange(e, "flight")}
                        />
                    </>
                )}
            </div>
            <button className="submit-btn" onClick={handleSubmit}>
                Get Recommendation
            </button>
        </div>
    );
}
