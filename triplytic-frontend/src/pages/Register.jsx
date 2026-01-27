import api from "../api/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const register = async () => {
        await api.post("/users/register/", { email, password });
        navigate("/");
    };

    return (
        <div>
            <h2>Register</h2>
            <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
            <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
            <button onClick={register}>Register</button>
        </div>
    );
}
