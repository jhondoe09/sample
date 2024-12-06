import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate(); // React Router's navigate function

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:5000/login", {
                username,
                password,
            });

            // Save token to localStorage
            console.log(response);
            localStorage.setItem("token", response.data.token);
            setMessage("Login successful!");
            navigate("/home");
        } catch (error) {
            setMessage(error.response?.data?.message || "An error occurred.");
        }
    };

    return (
        <div className="container my-5">
            <div className="position-relative p-5 text-muted bg-body border border-dashed rounded-5">
                <div className="col-md-12 row gap-2">
                    <h2>Login</h2>
                    <form onSubmit={handleLogin}>
                        <label>Username:</label>
                        <input
                            className="form-control"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <label>Password:</label>
                        <input
                            className="form-control"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button className="form-control btn btn-secondary" type="submit" onClick={handleLogin}>Login</button>
                    </form>
                    {message && <p>{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default Login;
