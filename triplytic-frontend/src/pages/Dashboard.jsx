import { useEffect, useState } from "react";
import BookingForm from "../components/BookingForm";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

export default function Dashboard() {
    const [bookingData, setBookingData] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const navigate = useNavigate();

    const getNights = () => {
        if (!bookingData?.check_in || !bookingData?.check_out) return 1;

        const inDate = new Date(bookingData.check_in);
        const outDate = new Date(bookingData.check_out);

        const diff =
            (outDate.getTime() - inDate.getTime()) /
            (1000 * 60 * 60 * 24);

        return Math.max(diff, 1);
    };

    const rooms = bookingData?.rooms || 1;
    const nights = getNights();
    const mobile = bookingData?.mobile || "";
    const passengers = bookingData?.passengers || 1;
    const travel_date = bookingData?.travel_date || "";

    const getTotalPrice = (opt) => {
        if (!opt) return 0;

        if (bookingData.type === "HOTEL") {
            return opt.price_per_night * rooms * nights;
        }
        return opt.price * passengers;
    };

    useEffect(() => {
        if (bookingData?.recommendation) {
            setSelectedOption({
                ...bookingData.recommendation,
                _id: "BEST",
            });
        }
    }, [bookingData]);

    const confirmBooking = async () => {
        try {
            await api.post("/bookings/confirm/", {
                booking_id: bookingData.booking_id,
            });

            const totalAmount = getTotalPrice(selectedOption);

            const normalizedItem =
                bookingData.type === "HOTEL"
                    ? {
                        title: selectedOption.name,
                        subtitle: `${rooms} room × ${nights} night`,
                        unitPrice: selectedOption.price_per_night,
                        rating: selectedOption.rating,
                        location: selectedOption.location,
                    }
                    : {
                        title:
                            selectedOption.airline ||
                            selectedOption.carrier ||
                            "Flight",
                        subtitle: `${selectedOption.from_city} → ${selectedOption.to_city}`,
                        unitPrice: selectedOption.price,
                    };

            navigate("/payment", {
                state: {
                    bookingId: bookingData.booking_id,
                    bookingType: bookingData.type,
                    item: normalizedItem,
                    totalAmount,
                    rooms,
                    nights,
                    passengers,
                    travel_date,
                    check_in: bookingData.check_in,
                    check_out: bookingData.check_out,
                    mobile
                },
            });
        } catch {
            alert("Booking confirmation failed");
        }
    };

    if (!bookingData) {
        return (
            <div>
                <h2 className="page-title">Triplytic Dashboard</h2>
                <BookingForm onRecommendation={setBookingData} />
            </div>
        );
    }

    const options = [
        {
            ...bookingData.recommendation,
            _id: "BEST",
            isBest: true,
        },
        ...(bookingData.alternatives || []).map((o, i) => ({
            ...o,
            _id: `ALT-${i}`,
            isBest: false,
        })),
    ];

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">Triplytic Dashboard</h2>
            <BookingForm onRecommendation={setBookingData} />

            {bookingData && (
                <>
                    <div className="options-section">
                        <h3 className="section-title">Select an Option</h3>

                        {bookingData.type === "HOTEL" && (
                            <div className="summary-info">
                                <strong>
                                    {rooms} room × {nights} night{nights > 1 ? "s" : ""}
                                </strong>
                            </div>
                        )}

                        {bookingData.type === "FLIGHT" && (
                            <div className="summary-info">
                                <strong>
                                    {passengers} passenger{passengers > 1 ? "s" : ""}
                                </strong>
                            </div>
                        )}

                        <div className={`card-grid`}>
                            {options.map((opt) => (
                                <div
                                    key={opt._id}
                                    className={`option-card ${opt.isBest ? 'best' : ''}`}
                                    onClick={() => setSelectedOption(opt)}
                                >
                                    <input
                                        type="radio"
                                        className="card-radio"
                                        checked={selectedOption?._id === opt._id}
                                        onChange={() => setSelectedOption(opt)}
                                    />
                                    <div className="card-content">
                                        {bookingData.type === "HOTEL" ? (
                                            <>
                                                <h4>{opt.name}</h4>
                                                <p>₹{opt.price_per_night}/room/night</p>
                                                <p>
                                                    <span className="price-highlight">
                                                        Total: ₹{getTotalPrice(opt).toFixed(2)}
                                                    </span>
                                                </p>
                                                <p>Rating: {opt.rating} ⭐</p>
                                                <p>Location: {opt.location}</p>
                                            </>
                                        ) : (
                                            <>
                                                <h4>
                                                    {opt.airline} {opt.flight_number}
                                                </h4>
                                                <p>{opt.from_city} → {opt.to_city}</p>
                                                <p>₹{opt.price}/passenger</p>
                                                <p>
                                                    <span className="price-highlight">
                                                        Total: ₹{getTotalPrice(opt).toFixed(2)}
                                                    </span>
                                                </p>
                                                <p>Stops: {opt.stops}</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            className="confirm-btn"
                            onClick={confirmBooking}
                            disabled={!selectedOption}
                        >
                            Proceed with Booking
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
