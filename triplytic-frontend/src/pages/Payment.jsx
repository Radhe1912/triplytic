import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import api from "../api/api";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/Payment.css";

const stripePromise = loadStripe(
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

function CheckoutForm({ bookingData }) {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const pay = async () => {
        if (!stripe || !elements) return;

        const { error } = await stripe.confirmPayment({
            elements,
            redirect: "if_required",
        });

        if (error) {
            alert(error.message);
            return;
        }

        navigate("/invoice", {
            state: {
                bookingData,
            },
        });
    };

    return (
        <div>
            <PaymentElement />
            <button className="pay-btn" onClick={pay}>Pay</button>
        </div>
    );
}

export default function Payment() {
    const { state } = useLocation();
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        async function getSecret() {
            const res = await api.post("/payments/create/", {
                booking_id: state.bookingId,
            });
            setClientSecret(res.data.client_secret);
        }
        getSecret();
    }, []);

    return (
        clientSecret && (
            <div className="payment-container">
                <div className="payment-summary">
                    <h3>Payment Details</h3>
                    <div className="payment-details">
                        <p><strong>Booking:</strong> {state.bookingType}</p>
                        <div>
                            {state.bookingType === "HOTEL" ? (
                                <h3>Hotel: {state.item.title}</h3>
                            ) : (
                                <h3>Flight: {state.item.title}</h3>
                            )}
                        </div>
                        <p>
                            {state.bookingType === "HOTEL"
                                ? `Check-in: ${state.check_in} | Check-out: ${state.check_out}`
                                : `Date: ${state.travel_date}`
                            }
                        </p>
                        <p>Unit Price: ₹{Number(state.item.unitPrice).toFixed(2)}</p>
                        {state.bookingType === "HOTEL" ? (
                            <p>Rooms: {state.rooms} | Nights: {state.nights}</p>
                        ) : (
                            <p>Passengers: {state.passengers}</p>
                        )}
                        <h4>Total Payable: ₹{Number(state.totalAmount).toFixed(2)}</h4>
                    </div>
                </div>

                <div className="stripe-container">
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <CheckoutForm bookingData={state} />
                    </Elements>
                </div>
            </div>
        )
    );
}
