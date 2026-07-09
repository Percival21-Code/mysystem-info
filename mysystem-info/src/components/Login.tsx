import { useState } from "react";
import "../styles/LoginStyles.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../data/auth/useAuth";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [status, setStatus] = useState("");
	const [error, setError] = useState("");

	const navigate = useNavigate();
	const { login } = useAuth();

	const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		setError("");
		setStatus("");

		if (!username || !password) {
			setError("Please fill in all fields.");
			return;
		}

		try {
			setStatus("Logging in...");

			await login({
				username,
				password,
			});

			navigate("/app/dashboard");
		} catch (err) {
			setStatus("");
			setError(err instanceof Error ? err.message : "Login failed.");
		}
	};

	return (
		<div className="login-page">
			<div className="login-box">
			<h1 className="login-header">Log In</h1>

			<form className="login-form" onSubmit={handleLogin}>
				<div className="login-input-boxes">
					<input
						type="text"
						placeholder="Username or Email"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>

					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>

				{error && <p className="login-error">{error}</p>}
				{status && <p className="login-status">{status}</p>}

				<button className="login-button" type="submit">
					Login
				</button>
			</form>
		</div>
		</div>
		
	);
};

export default Login;