import api from "../api/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const login = async () => {
        const res = await api.post("/users/login/", { email, password });
        localStorage.setItem("user_id", res.data.user_id);
        navigate("/dashboard");
    };

    return (
        <div>
            <h2>Login</h2>
            <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
            <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
            <button onClick={login}>Login</button>
        </div>
    );
}
