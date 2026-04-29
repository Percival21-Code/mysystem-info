import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login";

const Dashboard = () => {
	return <h1>Dashboard</h1>;
};

const NotFound = () => {
	return <h1>Error: 404 | Page Not Found</h1>;
};

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/"
					element={<Navigate to="/login" />}
				/>
				<Route
					path="/login"
					element={<Login />}
				/>
				<Route
					path="/dashboard"
					element={<Dashboard />}
				/>
				<Route
					path="/*"
					element={<NotFound />}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
