import { useState } from "react";
import axios from "axios";

export default function HotelBooking({ userId }) {
    const [form, setForm] = useState({
        location: "",
        check_in: "",
        check_out: "",
        rooms: 1,
        guests: 1,
        budget: 3000,
        priority: "PRICE"
    });

    const [recommendation, setRecommendation] = useState(null);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        try {
            const resp = await axios.post("http://127.0.0.1:8000/api/bookings/create/", {
                user_id: userId,
                booking_type: "HOTEL",
                preferences: form
            });
            setRecommendation(resp.data.recommendation);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Hotel Booking</h2>
            <input name="location" value={form.location} onChange={handleChange} placeholder="Location" />
            <input name="check_in" type="date" value={form.check_in} onChange={handleChange} />
            <input name="check_out" type="date" value={form.check_out} onChange={handleChange} />
            <input name="rooms" type="number" value={form.rooms} onChange={handleChange} />
            <input name="guests" type="number" value={form.guests} onChange={handleChange} />
            <input name="budget" type="number" value={form.budget} onChange={handleChange} />
            <select name="priority" value={form.priority} onChange={handleChange}>
                <option value="PRICE">Price</option>
                <option value="COMFORT">Comfort</option>
            </select>
            <button onClick={handleSubmit}>Get Recommendation</button>

            {recommendation && (
                <div>
                    <h3>Recommended Option:</h3>
                    <pre>{JSON.stringify(recommendation, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}
