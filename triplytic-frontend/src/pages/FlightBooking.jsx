import { useState } from "react";
import axios from "axios";

export default function FlightBooking({ userId }) {
    const [form, setForm] = useState({
        from_city: "",
        to_city: "",
        travel_date: "",
        passengers: 1,
        budget: 4000,
        priority: "PRICE"
    });

    const [recommendation, setRecommendation] = useState(null);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        try {
            const resp = await axios.post("http://127.0.0.1:8000/api/bookings/create/", {
                user_id: userId,
                booking_type: "FLIGHT",
                preferences: form
            });
            setRecommendation(resp.data.recommendation);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Flight Booking</h2>
            <input name="from_city" value={form.from_city} onChange={handleChange} placeholder="From" />
            <input name="to_city" value={form.to_city} onChange={handleChange} placeholder="To" />
            <input name="travel_date" type="date" value={form.travel_date} onChange={handleChange} />
            <input name="passengers" type="number" value={form.passengers} onChange={handleChange} />
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
