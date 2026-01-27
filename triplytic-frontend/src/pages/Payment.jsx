import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import api from "../api/api";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const stripePromise = loadStripe(
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

function CheckoutForm({ bookingId }) {
    const stripe = useStripe();
    const elements = useElements();
    const [paymentId, setPaymentId] = useState(null);

    useEffect(() => {
        async function init() {
            const res = await api.post("/payments/create/", { booking_id: bookingId });
            setPaymentId(res.data.payment_id);
        }
        init();
    }, []);

    const pay = async () => {
        await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: "http://localhost:5173/dashboard" },
            redirect: "if_required"
        });

        await api.post("/payments/confirm/", { payment_id: paymentId });
        alert("Payment successful");
    };

    return (
        <div>
            <PaymentElement />
            <button onClick={pay}>Pay</button>
        </div>
    );
}

export default function Payment() {
    const { state } = useLocation();
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        async function getSecret() {
            const res = await api.post("/payments/create/", { booking_id: state.bookingId });
            setClientSecret(res.data.client_secret);
        }
        getSecret();
    }, []);

    return (
        clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm bookingId={state.bookingId} />
            </Elements>
        )
    );
}
