import { useState } from "react";
import api from "../api/api";

export default function BookingForm({ onBookingCreated }) {
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
    });

    const [flightForm, setFlightForm] = useState({
        from_city: "",
        to_city: "",
        travel_date: "",
        passengers: 1,
        budget: 4000,
        priority: "PRICE",
    });

    const handleChange = (e, formType) => {
        const value = e.target.type === "number" ? Number(e.target.value) : e.target.value;
        if (formType === "hotel") setHotelForm({ ...hotelForm, [e.target.name]: value });
        else setFlightForm({ ...flightForm, [e.target.name]: value });
    };

    const handleSubmit = async () => {
        const preferences = bookingType === "HOTEL" ? hotelForm : flightForm;

        try {
            const res = await api.post("/bookings/create/", {
                user_id: userId,
                booking_type: bookingType,
                preferences,
            });

            onBookingCreated({
                bookingId: res.data.booking_id,
                recommendation: res.data.recommendation
            });

        } catch (err) {
            console.error("Backend error:", err.response?.data);
            alert(JSON.stringify(err.response?.data, null, 2));
        }
    };


    return (
        <div>
            <h3>{bookingType} Booking</h3>
            <select value={bookingType} onChange={(e) => setBookingType(e.target.value)}>
                <option value="HOTEL">Hotel</option>
                <option value="FLIGHT">Flight</option>
            </select>

            {bookingType === "HOTEL" ? (
                <div>
                    <input name="location" placeholder="Location" value={hotelForm.location} onChange={(e) => handleChange(e, "hotel")} />
                    <input name="check_in" type="date" value={hotelForm.check_in} onChange={(e) => handleChange(e, "hotel")} />
                    <input name="check_out" type="date" value={hotelForm.check_out} onChange={(e) => handleChange(e, "hotel")} />
                    <input name="rooms" type="number" value={hotelForm.rooms} onChange={(e) => handleChange(e, "hotel")} />
                    <input name="guests" type="number" value={hotelForm.guests} onChange={(e) => handleChange(e, "hotel")} />
                    <input name="budget" type="number" value={hotelForm.budget} onChange={(e) => handleChange(e, "hotel")} />
                    <select name="priority" value={hotelForm.priority} onChange={(e) => handleChange(e, "hotel")}>
                        <option value="PRICE">Lowest Price</option>
                        <option value="COMFORT">Best Comfort</option>
                    </select>
                </div>
            ) : (
                <div>
                    <input name="from_city" placeholder="From" value={flightForm.from_city} onChange={(e) => handleChange(e, "flight")} />
                    <input name="to_city" placeholder="To" value={flightForm.to_city} onChange={(e) => handleChange(e, "flight")} />
                    <input name="travel_date" type="date" value={flightForm.travel_date} onChange={(e) => handleChange(e, "flight")} />
                    <input name="passengers" type="number" value={flightForm.passengers} onChange={(e) => handleChange(e, "flight")} />
                    <input name="budget" type="number" value={flightForm.budget} onChange={(e) => handleChange(e, "flight")} />
                    <select name="priority" value={flightForm.priority} onChange={(e) => handleChange(e, "flight")}>
                        <option value="PRICE">Lowest Price</option>
                        <option value="COMFORT">Best Comfort</option>
                    </select>
                </div>
            )}

            <button onClick={handleSubmit}>Get Recommendation</button>
        </div>
    );
}
