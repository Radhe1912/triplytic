import api from "../api/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const register = async () => {
        try {
            await api.post("/users/register/", { email, password });
            alert("Account created successfully! Please log in.");
            navigate("/");
        }
        catch (error) {
            setError("Account creation failed");
            console.error("Registration failed:", error);
        }
    };

    return (
        <div className="register-container">
            <div className="register-form">
                <h2>Register</h2>
                <div className="form-group">
                    <input
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <input
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <button className="register-btn" onClick={register}>Register</button><br />
                <p>Already have an account?</p>
                <button className="login-btn" onClick={() => navigate("/")}>Login</button>
                {error && <h3 className="error-message">{error}</h3>}
            </div>
        </div>
    );
}
