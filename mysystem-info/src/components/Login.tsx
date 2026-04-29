import { useState } from "react";
import "../styles/LoginStyles.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
	const [customerNo, setCustomerNo] = useState("");
	const [emailAddress, setEmailAddress] = useState("");
	const [password, setPassword] = useState("");
	const [status, setStatus] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setError("");
		setStatus("");

		if (!customerNo || !emailAddress || !password) {
			setError("Please fill in all fields.");
			return;
		}

		setStatus("Logging in...");
		console.log({ customerNo, emailAddress });
		navigate("/dashboard");
	};

	return (
		<div className="login-box">
			<h1 className="login-header">MySystem Login</h1>

			<form
				className="login-form"
				onSubmit={handleLogin}
			>
				<div className="login-input-boxes">
					<input
						type="text"
						placeholder="Customer No."
						value={customerNo}
						onChange={(e) => setCustomerNo(e.target.value)}
					/>

					<input
						type="email"
						placeholder="Email Address"
						value={emailAddress}
						onChange={(e) => setEmailAddress(e.target.value)}
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

				<button
					className="login-button"
					type="submit"
				>
					Login
				</button>
			</form>
		</div>
	);
};

export default Login;
