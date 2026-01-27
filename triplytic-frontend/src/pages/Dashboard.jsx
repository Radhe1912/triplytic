import { useState } from "react";
import BookingForm from "../components/BookingForm";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [recommendation, setRecommendation] = useState(null);
    const [bookingId, setBookingId] = useState(null);

    const navigate = useNavigate();

    const confirmBooking = async () => {
        await api.post("/bookings/confirm/", {
            booking_id: bookingId
        });

        navigate("/payment", { state: { bookingId } });
    };


    const handleBookingCreated = ({ bookingId, recommendation }) => {
        setBookingId(bookingId);
        setRecommendation(recommendation);
    };


    return (
        <div>
            <h2>Triplytic Dashboard</h2>

            <BookingForm onBookingCreated={handleBookingCreated} />

            {recommendation && bookingId && (
                <div>
                    <h3>Recommended Option</h3>
                    <p>Name: {recommendation.name}</p>
                    <p>Price: ₹{recommendation.price}</p>
                    <p>Why: {recommendation.reason}</p>
                    <button onClick={confirmBooking}>Proceed with Booking</button>
                </div>
            )}
        </div>
    );
}
