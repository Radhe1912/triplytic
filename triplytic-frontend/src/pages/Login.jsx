import api from "../api/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const login = async () => {
        try {
            const res = await api.post("/users/login/", { email, password });
            localStorage.setItem("user_id", res.data.user_id);
            navigate("/dashboard");
        }
        catch (error) {
            setError("Invalid email or password");
            console.error("Login failed:", error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2>Login</h2>
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
                <button className="login-btn" onClick={login}>Login</button><br />
                <p>Don't have an account?</p>
                <button className="register-btn" onClick={() => navigate("/register")}>Register</button>
                {error && <h3 className="error-message">{error}</h3>}
            </div>
        </div>
    );
}
